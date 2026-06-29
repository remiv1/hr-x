"""Stubs des modèles Pydantic utilisés par le SDK HRX.

Ce fichier décrit l'API de type des modèles définis dans `models.py`.
"""

from __future__ import annotations

from datetime import date
from enum import Enum
from typing import List, Optional, ClassVar

from pydantic import BaseModel, HttpUrl, ConfigDict

# Types simples (les contraintes sont appliquées au runtime dans `models.py`).
YearMonth = str
CountryCode = str
LanguageCode = str
VersionCode = str


class StrictModel(BaseModel):   # pylint: disable=C0115
    model_config: ClassVar[ConfigDict]


class Civility(str, Enum):   # pylint: disable=C0115
    MR: str
    MRS: str
    DR: str
    PROF: str
    MX: str
    ME: str
    OTHER: str


class ContactType(str, Enum):   # pylint: disable=C0115
    EMAIL: str
    PHONE: str
    LINKEDIN: str
    GITHUB: str
    X: str
    FACEBOOK: str
    INSTAGRAM: str
    WEBSITE: str
    OTHER: str


class Mobility(str, Enum):   # pylint: disable=C0115
    LOCAL: str
    REGIONAL: str
    NATIONAL: str
    INTERNATIONAL: str


class Level(str, Enum):   # pylint: disable=C0115
    BEGINNER: str
    INTERMEDIATE: str
    ADVANCED: str
    EXPERT: str


class ContractType(str, Enum):   # pylint: disable=C0115
    PERMANENT: str
    FIXED_TERM: str
    FREELANCE: str
    MISSION: str
    INTERNSHIP: str
    APPRENTICESHIP: str


class RemoteType(str, Enum):   # pylint: disable=C0115
    NO: str
    PARTIAL: str
    FULL: str


class BibliographyType(str, Enum):   # pylint: disable=C0115
    ARTICLE: str
    BOOK: str
    CONFERENCE: str
    REPORT: str
    OTHER: str


class HrxMetadata(StrictModel):   # pylint: disable=C0115
    version: VersionCode
    schema_uri: HttpUrl
    issuer: Optional[str]
    date: date
    lang: Optional[LanguageCode]


class Contact(StrictModel):   # pylint: disable=C0115
    type: ContactType
    value: str
    primary: Optional[bool]


class Location(StrictModel):   # pylint: disable=C0115
    city: Optional[str]
    postal_code: Optional[str]
    country: Optional[CountryCode]
    mobility: Optional[Mobility]


class Identity(StrictModel):   # pylint: disable=C0115
    civility: Optional[Civility]
    last_name: str
    first_name: str
    contacts: Optional[List[Contact]]
    location: Optional[Location]


class SkillItem(StrictModel):   # pylint: disable=C0115
    label: str
    level: Optional[Level]


class SkillDomain(StrictModel):   # pylint: disable=C0115
    domain: str
    items: List[SkillItem]


class Skills(StrictModel):   # pylint: disable=C0115
    hard: Optional[List[SkillDomain]]
    soft: Optional[List[SkillDomain]]


class Period(StrictModel):   # pylint: disable=C0115
    start: YearMonth
    end: Optional[YearMonth]


class Project(StrictModel):   # pylint: disable=C0115
    title: str
    description: Optional[str]
    role: Optional[str]
    period: Optional[Period]
    url: Optional[HttpUrl]


class Experience(StrictModel):   # pylint: disable=C0115
    position: str
    organisation: str
    sector: Optional[str]
    period: Period
    description: Optional[str]
    achievements: Optional[List[str]]
    projects: Optional[List[Project]]


class Education(StrictModel):   # pylint: disable=C0115
    title: str
    institution: str
    year: int
    certification: Optional[bool]


class Award(StrictModel):   # pylint: disable=C0115
    title: str
    issuer: Optional[str]
    year: Optional[int]
    description: Optional[str]


class Reference(StrictModel):   # pylint: disable=C0115
    name: str
    position: Optional[str]
    organisation: Optional[str]
    contact: Optional[str]


class Bibliography(StrictModel):   # pylint: disable=C0115
    title: str
    authors: Optional[List[str]]
    year: Optional[int]
    type: Optional[BibliographyType]
    url: Optional[HttpUrl]


class Credentials(StrictModel):   # pylint: disable=C0115
    awards: Optional[List[Award]]
    references: Optional[List[Reference]]
    bibliography: Optional[List[Bibliography]]


class Preferences(StrictModel):   # pylint: disable=C0115
    availability: Optional[date]
    contracts: Optional[List[ContractType]]
    remote: Optional[RemoteType]
    salary_min: Optional[int]


class Candidate(StrictModel):   # pylint: disable=C0115
    hrx: HrxMetadata
    identity: Identity
    skills: Optional[Skills]
    experiences: Optional[List[Experience]]
    education: Optional[List[Education]]
    credentials: Optional[Credentials]
    preferences: Optional[Preferences]
