"""
Model of user part for education using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class Education(BaseModel):
    """
    Base Model of education.

    Use this model for explore education of the candidate.

    Arguments:
    - items (list[EducationItgems], optional): list of education elements

    Return:
    Return a pydantic model for education
    """
    items: list[EducationItem]


class EducationItem(BaseModel):
    """
    Base Model of education items.

    Use this model for explore education items of the candidate.

    Arguments:
    - title (str): title of the education
    - institution (str, optional): institution of the education
    - year (int, optional): year of the education
    - certification (bool, optional): certification of the education

    Return:
    Return a pydantic model for education items
    """
    title: str
    institution: str
    year: int
    certification: Optional[bool] = None
