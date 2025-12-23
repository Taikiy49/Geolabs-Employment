from __future__ import annotations

import io
import json
import os
from typing import Any, Dict, List, Tuple

from flask import Flask, request, jsonify
from flask_cors import CORS

from pypdf import PdfReader
import docx

import google.generativeai as genai
from google.api_core.exceptions import PermissionDenied

# -------------------------------------------------------
# Config
# -------------------------------------------------------
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")

if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
else:
    print("⚠️ GEMINI_API_KEY not set – resume autofill will use a basic fallback.")

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt"}

app = Flask(__name__)

# Simple request logger so you can see POST /api/parse-resume in the terminal
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
# Resume schema / AI prompt
# -------------------------------------------------------
RESUME_SCHEMA_DESCRIPTION = """
Return a JSON object with the following structure:

{
  "contact": {
    "name": "Full Name or null",
    "email": "Primary email or null",
    "phone": "Phone number or null",
    "address": "Street address (single line) or null",
    "city": "City or null",
    "state": "State or null",
    "zip": "Postal code or null"
  },
  "employment": [
    {
      "company": "Company name",
      "address": "City/State if available, else null",
      "phone": "Company or supervisor phone if clearly shown, else null",
      "position": "Job title",
      "dateFrom": "Start date in original resume format if possible",
      "dateTo": "End date or 'Present' if current",
      "duties": "1–3 line summary of key responsibilities",
      "reasonForLeaving": null,
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
    "computerSkills": "Short sentence listing main software / technical skills"
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
- DO NOT invent employers, dates, or degrees that are not supported by the text.
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
        },
    }


def normalize_parsed_resume(data: Dict[str, Any]) -> Dict[str, Any]:
    contact = data.get("contact") or {}
    employment = data.get("employment") or []
    education = data.get("education") or {}
    skills = data.get("skills") or {}
    references = data.get("references") or []

    norm_emp: List[Dict[str, Any]] = []
    for job in employment[:3]:
        norm_emp.append(
            {
                "company": job.get("company"),
                "address": job.get("address"),
                "phone": job.get("phone"),
                "position": job.get("position"),
                "dateFrom": job.get("dateFrom"),
                "dateTo": job.get("dateTo"),
                "duties": job.get("duties"),
                "reasonForLeaving": job.get("reasonForLeaving"),
                "supervisor": job.get("supervisor"),
            }
        )

    norm_refs: List[Dict[str, Any]] = []
    for ref in references:
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
            "address": contact.get("address"),
            "city": contact.get("city"),
            "state": contact.get("state"),
            "zip": contact.get("zip"),
        },
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
            "computerSkills": skills.get("computerSkills"),
        },
        "references": norm_refs,
    }


def make_empty_parsed() -> Dict[str, Any]:
    return normalize_parsed_resume(
        {
            "contact": {},
            "employment": [],
            "education": {},
            "skills": {},
            "references": [],
        }
    )


# -------------------------------------------------------
# Routes
# -------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health() -> Any:
    return jsonify(
        {
            "status": "ok",
            "autofill_ready": bool(GEMINI_KEY),
            # also expose this name in case your frontend expects gemini_key_set
            "gemini_key_set": bool(GEMINI_KEY),
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

        try:
            result = call_generative_parser(text)
            raw_parsed = result["data"]
            meta = result["meta"]
            parsed = normalize_parsed_resume(raw_parsed)
            model_name = meta.get("model")
            truncated = meta.get("truncated", False)
            finish_reason = meta.get("finish_reason")
            mode = "smart"
        except (PermissionDenied, RuntimeError, ValueError) as ai_err:
            print("⚠️ Smart parser failed, using basic fallback:", repr(ai_err))
            parsed = make_empty_parsed()
            model_name = "fallback-basic"
            truncated = False
            finish_reason = "FALLBACK"
            mode = "fallback"

        return jsonify(
            {
                "parsed": parsed,
                "meta": {
                    "filename": file.filename,
                    "characters_used": len(text),
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


if __name__ == "__main__":
    with app.app_context():
        print("🔍 Registered routes:")
        for rule in app.url_map.iter_rules():
            print(f"  {rule}")

    app.run(host="0.0.0.0", port=5000, debug=True)
