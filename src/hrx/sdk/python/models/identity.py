"""
Model of user part for identity using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""
from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class Civility(Enum):
    """
    Enum of civility.

    Use this enum to explore the list of civility.

    Arguments:
    - MR (str): Mr.
    - MRS (str): Mrs.
    - DR (str): Dr.
    - PROF (str): Prof.
    - MX (str): Mx.
    - ME (str): Me
    - OTHER (str): other

    Returns:
    - Enum for civility.
    """
    MR = "Mr."
    MRS = "Mrs."
    DR = "Dr."
    PROF = "Prof."
    MX = "Mx."
    ME = "Me"
    OTHER = "other"


class Contacts(BaseModel):
    """
    Base Model of contacts.

    Use this model to explore the list of contacts, phone, mails, socials...

    Arguments:
    - items (list[ContactUnit]): List of candidate contacts.

    Returns:
    - Pydantic model for contacts items.
    """
    items: list[ContactUnists]


class ContactUnists(BaseModel):
    """
    Base Model of contact unit.

    Use this model to explore the list of contacts, phone, mails, socials...

    Arguments:
    - type (ContactType): Type of the contact.
    - value (str): Value of the contact.
    - primary (bool): True if the contact is the primary contact.

    Returns:
    - Pydantic model for contact unit.
    """
    contact_type: ContactType
    value: str
    primary: Optional[bool]


class ContactType(Enum):
    """
    Enum of contact type.
    
    Use this enum to explore the list of contact type.

    Arguments:
    - EMAIL (str): email
    - PHONE (str): phone
    - LINKEDIN (str): linkedin
    - GITHUB (str): github
    - X (str): x
    - FACEBOOK (str): facebook
    - INSTAGRAM (str): instagram
    - WEBSITE (str): website
    - OTHER (str): other

    Returns:
    - Enum for contact type.
    """
    EMAIL = "email"
    PHONE = "phone"
    LINKEDIN = "linkedin"
    GITHUB = "github"
    X = "x"
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"
    WEBSITE = "website"
    OTHER = "other"


class Location(BaseModel):
    """
    Base Model of location.

    Use this model to explore location of the candidate.

    Arguments:
    - city (str): City of the candidate.
    - postal_code (str): Postal code of the candidate.
    - country (str): Country of the candidate.
    - mobility (str): Mobility of the candidate.

    Returns:
    - Pydantic model for location.
    """
    city: str
    postal_code: str
    country: str
    mobility: Mobility


class Mobility(Enum):
    """
    Enum of mobility.

    Use this enum to explore the list of mobility.

    Arguments:
    - LOCAL (str): Local
    - REGIONAL (str): Regional
    - NATIONAL (str): National
    - INTERNATIONAL (str): International

    Returns:
    - Enum for mobility.
    """
    LOCAL = "Local"
    REGIONAL = "Regional"
    NATIONAL = "National"
    INTERNATIONAL = "International"


class Identity(BaseModel):
    """
    Base Model of identity.

    Use this model for explore identity of the candidate.

    Arguments:
    - 

    Return:
    Return a pydantic model for identity of the candidate
    """
    civlity: Optional[Civility] = None
    last_name: str
    first_name: str
    contacts: Optional[Contacts] = None
    location: Optional[Location] = None
