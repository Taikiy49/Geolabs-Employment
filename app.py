# app.py
from __future__ import annotations

import base64
import io
import json
import os
import re
import smtplib
from email.message import EmailMessage
from typing import Any, Dict, List, Tuple, Optional

from flask import Flask, request, jsonify
from flask_cors import CORS

from pypdf import PdfReader
import docx

import google.generativeai as genai
from google.api_core.exceptions import PermissionDenied

# PDF (ReportLab)
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Image,
)

# -------------------------------------------------------
# Config
# -------------------------------------------------------
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")

if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
else:
    print("⚠️ GEMINI_API_KEY not set – resume autofill will use a regex fallback.")

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt"}

# Email config (SMTP) - set these in your server env
MAIL_TO = os.getenv("APPLICATION_MAIL_TO", "tyamashita@geolabs.net")
MAIL_FROM = os.getenv("APPLICATION_MAIL_FROM", "no-reply@geolabs.net")
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() in {"1", "true", "yes"}

app = Flask(__name__)

@app.before_request
def log_request() -> None:
    print(f"➡ {request.method} {request.path}")

app.secret_key = os.getenv("FLASK_SECRET_KEY", "CHANGE_ME_IN_PRODUCTION")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                frontend_url,
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ]
        }
    },
    supports_credentials=True,
)

# -------------------------------------------------------
# File helpers
# -------------------------------------------------------
def get_extension(filename: str) -> str:
    filename = filename or ""
    if "." not in filename:
        return ""
    return "." + filename.rsplit(".", 1)[-1].lower()


def extract_text_from_pdf(file_storage) -> str:
    reader = PdfReader(file_storage.stream)
    pages: List[str] = []
    for page in reader.pages:
        text = page.extract_text() or ""
        pages.append(text)
    return "\n\n".join(pages)


def extract_text_from_docx(file_storage) -> str:
    file_bytes = file_storage.read()
    stream = io.BytesIO(file_bytes)
    document = docx.Document(stream)
    paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def extract_text_from_txt(file_storage) -> str:
    data = file_storage.read()
    try:
        return data.decode("utf-8", errors="ignore")
    except Exception:
        return data.decode("latin-1", errors="ignore")


def extract_text_from_file(file_storage) -> str:
    ext = get_extension(file_storage.filename)
    if ext == ".pdf":
        return extract_text_from_pdf(file_storage)
    elif ext in {".doc", ".docx"}:
        return extract_text_from_docx(file_storage)
    elif ext == ".txt":
        return extract_text_from_txt(file_storage)
    else:
        raise ValueError(f"Unsupported file type: {ext or 'unknown'}")

# -------------------------------------------------------
# Resume schema / AI prompt (expanded)
# -------------------------------------------------------
RESUME_SCHEMA_DESCRIPTION = """
Return a JSON object with the following structure:

{
  "contact": {
    "name": "Full Name or null",
    "email": "Primary email or null",
    "phone": "Phone number or null",
    "cell": "Cell/mobile number or null",
    "address": "Street address (single line) or null",
    "city": "City or null",
    "state": "State or null",
    "zip": "Postal code or null",
    "location": "City, State (or similar) if clearly stated, else null"
  },
  "targetRole": "Position sought / target role if clearly stated, else null",
  "employment": [
    {
      "company": "Company name",
      "address": "City/State if available, else null",
      "phone": "Company or supervisor phone if clearly shown, else null",
      "position": "Job title",
      "dateFrom": "Start date in original resume format if possible",
      "dateTo": "End date or 'Present' if current",
      "duties": "1–3 line summary of key responsibilities",
      "reasonForLeaving": "Reason for leaving if clearly stated, else null",
      "supervisor": "Supervisor name if clearly indicated, else null"
    }
  ],
  "education": {
    "graduate": "Most recent college/university name or null",
    "graduateYears": "Years attended or graduation year or null",
    "graduateMajor": "Major or field of study or null",
    "trade": "Trade/vocational school name or null",
    "tradeYears": "Years or null",
    "tradeMajor": "Program or concentration or null",
    "high": "High school name if listed, else null",
    "highYears": "Years or graduation year or null",
    "highMajor": null
  },
  "skills": {
    "typingSpeed": "Numeric WPM if explicitly stated, else null",
    "tenKey": "Numeric 10-key KPH if stated, else null",
    "tenKeyMode": "'touch' or 'sight' if explicitly stated, else null",
    "computerSkills": "Short sentence listing main software / technical skills",
    "driverLicense": "Driver license info if explicitly stated, else null"
  },
  "references": [
    {
      "name": "Reference name",
      "company": "Company or relationship if clear",
      "phone": "Phone number if clearly shown, else null"
    }
  ]
}

Rules:
- If the resume doesn't clearly specify data, use null instead of guessing.
- DO NOT invent employers, dates, degrees, addresses, or licenses not supported by the text.
- Keep free-text fields (duties, computerSkills) concise but informative.
"""

SYSTEM_INSTRUCTIONS = """
You are an expert resume parser for an employment application form.

Your job:
- Read the resume text.
- Extract ONLY information clearly supported by the text.
- Map it EXACTLY into the requested JSON schema.
- Do NOT include any commentary, explanation, or additional keys.
- Output MUST be valid JSON and ONLY the JSON object (no Markdown, no backticks).

Be conservative:
- If you are uncertain about dates, supervisor names, phone numbers, etc., set those fields to null.
- Do not make up graduation years or company addresses.
"""

# -------------------------------------------------------
# Gemini helpers
# -------------------------------------------------------
def _extract_text_from_candidate(response) -> Tuple[str, Any]:
    if not getattr(response, "candidates", None):
        raise ValueError("Model returned no candidates.")

    cand = response.candidates[0]
    finish_reason = getattr(cand, "finish_reason", None)

    content = getattr(cand, "content", None)
    parts = content.parts if content else []
    text_chunks: List[str] = []

    for p in parts:
        if hasattr(p, "text") and p.text:
            text_chunks.append(p.text)

    raw = "".join(text_chunks).strip()

    if not raw:
        raise ValueError(
            f"Model returned an empty response (finish_reason={finish_reason}). "
            "This usually means the response was blocked or truncated."
        )

    return raw, finish_reason


def call_generative_parser(text: str) -> Dict[str, Any]:
    if not GEMINI_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    max_chars = 20000
    excerpt = text[:max_chars]
    truncated = len(text) > max_chars

    model = genai.GenerativeModel(GEMINI_MODEL)

    prompt = f"""
{SYSTEM_INSTRUCTIONS}

Here is the resume text:

\"\"\"{excerpt}\"\"\"


Now, following this schema:

{RESUME_SCHEMA_DESCRIPTION}

Return ONLY the JSON object described above.
"""

    response = model.generate_content(prompt)

    raw, finish_reason = _extract_text_from_candidate(response)

    if raw.startswith("```"):
        raw = raw.strip("`\n ")
        if raw.lower().startswith("json"):
            raw = raw[4:].lstrip()

    try:
        parsed = json.loads(raw)
    except Exception as e:
        raise ValueError(
            f"Failed to parse JSON from model output: {e}\n"
            f"Finish reason: {finish_reason}\n"
            f"Raw (first 400 chars): {raw[:400]}"
        )

    return {
        "data": parsed,
        "meta": {
            "model": GEMINI_MODEL,
            "truncated": truncated,
            "finish_reason": str(finish_reason),
            "excerpt_chars": len(excerpt),
        },
    }

# -------------------------------------------------------
# Regex fallback parser (fills contact + a little extra)
# -------------------------------------------------------
_EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)
_PHONE_RE = re.compile(
    r"(?:(?:\+?1[\s\-\.])?\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4})(?:\s*(?:x|ext\.?)\s*\d+)?",
    re.I,
)
_ZIP_RE = re.compile(r"\b\d{5}(?:-\d{4})?\b")
_STATE_RE = re.compile(
    r"\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b"
)
_CITYSTATE_RE = re.compile(
    r"\b([A-Za-z][A-Za-z .'-]{1,30}),\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b"
)

def _first_nonempty_line(text: str) -> Optional[str]:
    for line in (text or "").splitlines():
        s = line.strip()
        if s:
            return s
    return None

def basic_fallback_parse(text: str) -> Dict[str, Any]:
    email = None
    m = _EMAIL_RE.search(text or "")
    if m:
        email = m.group(0)

    phones = _PHONE_RE.findall(text or "")
    phone = phones[0] if phones else None
    cell = phones[1] if len(phones) > 1 else None

    name = None
    first_line = _first_nonempty_line(text)
    if first_line and "@" not in first_line and len(first_line) <= 60:
        if re.fullmatch(r"[A-Za-z .'-]{2,60}", first_line):
            name = first_line.strip()

    location = None
    city = None
    state = None
    zip_code = None

    cm = _CITYSTATE_RE.search(text or "")
    if cm:
        city = cm.group(1).strip()
        state = cm.group(2).strip()
        location = f"{city}, {state}"

    zm = _ZIP_RE.search(text or "")
    if zm:
        zip_code = zm.group(0)

    if not state:
        sm = _STATE_RE.search(text or "")
        if sm:
            state = sm.group(1)

    return {
        "contact": {
            "name": name,
            "email": email,
            "phone": phone,
            "cell": cell,
            "address": None,
            "city": city,
            "state": state,
            "zip": zip_code,
            "location": location,
        },
        "targetRole": None,
        "employment": [],
        "education": {
            "graduate": None,
            "graduateYears": None,
            "graduateMajor": None,
            "trade": None,
            "tradeYears": None,
            "tradeMajor": None,
            "high": None,
            "highYears": None,
            "highMajor": None,
        },
        "skills": {
            "typingSpeed": None,
            "tenKey": None,
            "tenKeyMode": None,
            "computerSkills": None,
            "driverLicense": None,
        },
        "references": [],
    }

# -------------------------------------------------------
# Normalization
# -------------------------------------------------------
def normalize_parsed_resume(data: Dict[str, Any]) -> Dict[str, Any]:
    data = data or {}

    contact = data.get("contact") or {}
    employment = data.get("employment") or []
    education = data.get("education") or {}
    skills = data.get("skills") or {}
    references = data.get("references") or []

    norm_emp: List[Dict[str, Any]] = []
    for job in (employment or [])[:3]:
        job = job or {}
        norm_emp.append(
            {
                "company": job.get("company"),
                "address": job.get("address"),
                "phone": job.get("phone"),
                "position": job.get("position"),
                "dateFrom": job.get("dateFrom") or job.get("startDate"),
                "dateTo": job.get("dateTo") or job.get("endDate"),
                "duties": job.get("duties") or job.get("summary"),
                "reasonForLeaving": job.get("reasonForLeaving") or job.get("reason"),
                "supervisor": job.get("supervisor"),
            }
        )

    norm_refs: List[Dict[str, Any]] = []
    for ref in (references or [])[:3]:
        ref = ref or {}
        norm_refs.append(
            {
                "name": ref.get("name"),
                "company": ref.get("company"),
                "phone": ref.get("phone"),
            }
        )

    return {
        "contact": {
            "name": contact.get("name"),
            "email": contact.get("email"),
            "phone": contact.get("phone"),
            "cell": contact.get("cell") or contact.get("mobile"),
            "address": contact.get("address"),
            "city": contact.get("city"),
            "state": contact.get("state"),
            "zip": contact.get("zip"),
            "location": contact.get("location"),
        },
        "targetRole": data.get("targetRole") or data.get("objective") or data.get("position"),
        "employment": norm_emp,
        "education": {
            "graduate": education.get("graduate"),
            "graduateYears": education.get("graduateYears"),
            "graduateMajor": education.get("graduateMajor"),
            "trade": education.get("trade"),
            "tradeYears": education.get("tradeYears"),
            "tradeMajor": education.get("tradeMajor"),
            "high": education.get("high"),
            "highYears": education.get("highYears"),
            "highMajor": education.get("highMajor"),
        },
        "skills": {
            "typingSpeed": skills.get("typingSpeed"),
            "tenKey": skills.get("tenKey"),
            "tenKeyMode": skills.get("tenKeyMode"),
            "computerSkills": skills.get("computerSkills"),
            "driverLicense": skills.get("driverLicense"),
        },
        "references": norm_refs,
    }

def make_empty_parsed() -> Dict[str, Any]:
    return normalize_parsed_resume(
        {
            "contact": {
                "name": None,
                "email": None,
                "phone": None,
                "cell": None,
                "address": None,
                "city": None,
                "state": None,
                "zip": None,
                "location": None,
            },
            "targetRole": None,
            "employment": [],
            "education": {},
            "skills": {},
            "references": [],
        }
    )

# -------------------------------------------------------
# PDF helpers (HR print-ready)
# -------------------------------------------------------
def _safe(v: Any) -> str:
    if v is None:
        return "—"
    if isinstance(v, bool):
        return "Yes" if v else "No"
    s = str(v).strip()
    return s if s else "—"

def _flatten_dict(d: Dict[str, Any], prefix: str = "") -> List[Tuple[str, str]]:
    rows: List[Tuple[str, str]] = []
    for k in sorted((d or {}).keys()):
        key = f"{prefix}{k}" if not prefix else f"{prefix}.{k}"
        v = d[k]
        if isinstance(v, dict):
            rows.extend(_flatten_dict(v, key))
        elif isinstance(v, list):
            if not v:
                rows.append((key, "—"))
            else:
                preview = []
                for i, item in enumerate(v[:5]):
                    if isinstance(item, dict):
                        preview.append(
                            f"[{i}] " + ", ".join(f"{ik}={_safe(iv)}" for ik, iv in item.items())
                        )
                    else:
                        preview.append(f"[{i}] {_safe(item)}")
                if len(v) > 5:
                    preview.append(f"... (+{len(v)-5} more)")
                rows.append((key, "\n".join(preview)))
        else:
            rows.append((key, _safe(v)))
    return rows

def build_application_pdf(payload: Dict[str, Any]) -> bytes:
    form = payload.get("form") or {}
    legal = payload.get("legalText") or {}
    client_meta = payload.get("clientMeta") or {}
    submitted_at = payload.get("submittedAt")

    applicant_name = _safe(form.get("name"))
    position = _safe(form.get("position"))
    location = _safe(form.get("location"))
    email_addr = _safe(form.get("email"))
    phone = _safe(form.get("phone"))

    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=LETTER,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
        title=f"Employment Application - {applicant_name}",
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="H1", parent=styles["Heading1"], fontSize=16, leading=20, spaceAfter=8))
    styles.add(ParagraphStyle(name="H2", parent=styles["Heading2"], fontSize=12, leading=15, spaceBefore=10, spaceAfter=6))
    styles.add(ParagraphStyle(name="Small", parent=styles["BodyText"], fontSize=9, leading=11))

    story: List[Any] = []

    # Cover / summary
    story.append(Paragraph("GEOLABS, INC.", styles["H1"]))
    story.append(Paragraph("Employment Application & Required Notices", styles["H2"]))
    story.append(Paragraph("Secure · Confidential · Online Submission", styles["BodyText"]))
    story.append(Spacer(1, 10))

    meta_rows = [
        ["Submitted At", _safe(submitted_at)],
        ["Applicant Name", applicant_name],
        ["Position Applying For", position],
        ["Preferred Location", location],
        ["Email", email_addr],
        ["Phone", phone],
        ["Client Timezone", _safe(client_meta.get("timezone"))],
    ]
    meta_table = Table(meta_rows, colWidths=[2.0 * inch, 4.8 * inch])
    meta_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.black),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.grey),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # Full details table (field-by-field)
    story.append(Paragraph("Full Application Details", styles["H2"]))
    story.append(Paragraph("Complete record of all submitted fields.", styles["Small"]))
    story.append(Spacer(1, 6))

    rows = _flatten_dict(form)
    table_data = [["Field", "Value"]]
    for k, v in rows:
        table_data.append(
            [
                Paragraph(_safe(k), styles["Small"]),
                Paragraph(_safe(v).replace("\n", "<br/>"), styles["Small"]),
            ]
        )

    details_table = Table(table_data, colWidths=[2.2 * inch, 4.6 * inch], repeatRows=1)
    details_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f3f4f6")),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.black),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.grey),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(details_table)

    # Signed agreement page (separate page)
    story.append(PageBreak())
    story.append(Paragraph("Alcohol & Drug Testing Program Agreement", styles["H1"]))
    story.append(Paragraph("Exact text presented to the applicant:", styles["H2"]))

    agreement_text = legal.get("alcoholDrugProgram") or "— (Agreement text was not provided by client payload.)"
    story.append(Paragraph(agreement_text.replace("\n", "<br/>"), styles["Small"]))
    story.append(Spacer(1, 14))

    story.append(Paragraph("Applicant Attestation", styles["H2"]))
    sig_text = _safe(form.get("drugAgreementSignature"))
    sig_date = _safe(form.get("drugAgreementDate"))

    att_rows = [
        ["Signature (typed)", sig_text],
        ["Date", sig_date],
    ]
    att_t = Table(att_rows, colWidths=[2.0 * inch, 4.8 * inch])
    att_t.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.8, colors.black),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.grey),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTSIZE", (0, 0), (-1, -1), 11),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.append(att_t)
    story.append(Spacer(1, 10))

    # Optional: drawn signature image (Data URL)
    sigs = payload.get("signatures") or {}
    data_url = sigs.get("drugAgreementSignatureDataUrl")
    if isinstance(data_url, str) and data_url.startswith("data:image"):
        try:
            header, b64 = data_url.split(",", 1)
            img_bytes = base64.b64decode(b64)
            img_buf = io.BytesIO(img_bytes)
            story.append(Paragraph("Signature (drawn)", styles["Small"]))
            story.append(Spacer(1, 6))
            story.append(Image(img_buf, width=3.0 * inch, height=1.0 * inch))
        except Exception:
            story.append(Paragraph("Signature (drawn): — (Could not decode image)", styles["Small"]))

    # Optional: other required notice page
    required_notice = legal.get("requiredNotice")
    if required_notice and str(required_notice).strip():
        story.append(PageBreak())
        story.append(Paragraph("Required Notice", styles["H1"]))
        story.append(Paragraph("Exact text presented to the applicant:", styles["H2"]))
        story.append(Paragraph(str(required_notice).replace("\n", "<br/>"), styles["Small"]))

    story.append(Spacer(1, 18))
    story.append(
        Paragraph(
            "Generated automatically from the online application system. Print-ready for HR review and compliance recordkeeping.",
            styles["Small"],
        )
    )

    doc.build(story)
    return buf.getvalue()

# -------------------------------------------------------
# Email helper
# -------------------------------------------------------
def send_application_email(payload: Dict[str, Any]) -> None:
    """
    Emails a print-ready PDF to HR (APPLICATION_MAIL_TO).
    Requires SMTP_* env vars configured.
    """
    if not SMTP_HOST:
        raise RuntimeError("SMTP_HOST is not configured on the server.")

    form = payload.get("form") or {}
    applicant_name = form.get("name") or "Applicant"
    position = form.get("position") or "Unknown Position"
    applicant_email = form.get("email") or "No email"

    pdf_bytes = build_application_pdf(payload)

    msg = EmailMessage()
    msg["From"] = MAIL_FROM
    msg["To"] = MAIL_TO
    msg["Subject"] = f"New Employment Application: {applicant_name} — {position}"
    msg.set_content(
        "\n".join(
            [
                "A new employment application was submitted from the web form.",
                "",
                f"Name: {applicant_name}",
                f"Position: {position}",
                f"Applicant Email: {applicant_email}",
                "",
                "A print-ready PDF is attached for HR review.",
            ]
        )
    )

    filename_safe = re.sub(r"[^A-Za-z0-9._-]+", "_", str(applicant_name)).strip("_") or "Applicant"
    pdf_name = f"Employment_Application_{filename_safe}.pdf"

    msg.add_attachment(pdf_bytes, maintype="application", subtype="pdf", filename=pdf_name)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as server:
        if SMTP_USE_TLS:
            server.starttls()
        if SMTP_USER and SMTP_PASS:
            server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)

# -------------------------------------------------------
# Routes
# -------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health() -> Any:
    return jsonify(
        {
            "status": "ok",
            "autofill_ready": bool(GEMINI_KEY),
            "gemini_key_set": bool(GEMINI_KEY),
            "model": GEMINI_MODEL,
            "mail_to": MAIL_TO,
            "smtp_ready": bool(SMTP_HOST),
        }
    )

@app.route("/api/parse-resume", methods=["POST"])
def parse_resume() -> Any:
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    ext = get_extension(file.filename)
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"error": f"Unsupported file type: {ext}"}), 400

    try:
        text = extract_text_from_file(file)
        if not text.strip():
            return jsonify({"error": "Could not extract text from resume."}), 400

        total_chars = len(text)

        try:
            result = call_generative_parser(text)
            raw_parsed = result["data"]
            meta = result["meta"]
            parsed = normalize_parsed_resume(raw_parsed)

            model_name = meta.get("model")
            truncated = meta.get("truncated", False)
            finish_reason = meta.get("finish_reason")
            excerpt_chars = meta.get("excerpt_chars", None)
            mode = "smart"
        except (PermissionDenied, RuntimeError, ValueError) as ai_err:
            print("⚠️ Smart parser failed, using regex fallback:", repr(ai_err))
            parsed = normalize_parsed_resume(basic_fallback_parse(text))

            model_name = "fallback-regex"
            truncated = False
            finish_reason = "FALLBACK"
            excerpt_chars = None
            mode = "fallback"

        return jsonify(
            {
                "parsed": parsed,
                "meta": {
                    "filename": file.filename,
                    "characters_used": total_chars,
                    "excerpt_chars": excerpt_chars,
                    "truncated": truncated,
                    "model": model_name,
                    "finish_reason": finish_reason,
                    "mode": mode,
                },
            }
        )
    except Exception as e:
        print("❌ /api/parse-resume error:", repr(e))
        return jsonify({"error": "Internal error while processing resume."}), 500

@app.route("/api/submit-application", methods=["POST"])
def submit_application() -> Any:
    """
    Receives full application payload from the Review step and emails a PDF.
    """
    try:
        payload = request.get_json(force=True, silent=False) or {}
        if not isinstance(payload, dict):
            return jsonify({"error": "Invalid payload."}), 400

        form = payload.get("form") or {}
        if not isinstance(form, dict):
            return jsonify({"error": "Invalid form object."}), 400

        send_application_email(payload)
        return jsonify({"status": "ok"})
    except RuntimeError as e:
        print("❌ /api/submit-application runtime error:", repr(e))
        return jsonify({"error": str(e)}), 500
    except smtplib.SMTPAuthenticationError as e:
        print("❌ SMTP auth error:", repr(e))
        return jsonify({"error": "SMTP authentication failed. Check SMTP_USER/SMTP_PASS or use an app password."}), 500
    except Exception as e:
        print("❌ /api/submit-application error:", repr(e))
        return jsonify({"error": "Internal error while submitting application."}), 500

if __name__ == "__main__":
    with app.app_context():
        print("🔍 Registered routes:")
        for rule in app.url_map.iter_rules():
            print(f"  {rule}")

    app.run(host="0.0.0.0", port=5000, debug=True)
