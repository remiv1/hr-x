"""
Model of user part for bibliography using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""
from __future__ import annotations
from typing import Optional
from enum import Enum
from pydantic import BaseModel, HttpUrl

class Bibliography(BaseModel):
    """
    Base model of bibliography
    
    Use this model for explore bibliography of the candidate.

    Arguments:
    - items (list[BibliographyItem], optional): list of bibliography items

    Return:
    - Pydantic model for bibliography
    """
    items: Optional[list[BibliographyItem]] = None


class BibliographyItem(BaseModel):
    """
    Base Model of Items for Bibliography

    Use this model for explore bibliography items of the candidate.
    
    Arguments:
    - title (str): title of the bibliography item
    - author (str, optional): author of the bibliography item
    - year (int, optional): year of the bibliography item
    - item_type (BibliographyType, optional): type of the bibliography item
    - url (HttpUrl, optional): url of the bibliography item
    
    Return:
    - Pydantic model for bibliography items
    """
    title: str
    author: Optional[str] = None
    year: Optional[int] = None
    item_type: Optional[BibliographyType] = None
    url: Optional[HttpUrl] = None


class BibliographyType(Enum):
    """Enum for type of bibliography used for each item.

    Use this Enum to explicit what kind of item is in your bibliography.
    
    Keyword arguments:
    - ARTICLE -- Your item is an article in a journal
    - BOOK -- Your item is a book
    - CONFERENCE -- Your item is a conference
    - REPORT -- Your item is a report
    - OTHER -- Your item is something else
    
    Return:
    - Literal["article" | "book" | "conference" | "report" | "other"]
    """
    ARTICLE = "article"
    BOOK = "book"
    CONFERENCE = "conference"
    REPORT = "report"
    OTHER = "other"
