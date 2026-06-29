"""Custom exceptions for the HRX Python SDK."""

from __future__ import annotations

from typing import Any


class HrxError(Exception):
    """Base exception for all SDK errors."""

    def __init__(self, message: str, *, details: Any | None = None) -> None:
        super().__init__(message)
        self.details = details


class HrxFileError(HrxError):
    """Raised when a file cannot be read or written."""


class HrxParseError(HrxError):
    """Raised when HRX payload is not valid JSON."""


class HrxValidationError(HrxError):
    """Raised when payload does not match the Pydantic HRX model."""


class HrxSchemaError(HrxError):
    """Raised when payload does not match a JSON schema."""


class HrxVersionError(HrxError):
    """Raised when document version is not supported."""
