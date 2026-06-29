"""
Fixtures for the HRX Python SDK tests.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest
from _pytest.fixtures import FixtureRequest


@pytest.fixture
def hrx_sample_file() -> Path:
    """Path to the sample HRX file."""
    return Path(__file__).resolve().parents[3] / "models" / "exemple-candidat.hrx"


@pytest.fixture
def sample_schema_path() -> Path:
    """Path to the sample HRX schema file."""
    return Path(__file__).resolve().parents[3] / "models" / "hrx-schema-v1.json"


@pytest.fixture
def sample_payload(request: FixtureRequest) -> dict[str, Any]:
    """Sample HRX payload."""
    hrx_sample_file = request.getfixturevalue("hrx_sample_file")    #pylint: disable=W0621
    return json.loads(hrx_sample_file.read_text(encoding="utf-8"))
