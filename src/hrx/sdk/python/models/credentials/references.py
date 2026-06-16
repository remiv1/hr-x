"""
Model of user part for references using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class Reference(BaseModel):
    """
    Base Model for references

    Use this model to explore references of the candidate.

    Arguments:
    - items (list[ReferenceItem], optional): list of references

    Return:
    - Pydantic model for references
    """
    items: Optional[list[ReferenceItem]] = None


class ReferenceItem(BaseModel):
    """
    Base Model for references items.

    Use this model for explore reference items of the candidate.

    Arguments:
    - name (str): the name of the reference
    - position (str, optional): postition between the candidate and the reference.
    - organisation (str, optional): organisation of the reference
    - contact (str, optional): contact of the reference

    Return:
    - Pydantic model for reference items
    """
    name: str
    position: Optional[str] = None
    organisation: Optional[str] = None
    contact: Optional[str] = None
