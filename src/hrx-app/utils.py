"""
Utility functions
"""

from typing import Any
import urllib.request
from urllib.error import URLError
import json
import os

APP_DIR = os.path.dirname(__file__)
SCHEMA_REMOTE = "https://schema.audit-io.fr/hr-x/v1.0/schema"
SCHEMA_PATH = os.path.abspath(
    os.path.join(APP_DIR, "..", "hrx", "models", "hrx-schema-v1.json")
)

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
    except URLError:
        # fallback to local schema file
        with open(SCHEMA_PATH, "r", encoding="utf-8") as fh:
            return json.load(fh)
