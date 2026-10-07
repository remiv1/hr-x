"""
HR-X App

The HR-X App is a web application that allows users to validate and upload HR-X files.

The app is based on the Flask framework and uses the Jinja2 template engine to render HTML.

The app is designed to be simple and easy to use, with a focus on functionality and performance.
"""
from __future__ import annotations

import os
from typing import Any

from flask import (
    Flask,
    render_template,
)

from demo import bp_hrx_demo

# Simple in-memory payload store keyed by a short id stored in session
PAYLOAD_STORE: dict[str, dict[str, Any]] = {}
INDEX_TEMPLATE = "story.html"

app: Flask = Flask(__name__, static_folder="static", template_folder="templates")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret")
app.register_blueprint(bp_hrx_demo)

@app.get("/")
def index() -> str:
    """
    Index page
    """
    return render_template(INDEX_TEMPLATE)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
