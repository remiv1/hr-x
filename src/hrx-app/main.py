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
from typing import Any, Literal
import uuid

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
from werkzeug.wrappers import Response as WerkzeugResponse
from forms import IdentityForm
from jsonschema import ValidationError, validate

from utils import load_schema

# Simple in-memory payload store keyed by a short id stored in session
PAYLOAD_STORE: dict[str, dict[str, Any]] = {}
INDEX_TEMPLATE = "index.html"
app: Flask = Flask(__name__, static_folder="static", template_folder="templates")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret")

@app.get("/")
def index() -> str:
    """
    Index page
    """
    return render_template(INDEX_TEMPLATE)


@app.get("/partial/identity")
def partial_identity() -> str:
    """
    Partial identity loader for HTMX
    """
    payload = None
    pid = session.get("payload_id")
    if pid:
        payload = PAYLOAD_STORE.get(pid)
    form = IdentityForm(data=(payload.get("identity") if payload else {}))
    return render_template("_identity.html", identity_form=form, payload_obj=payload)


@app.get("/section/<name>")
def section(name: str) -> str | tuple[Literal[''], Literal[404]]:
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


@app.get('/section/new/<item>')
def new_item(item: str) -> tuple[Literal[''], Literal[404]] | str:
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

@app.get('/section/education')
def section_education() -> str:
    """
    Education section
    """
    pid = session.get("payload_id")
    payload = PAYLOAD_STORE.get(pid) if pid else None
    return render_template('_education.html', payload_obj=payload)


@app.route('/section/credentials')
def section_credentials() -> str:
    """
    Credentials section
    """
    pid = session.get("payload_id")
    payload = PAYLOAD_STORE.get(pid) if pid else None
    return render_template('_credentials.html', payload_obj=payload)


@app.get('/section/preferences')
def section_preferences() -> str:
    """
    Preferences section
    """
    pid = session.get("payload_id")
    payload = PAYLOAD_STORE.get(pid) if pid else None
    return render_template('_preferences.html', payload_obj=payload)


@app.post("/validate")
def validate_payload() -> tuple[dict[str, Any], int]:
    """
    Validate payload
    """
    schema = load_schema()
    data = request.get_json(force=True)
    if not schema:
        return {"ok": False, "errors": ["Schema not found on server"]}, 500
    try:
        validate(instance=data, schema=schema)
        return {"ok": True}, 200
    except ValidationError as e:
        return {"ok": False, "errors": [e.message]}, 400


@app.post("/upload")
def upload_hrx() -> WerkzeugResponse | str:
    """
    Upload HRX file
    """
    f = request.files.get("file")
    if not f:
        return redirect(url_for("index"))
    try:
        raw = f.stream.read()
        payload = json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError as e:
        return render_template(INDEX_TEMPLATE, error=f"Échec lecture fichier: {e}")

    # Store payload server-side and keep a short id in the session so HTMX section
    # routes can read it and pre-fill partials.
    payload_id = uuid.uuid4().hex
    PAYLOAD_STORE[payload_id] = payload
    session["payload_id"] = payload_id

    identity_form = IdentityForm(data=payload.get("identity", {}))

    return render_template(
        INDEX_TEMPLATE,
        payload=json.dumps(payload, ensure_ascii=False, indent=2),
        payload_obj=payload,
        identity_form=identity_form,
    )


@app.post("/download")
def download_hrx() -> tuple[dict[str, Any], int] | Response:
    """
    Download HRX file
    """
    schema = load_schema()
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
