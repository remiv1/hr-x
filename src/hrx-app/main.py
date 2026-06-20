"""
HR-X App

The HR-X App is a web application that allows users to validate and upload HR-X files.

The app is based on the Flask framework and uses the Jinja2 template engine to render HTML.

The app is designed to be simple and easy to use, with a focus on functionality and performance.
"""
from __future__ import annotations

import io
import json
import os
from typing import Any
import uuid
import urllib.request

from flask import (
    Flask,
    redirect,
    render_template,
    request,
    send_file,
    url_for,
    session,
    Response,
)
from forms import IdentityForm
from jsonschema import ValidationError, validate


APP_DIR = os.path.dirname(__file__)
SCHEMA_PATH = os.path.abspath(
    os.path.join(APP_DIR, "..", "hrx", "models", "hrx-schema-v1.json")
)
SCHEMA_REMOTE = "https://schema.audit-io.fr/hr-x/v1.0/schema"

# Simple in-memory payload store keyed by a short id stored in session
PAYLOAD_STORE: dict[str, dict[str, Any]] = {}


def load_schema() -> dict[str, Any]:
    """
    Load schema from file.
    
    Returns:
        dict[str, Any]: schema
    """
    # Try to fetch remote canonical schema; fall back to local file
    try:
        with urllib.request.urlopen(SCHEMA_REMOTE, timeout=5) as resp:
            data = resp.read()
            return json.loads(data.decode("utf-8"))
    except Exception:
        # fallback to local schema file
        with open(SCHEMA_PATH, "r", encoding="utf-8") as fh:
            return json.load(fh)


app: Flask = Flask(__name__, static_folder="static", template_folder="templates")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret")
schema: dict[str, Any] = {}


def _load_schema():
    global schema   # pylint disable=W0603
    try:
        schema = load_schema()
    except Exception:
        schema = {}


# Register a startup hook compatible with multiple Flask versions.
# Use programmatic registration to avoid issues with static type checkers
if getattr(app, "before_serving", None):
    def _on_startup() -> None:
        _load_schema()

    # Register the callable; mypy/linters may not know about this attr
    app.before_serving(_on_startup)  # type: ignore[attr-defined]
else:
    # Fallback: load at import time
    _load_schema()


@app.route("/")
def index():
    """
    Index page
    """
    return render_template("index.html")


@app.route("/partial/identity")
def partial_identity():
    """
    Partial identity loader for HTMX
    """
    payload = None
    pid = session.get("payload_id")
    if pid:
        payload = PAYLOAD_STORE.get(pid)
    form = IdentityForm(data=(payload.get("identity") if payload else {}))
    return render_template("_identity.html", identity_form=form, payload_obj=payload)


@app.route("/section/<name>")
def section(name: str):
    """
    Section loader for HTMX
    """
    pid = session.get("payload_id")
    payload = PAYLOAD_STORE.get(pid) if pid else None
    if name == "identity":
        form = IdentityForm(data=(payload.get("identity") if payload else {}))
        return render_template("_identity.html", identity_form=form, payload_obj=payload)
    if name == "skills":
        return render_template("_skills.html", payload_obj=payload)
    if name == "experiences":
        return render_template("_experiences.html", payload_obj=payload)
    return "", 404


@app.route('/section/new/<item>')
def new_item(item: str):
    """
    New item section
    """
    # Return HTML fragment for dynamic item insertion via HTMX
    uid = uuid.uuid4().hex
    if item == 'skill':
        doc = render_template('_skill_item.html', uid=uid)
    elif item == 'experience':
        doc = render_template('_experience_item.html', uid=uid)
    elif item == 'education':
        doc = render_template('_education_item.html', uid=uid)
    elif item == 'award':
        doc = render_template('_award_item.html', uid=uid)
    elif item == 'reference':
        doc = render_template('_reference_item.html', uid=uid)
    elif item == 'bibliography':
        doc = render_template('_bibliography_item.html', uid=uid)
    else:
        return "", 404
    return doc

@app.route('/section/education')
def section_education():
    """
    Education section
    """
    pid = session.get("payload_id")
    payload = PAYLOAD_STORE.get(pid) if pid else None
    return render_template('_education.html', payload_obj=payload)


@app.route('/section/credentials')
def section_credentials():
    """
    Credentials section
    """
    pid = session.get("payload_id")
    payload = PAYLOAD_STORE.get(pid) if pid else None
    return render_template('_credentials.html', payload_obj=payload)


@app.route('/section/preferences')
def section_preferences():
    """
    Preferences section
    """
    pid = session.get("payload_id")
    payload = PAYLOAD_STORE.get(pid) if pid else None
    return render_template('_preferences.html', payload_obj=payload)


@app.route("/validate", methods=["POST"])
def validate_payload() -> tuple[dict[str, Any], int]:
    """
    Validate payload
    """
    data = request.get_json(force=True)
    if not schema:
        return {"ok": False, "errors": ["Schema not found on server"]}, 500
    try:
        validate(instance=data, schema=schema)
        return {"ok": True}, 200
    except ValidationError as e:
        return {"ok": False, "errors": [e.message]}, 400


@app.route("/upload", methods=["POST"])
def upload_hrx():
    """
    Upload HRX file
    """
    f = request.files.get("file")
    if not f:
        return redirect(url_for("index"))
    try:
        payload = json.load(f)
    except Exception as e:
        return render_template("index.html", error=f"Échec lecture fichier: {e}")

    # Store payload server-side and keep a short id in the session so HTMX section
    # routes can read it and pre-fill partials.
    payload_id = uuid.uuid4().hex
    PAYLOAD_STORE[payload_id] = payload
    session["payload_id"] = payload_id

    identity_form = IdentityForm(data=payload.get("identity", {}))

    return render_template(
        "index.html",
        payload=json.dumps(payload, ensure_ascii=False, indent=2),
        payload_obj=payload,
        identity_form=identity_form,
    )


@app.route("/download", methods=["POST"])
def download_hrx() -> tuple[dict[str, Any], int] | Response:
    """
    Download HRX file
    """
    data = request.get_json(force=True)
    if not schema:
        return {"ok": False, "errors": ["Schema missing"]}, 500
    try:
        validate(instance=data, schema=schema)
    except ValidationError as e:
        return {"ok": False, "errors": [e.message]}, 400

    bio = io.BytesIO()
    bio.write(json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8"))
    bio.seek(0)
    return send_file(
        bio,
        as_attachment=True,
        download_name="candidate.hrx",
        mimetype="application/json",
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
