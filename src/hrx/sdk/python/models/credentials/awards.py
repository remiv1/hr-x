"""
Model of user part for awards using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class Award(BaseModel):
    """
    Base Model of awards.

    Use this model for explore awards of the candidate.

    Arguments:
    - items (list[AwardItem], optional): list of awards

    Return:
    Return a pydantic model for awards
    """
    items: Optional[list[AwardItem]] = None


class AwardItem(BaseModel):
    """
    Base Model of Items for awards.

    Use this model for explore award items of the candidate.
    
    Arguments:
    - title (str): title of the award
    - isuer (str, optional): issuer of the award
    - year (int, optional): year of the award
    - description (str, optional): description of the award

    Return:
    Return a pydantic model for award items
    """
    title: str
    isuer: Optional[str] = None
    year: Optional[int] = None
    description: Optional[str] = None
