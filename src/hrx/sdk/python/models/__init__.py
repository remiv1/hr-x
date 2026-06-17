"""
Model of user using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""

from __future__ import annotations

from pydantic import BaseModel

from .hrx import Hrx
from .identity import Identity
from .skills import Skills
from .experiences import Experience
from .education import Education
from .credentials import Credential
from .preferences import Preferences


class Candidate(BaseModel):
    """
    Model of user using hrx schema

    Arguments:
    - identity (Identity): identity of the candidate
    - preferences (Preferences): preferences of the candidate
    - skills (Skills): skills of the candidate
    - experiences (Experiences): experiences of the candidate
    - education (Education): education of the candidate
    - credentials (Credential): credentials of the candidate

    Return:
    Return a pydantic model for candidate
    """
    _hrx: Hrx
    identity: Identity
    preferences: Preferences
    skills: Skills
    experiences: Experience
    education: Education
    credentials: Credential
