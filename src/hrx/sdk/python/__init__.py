"""
Model of user using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""

from __future__ import annotations

import logging
import json
from typing import Any
from pathlib import Path

from .models import Candidate
from .exc import HrxError

logger = logging.getLogger(__name__)

__all__ = ["Candidate"]

# package version
__version__ = "0.1.0"

class HRX:
    """
    HRX class to transforme hrx file to candidate model
    """
    def __init__(self, hrx_file: Path) -> None:
        try:
            with open(hrx_file, "r", encoding="utf-8") as f:
                hrx_model = f.read()
                hrx_model = json.loads(hrx_model)
            self.candidate = Candidate(**hrx_model)
        except json.JSONDecodeError as e:
            raise HrxError(f"Invalid hrx format file: {e}") from e
        except Exception as e:
            raise HrxError(f"Invalid hrx file: {e}") from e

    def to_dict(self) -> dict[str, Any]:
        """
        Return candidate model as dict
        """
        return self.candidate.model_dump()

    def to_json(self) -> str:
        """
        Return candidate model as json
        """
        return self.candidate.model_dump_json()
