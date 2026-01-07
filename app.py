# app.py
from __future__ import annotations

import json
from typing import Any, Dict

from flask import Flask, request, jsonify
from flask_cors import CORS

from services import (
    load_env_and_config,
    parse_resume_file,
    submit_application_payload,
)

# -------------------------------------------------------
# App init
# -------------------------------------------------------
app = Flask(__name__)

@app.before_request
def log_request() -> None:
    print(f"➡ {request.method} {request.path}")

# Load env + config once at startup
CFG = load_env_and_config()

app.secret_key = CFG["FLASK_SECRET_KEY"]

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": CFG["CORS_ORIGINS"],
        }
    },
    supports_credentials=True,
)

# -------------------------------------------------------
# Routes
# -------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health() -> Any:
    return jsonify(
        {
            "status": "ok",
            "autofill_ready": bool(CFG["GEMINI_API_KEY"]),
            "gemini_key_set": bool(CFG["GEMINI_API_KEY"]),
            "model": CFG["GEMINI_MODEL"],
            "mail_to": CFG["APPLICATION_MAIL_TO"],
            "smtp_ready": bool(CFG["SMTP_HOST"]),
        }
    )


@app.route("/api/parse-resume", methods=["POST"])
def parse_resume() -> Any:
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    try:
        result = parse_resume_file(file, CFG)
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
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
        resume_bytes = None
        resume_filename = None

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
                resume_bytes = resume_file.read()
                resume_filename = resume_file.filename

        else:
            payload = request.get_json(force=True, silent=False) or {}

        if not isinstance(payload, dict):
            return jsonify({"error": "Invalid payload."}), 400

        form = payload.get("form") or {}
        if not isinstance(form, dict):
            return jsonify({"error": "Invalid form object."}), 400

        submit_application_payload(
            payload,
            CFG,
            resume_bytes=resume_bytes,
            resume_filename=resume_filename,
        )

        return jsonify({"status": "ok"})

    except RuntimeError as e:
        print("❌ /api/submit-application runtime error:", repr(e))
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print("❌ /api/submit-application error:", repr(e))
        return jsonify({"error": "Internal error while submitting application."}), 500


if __name__ == "__main__":
    with app.app_context():
        print("🔍 Registered routes:")
        for rule in app.url_map.iter_rules():
            print(f"  {rule}")

    app.run(host="0.0.0.0", port=5001, debug=True)
