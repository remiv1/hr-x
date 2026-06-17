"""
Module of user part for hrx schema.

This part of the hrx schema is used to store credentials like

- bibliography
- awards
- references

See https://schema.audit-io.fr/hrx/1.0/documentation
"""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel
from .awards import Award, AwardItem
from .bibliography import Bibliography, BibliographyItem
from .references import Reference, ReferenceItem

__all__ = [
    "Award",
    "AwardItem",
    "Bibliography",
    "BibliographyItem",
    "Reference",
    "ReferenceItem",
    "Credential",
]

__version__ = "1.0.0"

class Credential(BaseModel):
    """
    Base model for Credential of the candidate.

    Use this base model to explore the credentials of the candidate
    
    Arguments:
    - awards (list[Award], optional): list of awards
    - bibliography (list[Bibliography], optional): list of bibliography
    - references (list[Reference], optional): list of references

    Return: the global credential of the candidate.
    """
    awards: Optional[list[Award]] = None
    bibliography: Optional[list[Bibliography]] = None
    references: Optional[list[Reference]] = None
