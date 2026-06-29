"""High-level API for reading and writing HRX documents."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, cast

from pydantic import ValidationError

from .errors import HrxFileError, HrxParseError, HrxSchemaError, HrxValidationError, HrxVersionError
from .models import Candidate


class HRX:
    """Load, validate and serialize an HRX document."""

    def __init__(self, source: Path | str | dict[str, Any] | Candidate) -> None:
        self.candidate = self._load_candidate(source)

    @classmethod
    def from_path(cls, path: Path | str) -> "HRX":
        """
        Load an HRX document from a file.

        Args:
            path: Path to the HRX file.

        Returns:
            HRX document.
        """
        if isinstance(path, str):
            path = Path(path)
        return cls(path)

    @classmethod
    def from_json(cls, payload: str) -> "HRX":
        """
        Load an HRX document from a JSON string.

        Args:
            payload: JSON string representing the HRX document.

        Returns:
            HRX document.
        """
        return cls(payload)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "HRX":
        """
        Load an HRX document from a dictionary.

        Args:
            payload: Dictionary representing the HRX document.

        Returns:
            HRX document.
        """
        return cls(payload)

    @staticmethod
    def _load_candidate(source: Path | str | dict[str, Any] | Candidate) -> Candidate:
        if isinstance(source, Candidate):
            candidate = source
        elif isinstance(source, Path):
            candidate = HRX._load_from_path(source)
        elif isinstance(source, dict):
            candidate = HRX._load_from_dict(source)
        else:
            source_path = Path(source)
            if source_path.exists():
                candidate = HRX._load_from_path(source_path)
            else:
                candidate = HRX._load_from_json(source)

        version = candidate.hrx.version
        if version != "1.0":
            raise HrxVersionError(
                f"Unsupported HRX version '{version}'. Only version '1.0' is currently supported.",
            )
        return candidate

    @staticmethod
    def _load_from_path(path: Path) -> Candidate:
        try:
            payload = path.read_text(encoding="utf-8")
        except OSError as exc:
            raise HrxFileError(f"Cannot read HRX file: {path}") from exc
        return HRX._load_from_json(payload)

    @staticmethod
    def _load_from_json(payload: str) -> Candidate:
        try:
            parsed = json.loads(payload)
        except json.JSONDecodeError as exc:
            raise HrxParseError(f"Invalid HRX JSON payload: {exc}") from exc
        if not isinstance(parsed, dict):
            raise HrxParseError("HRX payload must be a JSON object.")
        return HRX._load_from_dict(cast(dict[str, Any], parsed))

    @staticmethod
    def _load_from_dict(payload: dict[str, Any]) -> Candidate:
        try:
            return Candidate.model_validate(payload)
        except ValidationError as exc:
            raise HrxValidationError(
                "HRX payload does not match the expected model.",
                details=exc.errors()
            ) from exc

    def to_dict(self) -> dict[str, Any]:
        """
        Serialize the HRX document to a dictionary.

        Args:
            None

        Returns:
            Dictionary representing the HRX document.
        """
        return self.candidate.model_dump(mode="json", by_alias=True, exclude_none=True)

    def to_json(self, *, indent: int = 2) -> str:
        """
        Serialize the HRX document to a JSON string.

        Args:
            indent: Number of spaces for indentation in the JSON string.

        Returns:
            JSON string representing the HRX document.
        """
        return self.candidate.model_dump_json(by_alias=True, exclude_none=True, indent=indent)

    def validate_against_schema(self, schema: dict[str, Any] | str | Path) -> None:
        """
        Validate the HRX document against a JSON schema.

        Args:
            schema: JSON schema to validate against.

        Returns:
            None
        """
        try:
            from jsonschema import validate as jsonschema_validate  #pylint: disable=import-outside-toplevel
            from jsonschema.exceptions import ValidationError as JsonSchemaValidationError  #pylint: disable=import-outside-toplevel
        except ImportError as exc:
            raise HrxSchemaError(
                "jsonschema package is required to validate against a JSON schema."
            ) from exc

        if isinstance(schema, dict):
            schema_data = schema
        else:
            schema_path = Path(schema)
            try:
                schema_data = json.loads(schema_path.read_text(encoding="utf-8"))
            except OSError as exc:
                raise HrxSchemaError(f"Cannot read schema file: {schema_path}") from exc
            except json.JSONDecodeError as exc:
                raise HrxSchemaError(f"Invalid schema JSON: {exc}") from exc

        try:
            jsonschema_validate(instance=self.to_dict(), schema=schema_data)
        except JsonSchemaValidationError as exc:
            raise HrxSchemaError(
                "HRX payload does not match the provided JSON schema.",
                details=exc.message
            ) from exc
