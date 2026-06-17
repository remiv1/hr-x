"""
Model of user part for preferences using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""
from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class Contracts(BaseModel):
    """
    Base Model of contracts.

    Use this model for explore contracts of the candidate.

    Arguments:
    - value (str): Contract type.

    Return:
    Return a pydantic model for contracts
    """
    items: list[ContractTypes]


class ContractTypes(Enum):
    """
    Enum of contract types.

    Use this enum for explore contract types of the candidate.

    Arguments:
    - PERMANENT (str): Permanent contract.
    - FIXED_TERM (str): Fixed term contract.
    - FREELANCE (str): Freelance contract.
    - MISSION (str): Mission contract.
    - INTERNSHIP (str): Internship contract.
    - APPRENTICESHIP (str): Apprenticeship contract.

    Return:
    Return a pydantic model for contract types
    """
    PERMANENT = "permanent"
    FIXED_TERM = "fixed-term"
    FREELANCE = "freelance"
    MISSION = "mission"
    INTERNSHIP = "internship"
    APPRENTICESHIP = "apprenticeship"


class Remote(Enum):
    """
    Enum for remote type.

    Use this enum for explore remote type of the candidate.

    Arguments:
    - NO (str): No remote.
    - PARTIAL (str): Partial remote.
    - FULL (str): Full remote.

    Return:
    Return a pydantic model for remote
    """
    NO = "no"
    PARTIAL = "partial"
    FULL = "full"


class Preferences(BaseModel):
    """
    Base Model of preferences.

    Use this model for explore preferences of the candidate.

    Arguments:
    - availability (str, optional): Availability of the candidate.
    - contracts (Contracts, optional): Contract types needed by the candidate.
    - remote (Remote, optional): Remote type of the candidate.
    - salary_min (int, optional): Minimum salary of the candidate.

    Return:
    Return a pydantic model for preferences
    """
    availability: Optional[str] = None
    contracts: Optional[list[Contracts]] = None
    remote: Optional[Remote] = None
    salary_min: Optional[int] = None
