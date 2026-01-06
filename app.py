# app.py
from __future__ import annotations

import base64
import io
import json
import os
import re
import smtplib
import mimetypes
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

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "https://www.geolabs-employment.net",
                "https://geolabs-employment.net",
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

# -------------------------------------------------------
# PDF helpers (HR print-ready) - IMPROVED READABILITY
# -------------------------------------------------------
def _safe(v: Any) -> str:
    if v is None:
        return "—"
    if isinstance(v, bool):
        return "Yes" if v else "No"
    s = str(v).strip()
    return s if s else "—"

def _pretty_wrap(s: str, max_len: int = 120) -> str:
    """
    Adds soft line breaks into long values so tables remain readable.
    """
    s = (s or "").strip()
    if not s or s == "—":
        return "—"
    if len(s) <= max_len:
        return s
    # crude wrap on spaces
    out: List[str] = []
    cur: List[str] = []
    cur_len = 0
    for word in s.split():
        if cur_len + len(word) + (1 if cur else 0) > max_len:
            out.append(" ".join(cur))
            cur = [word]
            cur_len = len(word)
        else:
            cur.append(word)
            cur_len += len(word) + (1 if cur_len else 0)
    if cur:
        out.append(" ".join(cur))
    return "\n".join(out)

def _table_kv(
    rows: List[Tuple[str, Any]],
    styles,
    col_widths: Tuple[float, float],
    header: Tuple[str, str] = ("Field", "Value"),
    zebra: bool = True,
) -> Table:
    data = [[Paragraph(_safe(header[0]), styles["SmallBold"]), Paragraph(_safe(header[1]), styles["SmallBold"])]]
    for k, v in rows:
        data.append(
            [
                Paragraph(_safe(k), styles["Small"]),
                Paragraph(_safe(_pretty_wrap(_safe(v))).replace("\n", "<br/>"), styles["Small"]),
            ]
        )

    t = Table(data, colWidths=[col_widths[0], col_widths[1]], repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f3f4f6")),
        ("BOX", (0, 0), (-1, -1), 0.6, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    if zebra:
        for i in range(1, len(data)):
            if i % 2 == 0:
                style_cmds.append(("BACKGROUND", (0, i), (-1, i), colors.HexColor("#fbfbfb")))
    t.setStyle(TableStyle(style_cmds))
    return t

def _table_matrix(
    header: List[str],
    rows: List[List[Any]],
    styles,
    col_widths: List[float],
    zebra: bool = True,
) -> Table:
    data: List[List[Any]] = []
    data.append([Paragraph(_safe(h), styles["SmallBold"]) for h in header])

    for r in rows:
        pr: List[Any] = []
        for cell in r:
            pr.append(Paragraph(_safe(_pretty_wrap(_safe(cell))).replace("\n", "<br/>"), styles["Small"]))
        data.append(pr)

    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f3f4f6")),
        ("BOX", (0, 0), (-1, -1), 0.6, colors.black),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    if zebra:
        for i in range(1, len(data)):
            if i % 2 == 0:
                style_cmds.append(("BACKGROUND", (0, i), (-1, i), colors.HexColor("#fbfbfb")))
    t.setStyle(TableStyle(style_cmds))
    return t

def _humanize_key(key: str) -> str:
    """
    Converts camelCase / snake_case into a readable label.
    Example: highestEducationLevel -> Highest Education Level
    """
    if not key:
        return ""
    s = key.replace("_", " ").strip()
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s[:1].upper() + s[1:]

def _build_readable_sections(form: Dict[str, Any]) -> List[Tuple[str, List[Tuple[str, Any]]]]:
    """
    If you later add more fields, just put them in the lists below to keep the PDF clean.
    Any unknown fields will still appear in an appendix (optional).
    """
    f = form or {}

    # --- tweak this map any time you add new fields ---
    LABELS = {
        "name": "Full Name",
        "position": "Position Applying For",
        "location": "Preferred Location",
        "email": "Email",
        "phone": "Phone",
        "address": "Address",
        "city": "City",
        "state": "State",
        "zip": "ZIP Code",
        "startDate": "Available Start Date",
        "workAuthorization": "Authorized to Work in the U.S.?",
        "sponsorshipRequired": "Will You Require Sponsorship?",
        "previouslyEmployed": "Previously Employed by Geolabs?",
        "previouslyEmployedWhen": "If Yes, When?",
        "driverLicense": "Driver’s License",
        "driverLicenseState": "Driver’s License State",
        "reliableTransportation": "Reliable Transportation?",
        "eeoGender": "EEO Gender (Voluntary)",
        "eeoEthnicity": "EEO Ethnicity (Voluntary)",
        "disabilityStatus": "Disability Status (Voluntary)",
        "vetStatus": "Veteran Status (Voluntary)",
        "drugAgreementSignature": "Signature (Typed)",
        "drugAgreementDate": "Signature Date",
    }

    def get(field: str) -> Any:
        return f.get(field)

    sections: List[Tuple[str, List[Tuple[str, Any]]]] = []

    sections.append(
        (
            "Applicant Summary",
            [
                (LABELS.get("name", _humanize_key("name")), get("name")),
                (LABELS.get("position", _humanize_key("position")), get("position")),
                (LABELS.get("location", _humanize_key("location")), get("location")),
            ],
        )
    )

    sections.append(
        (
            "Contact Information",
            [
                (LABELS.get("email", _humanize_key("email")), get("email")),
                (LABELS.get("phone", _humanize_key("phone")), get("phone")),
                (LABELS.get("address", _humanize_key("address")), get("address")),
                (LABELS.get("city", _humanize_key("city")), get("city")),
                (LABELS.get("state", _humanize_key("state")), get("state")),
                (LABELS.get("zip", _humanize_key("zip")), get("zip")),
            ],
        )
    )

    # Only include these if they exist in your form (safe either way)
    sections.append(
        (
            "Work Eligibility",
            [
                (LABELS.get("startDate", _humanize_key("startDate")), get("startDate")),
                (LABELS.get("workAuthorization", _humanize_key("workAuthorization")), get("workAuthorization")),
                (LABELS.get("sponsorshipRequired", _humanize_key("sponsorshipRequired")), get("sponsorshipRequired")),
                (LABELS.get("previouslyEmployed", _humanize_key("previouslyEmployed")), get("previouslyEmployed")),
                (LABELS.get("previouslyEmployedWhen", _humanize_key("previouslyEmployedWhen")), get("previouslyEmployedWhen")),
                (LABELS.get("reliableTransportation", _humanize_key("reliableTransportation")), get("reliableTransportation")),
                (LABELS.get("driverLicense", _humanize_key("driverLicense")), get("driverLicense")),
                (LABELS.get("driverLicenseState", _humanize_key("driverLicenseState")), get("driverLicenseState")),
            ],
        )
    )

    sections.append(
        (
            "Self-Identification (Voluntary)",
            [
                (LABELS.get("eeoGender", _humanize_key("eeoGender")), get("eeoGender")),
                (LABELS.get("eeoEthnicity", _humanize_key("eeoEthnicity")), get("eeoEthnicity")),
                (LABELS.get("disabilityStatus", _humanize_key("disabilityStatus")), get("disabilityStatus")),
                (LABELS.get("vetStatus", _humanize_key("vetStatus")), get("vetStatus")),
            ],
        )
    )

    sections.append(
        (
            "Alcohol & Drug Testing Agreement",
            [
                (LABELS.get("drugAgreementSignature", _humanize_key("drugAgreementSignature")), get("drugAgreementSignature")),
                (LABELS.get("drugAgreementDate", _humanize_key("drugAgreementDate")), get("drugAgreementDate")),
            ],
        )
    )

    # Remove totally empty sections to keep it clean
    filtered: List[Tuple[str, List[Tuple[str, Any]]]] = []
    for title, items in sections:
        if any(_safe(v) != "—" for _, v in items):
            filtered.append((title, items))
    return filtered

def _collect_unknown_form_fields(form: Dict[str, Any], known_fields: List[str]) -> List[Tuple[str, Any]]:
    f = form or {}
    unknown: List[Tuple[str, Any]] = []
    for k in sorted(f.keys()):
        if k not in known_fields:
            unknown.append((_humanize_key(k), f.get(k)))
    return unknown

def build_application_pdf(payload: Dict[str, Any]) -> bytes:
    """
    HR-friendly PDF:
      - Clean sections with human labels (no raw keys like highestEducationLevel)
      - Jobs/education (if present) shown as readable tables
      - Legal text on its own pages
      - Optional appendix for extra/unmapped fields
    """
    form = payload.get("form") or {}
    legal = payload.get("legalText") or {}
    client_meta = payload.get("clientMeta") or {}
    computed = payload.get("computed") or {}
    submitted_at = payload.get("submittedAt")

    applicant_name = _safe(form.get("name"))
    position = _safe(form.get("position"))
    preferred_location = _safe(form.get("location"))
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
    styles.add(ParagraphStyle(name="Body", parent=styles["BodyText"], fontSize=10, leading=13))
    styles.add(ParagraphStyle(name="Small", parent=styles["BodyText"], fontSize=9, leading=11))
    styles.add(ParagraphStyle(name="SmallBold", parent=styles["BodyText"], fontSize=9, leading=11, spaceAfter=0))
    styles["SmallBold"].fontName = "Helvetica-Bold"

    story: List[Any] = []

    # ---------------------------------------------------
    # Cover / summary (clean)
    # ---------------------------------------------------
    story.append(Paragraph("GEOLABS, INC.", styles["H1"]))
    story.append(Paragraph("Employment Application (HR Copy)", styles["H2"]))
    story.append(Paragraph("Secure · Confidential · Online Submission", styles["Body"]))
    story.append(Spacer(1, 10))

    vet_label = computed.get("vetStatusLabel")
    meta_rows = [
        ("Submitted At", submitted_at),
        ("Applicant", applicant_name),
        ("Position Applying For", position),
        ("Preferred Location", preferred_location),
        ("Email", email_addr),
        ("Phone", phone),
        ("Veteran Status (Label)", vet_label if vet_label else "—"),
        ("Client Timezone", client_meta.get("timezone")),
    ]
    story.append(_table_kv(meta_rows, styles, col_widths=(2.15 * inch, 4.65 * inch), header=("Item", "Value")))
    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Below is a readable summary of the applicant’s submission. The legal agreement text is included on the following pages.",
            styles["Small"],
        )
    )
    story.append(Spacer(1, 8))

    # ---------------------------------------------------
    # Readable sections (no raw keys)
    # ---------------------------------------------------
    readable_sections = _build_readable_sections(form)

    # Keep track of what we displayed (so appendix is only the “extras”)
    displayed_keys: List[str] = []
    # This list mirrors the keys referenced in _build_readable_sections.
    # If you add new fields there, add them here too.
    displayed_keys.extend(
        [
            "name", "position", "location",
            "email", "phone", "address", "city", "state", "zip",
            "startDate", "workAuthorization", "sponsorshipRequired",
            "previouslyEmployed", "previouslyEmployedWhen",
            "reliableTransportation", "driverLicense", "driverLicenseState",
            "eeoGender", "eeoEthnicity", "disabilityStatus", "vetStatus",
            "drugAgreementSignature", "drugAgreementDate",
        ]
    )

    for title, rows in readable_sections:
        story.append(Paragraph(title, styles["H2"]))
        story.append(_table_kv(rows, styles, col_widths=(2.35 * inch, 4.45 * inch), header=("Field", "Response")))
        story.append(Spacer(1, 10))

    # ---------------------------------------------------
    # If your form contains “employment history” / “education” arrays, render them nicely (optional)
    # (These won’t break anything if the fields aren’t present.)
    # ---------------------------------------------------
    emp = form.get("employment") if isinstance(form.get("employment"), list) else None
    if emp:
        story.append(Paragraph("Employment History", styles["H2"]))
        emp_rows: List[List[Any]] = []
        for job in emp[:5]:
            if not isinstance(job, dict):
                continue
            emp_rows.append(
                [
                    job.get("company"),
                    job.get("position"),
                    f"{_safe(job.get('dateFrom'))} – {_safe(job.get('dateTo'))}",
                    job.get("supervisor"),
                ]
            )
        if emp_rows:
            story.append(
                _table_matrix(
                    header=["Company", "Position", "Dates", "Supervisor"],
                    rows=emp_rows,
                    styles=styles,
                    col_widths=[2.1 * inch, 1.9 * inch, 1.6 * inch, 1.2 * inch],
                )
            )
            story.append(Spacer(1, 10))

    edu = form.get("education") if isinstance(form.get("education"), dict) else None
    if edu:
        story.append(Paragraph("Education", styles["H2"]))
        edu_rows = [
            ("School", edu.get("school") or edu.get("graduate") or edu.get("institution")),
            ("Degree / Program", edu.get("degree") or edu.get("graduateMajor") or edu.get("major")),
            ("Years", edu.get("years") or edu.get("graduateYears")),
        ]
        story.append(_table_kv(edu_rows, styles, col_widths=(2.35 * inch, 4.45 * inch), header=("Field", "Response")))
        story.append(Spacer(1, 10))

    # ---------------------------------------------------
    # Appendix for unmapped fields (so nothing is lost)
    # ---------------------------------------------------
    unknown = _collect_unknown_form_fields(form, known_fields=displayed_keys)
    # Only include if there are meaningful extras
    if any(_safe(v) != "—" for _, v in unknown):
        story.append(PageBreak())
        story.append(Paragraph("Appendix: Additional Submitted Fields", styles["H1"]))
        story.append(
            Paragraph(
                "These fields were included in the submission payload but are not part of the standard HR summary layout.",
                styles["Small"],
            )
        )
        story.append(Spacer(1, 8))
        story.append(_table_kv(unknown, styles, col_widths=(2.35 * inch, 4.45 * inch), header=("Field", "Value")))

    # ---------------------------------------------------
    # Legal text pages (exact text)
    # ---------------------------------------------------
    story.append(PageBreak())
    story.append(Paragraph("Alcohol & Drug Testing Program", styles["H1"]))
    story.append(Paragraph("Exact text presented to the applicant:", styles["H2"]))

    agreement_text = legal.get("alcoholDrugProgram") or "— (Agreement text was not provided by client payload.)"
    story.append(Paragraph(_safe(agreement_text).replace("\n", "<br/>"), styles["Small"]))
    story.append(Spacer(1, 14))

    story.append(Paragraph("Applicant Attestation", styles["H2"]))
    sig_text = _safe(form.get("drugAgreementSignature"))
    sig_date = _safe(form.get("drugAgreementDate"))

    att_rows = [
        ("Signature (typed)", sig_text),
        ("Date", sig_date),
    ]
    story.append(_table_kv(att_rows, styles, col_widths=(2.15 * inch, 4.65 * inch), header=("Item", "Value"), zebra=False))
    story.append(Spacer(1, 10))

    # Optional: drawn signature image (Data URL)
    sigs = payload.get("signatures") or {}
    data_url = sigs.get("drugAgreementSignatureDataUrl")
    if isinstance(data_url, str) and data_url.startswith("data:image"):
        try:
            _header, b64 = data_url.split(",", 1)
            img_bytes = base64.b64decode(b64)
            img_buf = io.BytesIO(img_bytes)
            story.append(Paragraph("Signature (drawn)", styles["Small"]))
            story.append(Spacer(1, 6))
            story.append(Image(img_buf, width=3.0 * inch, height=1.0 * inch))
        except Exception:
            story.append(Paragraph("Signature (drawn): — (Could not decode image)", styles["Small"]))

    # Optional: required notice page
    required_notice = legal.get("requiredNotice")
    if required_notice and str(required_notice).strip():
        story.append(PageBreak())
        story.append(Paragraph("Required Notice", styles["H1"]))
        story.append(Paragraph("Exact text presented to the applicant:", styles["H2"]))
        story.append(Paragraph(_safe(required_notice).replace("\n", "<br/>"), styles["Small"]))

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
# Email helper (Attaches PDF + optional resume)
# -------------------------------------------------------
def send_application_email(
    payload: Dict[str, Any],
    resume_bytes: Optional[bytes] = None,
    resume_filename: Optional[str] = None,
) -> None:
    """
    Emails a print-ready PDF to HR (APPLICATION_MAIL_TO).
    Optionally attaches the applicant resume file as a second attachment.
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
                "Attachments:",
                "- Print-ready application PDF",
                "- Original resume file (if provided)",
            ]
        )
    )

    filename_safe = re.sub(r"[^A-Za-z0-9._-]+", "_", str(applicant_name)).strip("_") or "Applicant"
    pdf_name = f"Employment_Application_{filename_safe}.pdf"
    msg.add_attachment(pdf_bytes, maintype="application", subtype="pdf", filename=pdf_name)

    # Attach resume (optional)
    if resume_bytes and resume_filename:
        ext = get_extension(resume_filename)
        if ext not in ALLOWED_EXTENSIONS:
            raise ValueError(f"Unsupported resume attachment type: {ext}")

        mime_type, _enc = mimetypes.guess_type(resume_filename)
        if not mime_type:
            mime_type = "application/octet-stream"
        maintype, subtype = mime_type.split("/", 1)

        safe_name = re.sub(r"[^A-Za-z0-9._-]+", "_", str(resume_filename)).strip("_") or f"resume{ext}"
        msg.add_attachment(resume_bytes, maintype=maintype, subtype=subtype, filename=safe_name)

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
    Accepts either:
    1) JSON body (legacy) - no resume attachment
    2) multipart/form-data:
       - field "payload" = JSON string
       - file  "resume"  = original resume file
    Emails a print-ready PDF + optional resume attachment.
    """
    try:
        payload: Dict[str, Any] = {}
        resume_bytes: Optional[bytes] = None
        resume_filename: Optional[str] = None

        content_type = request.content_type or ""

        if content_type.startswith("multipart/form-data"):
            payload_str = request.form.get("payload", "")
            if not payload_str.strip():
                return jsonify({"error": "Missing payload field."}), 400

            try:
                payload = json.loads(payload_str)
            except Exception:
                return jsonify({"error": "Invalid payload JSON."}), 400

            resume_file = request.files.get("resume")
            if resume_file and resume_file.filename:
                ext = get_extension(resume_file.filename)
                if ext not in ALLOWED_EXTENSIONS:
                    return jsonify({"error": f"Unsupported resume file type: {ext}"}), 400
                resume_bytes = resume_file.read()
                resume_filename = resume_file.filename

        else:
            payload = request.get_json(force=True, silent=False) or {}

        if not isinstance(payload, dict):
            return jsonify({"error": "Invalid payload."}), 400

        form = payload.get("form") or {}
        if not isinstance(form, dict):
            return jsonify({"error": "Invalid form object."}), 400

        send_application_email(payload, resume_bytes=resume_bytes, resume_filename=resume_filename)
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

    # NOTE: In production (EC2), run with systemd/gunicorn and debug=False.
    app.run(host="0.0.0.0", port=5001, debug=True)
