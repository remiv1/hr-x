"""
Properties of hrx file.

The Hrx Object is needed to parse the hrx file.

Attributes:
    hrx (object): hrx object
"""

from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, HttpUrl

class Hrx(BaseModel):
    """
    Base class for hrx containing the hrx properties of the file.

    Arguments:
    - version (str): version of the hrx file
    - schema (str): schema of the hrx file
    - issuer (str): issuer of the hrx file
    - date (str): date of the hrx file
    - lang (str): language of the hrx file
    """
    version: str
    schema_uri: HttpUrl
    issuer: str
    date: Optional[str]
    lang: Optional[str]
