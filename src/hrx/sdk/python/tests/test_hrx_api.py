"""
Tests for the HRX Python SDK.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest

from hrx import HRX
from hrx.errors import (
    HrxFileError,
    HrxParseError,
    HrxSchemaError,
    HrxValidationError,
    HrxVersionError,
)


def test_load_from_path_success(hrx_sample_file: Path) -> None:
    """Test loading an HRX document from a file."""
    doc = HRX.from_path(hrx_sample_file)

    assert doc.candidate.identity.first_name == "Claire"
    assert doc.candidate.hrx.version == "1.0"


def test_round_trip_dict_and_json(sample_payload: dict[str, Any]) -> None:
    """Test round-trip serialization to dict and JSON."""
    doc = HRX.from_dict(sample_payload)

    as_dict = doc.to_dict()
    as_json = doc.to_json()
    parsed_back = json.loads(as_json)

    assert as_dict["$hrx"]["version"] == "1.0"
    assert parsed_back["identity"]["last_name"] == "Martin"


def test_invalid_json_raises_parse_error() -> None:
    """Test parsing invalid JSON."""
    with pytest.raises(HrxParseError):
        HRX.from_json("{not-valid-json}")


def test_non_existing_file_raises_file_error() -> None:
    """Test loading from a non-existing file."""
    with pytest.raises(HrxFileError):
        HRX.from_path(Path("does-not-exist.hrx"))


def test_missing_required_field_raises_validation_error(
        sample_payload: dict[str, Any]
    ) -> None:
    """Test loading a document with missing required fields."""
    payload = dict(sample_payload)
    payload.pop("identity", None)

    with pytest.raises(HrxValidationError):
        HRX.from_dict(payload)


def test_unsupported_version_raises_version_error(
        sample_payload: dict[str, Any]
    ) -> None:
    """Test loading a document with an unsupported HRX version."""
    payload = dict(sample_payload)
    hrx_meta = dict(sample_payload["$hrx"])
    hrx_meta["version"] = "2.0"
    payload["$hrx"] = hrx_meta

    with pytest.raises(HrxVersionError):
        HRX.from_dict(payload)


def test_schema_validation_success(
        hrx_sample_file: Path, sample_schema_path: Path
    ) -> None:
    """Test successful schema validation."""
    doc = HRX.from_path(hrx_sample_file)

    doc.validate_against_schema(sample_schema_path)


def test_schema_validation_failure_raises_schema_error(
        sample_payload: dict[str, Any]
    ) -> None:
    """Test schema validation failure."""
    invalid_doc = HRX.from_dict(sample_payload)
    strict_schema = {
        "type": "object",
        "required": ["identity"],
        "properties": {
            "identity": {
                "type": "object",
                "required": ["last_name", "first_name"],
                "properties": {
                    "last_name": {"type": "string", "const": "SHOULD_FAIL"},
                    "first_name": {"type": "string"},
                },
            }
        },
    }

    with pytest.raises(HrxSchemaError):
        invalid_doc.validate_against_schema(strict_schema)
