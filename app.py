from __future__ import annotations

import io
import json
import os
from typing import Any, Dict, List

from flask import Flask, request, jsonify
from flask_cors import CORS

# --------- Text extraction libs ----------
# pip install pypdf python-docx
from pypdf import PdfReader
import docx

# --------- Gemini (google-generativeai) ----------
# Follows the same pattern as your askai.py
# pip install google-generativeai
import google.generativeai as genai

GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")

if not GEMINI_KEY:
  print("⚠️ GEMINI_API_KEY not set – /api/parse-resume will fail with 500.")
genai.configure(api_key=GEMINI_KEY)

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt"}

app = Flask(__name__)
# In production, you can restrict this to your domains (e.g. https://geolabs-employment.net)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# -------------------------------------------------------------------
# File helpers
# -------------------------------------------------------------------
def get_extension(filename: str) -> str:
    filename = filename or ""
    if "." not in filename:
        return ""
    return "." + filename.rsplit(".", 1)[-1].lower()


def extract_text_from_pdf(file_storage) -> str:
    reader = PdfReader(file_storage.stream)
    pages = []
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


# -------------------------------------------------------------------
# Gemini resume parsing
# -------------------------------------------------------------------

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
    // Up to 3 most recent positions
  ],
  "education": {
    "graduate": "Most recent college/university name or null",
    "graduateYears": "Years attended or graduation year (e.g. '2016–2020' or '2020') or null",
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
    // Only if clearly labeled as references
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


def call_gemini_for_resume(text: str) -> Dict[str, Any]:
    """
    Use Gemini to convert raw resume text into structured JSON.
    This mirrors your askai-style usage: GenerativeModel + generate_content.
    """
    if not GEMINI_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    # Limit for token sanity but keep plenty of context
    max_chars = 20000
    excerpt = text[:max_chars]

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
    raw = (getattr(response, "text", "") or "").strip()

    # Gemini sometimes wraps in ```json ```; strip that crud if present
    if raw.startswith("```"):
        raw = raw.strip("`\n ")
        if raw.lower().startswith("json"):
            raw = raw[4:].lstrip()

    try:
        parsed = json.loads(raw)
    except Exception as e:
        raise ValueError(f"Failed to parse JSON from Gemini output: {e}\nRaw output: {raw[:400]}")

    return parsed


def normalize_parsed_resume(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize to a predictable structure that StepResume.jsx expects.
    """
    contact = data.get("contact") or {}
    employment = data.get("employment") or []
    education = data.get("education") or {}
    skills = data.get("skills") or {}
    references = data.get("references") or []

    # Normalize employment (max 3)
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


# -------------------------------------------------------------------
# API route: /api/parse-resume
# -------------------------------------------------------------------
@app.route("/api/parse-resume", methods=["POST"])
def parse_resume() -> Any:
    """
    Accepts a resume file, extracts text, sends to Gemini, returns structured JSON.

    Response:
    {
      "parsed": { ...normalized resume data... },
      "meta": {
        "filename": "resume.pdf",
        "characters_used": 12345
      }
    }
    """
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

        raw_parsed = call_gemini_for_resume(text)
        parsed = normalize_parsed_resume(raw_parsed)

        return jsonify(
            {
                "parsed": parsed,
                "meta": {
                    "filename": file.filename,
                    "characters_used": len(text),
                },
            }
        )
    except ValueError as ve:
        # JSON parsing / model-format issues
        print("❌ Gemini parse error:", ve)
        return jsonify({"error": str(ve)}), 500
    except Exception as e:
        print("❌ /api/parse-resume error:", repr(e))
        return jsonify({"error": "Internal error while parsing resume."}), 500


# Optional: simple health check
@app.route("/api/health", methods=["GET"])
def health() -> Any:
    return jsonify(
        {
            "status": "ok",
            "gemini_model": GEMINI_MODEL,
            "gemini_key_set": bool(GEMINI_KEY),
        }
    )


if __name__ == "__main__":
    # For dev only; in prod you’d use gunicorn + reverse proxy
    app.run(host="0.0.0.0", port=5000, debug=True)
