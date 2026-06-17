"""
Enum of hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""

from .models.identity import Civility, ContactType, Mobility
from .models.skills import Level
from .models.preferences import ContractTypes, Remote

__all__ = [
    "Civility",
    "ContactType",
    "Mobility",
    "Level",
    "ContractTypes",
    "Remote"
]