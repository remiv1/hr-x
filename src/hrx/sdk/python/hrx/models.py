"""Pydantic models aligned with HRX v1 JSON schema."""

from __future__ import annotations

from datetime import date
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, StringConstraints
from typing_extensions import Annotated

YearMonth = Annotated[str, StringConstraints(pattern=r"^\d{4}-\d{2}$")]
CountryCode = Annotated[str, StringConstraints(pattern=r"^[A-Z]{2}$")]
LanguageCode = Annotated[str, StringConstraints(pattern=r"^[a-z]{2}$")]
VersionCode = Annotated[str, StringConstraints(pattern=r"^\d+\.\d+$")]


class StrictModel(BaseModel):
    """Shared model config: no unknown keys and alias support."""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)


class Civility(str, Enum):
    """Common civility titles."""
    MR = "Mr."
    MRS = "Mrs."
    DR = "Dr."
    PROF = "Prof."
    MX = "Mx."
    ME = "Me"
    OTHER = "other"


class ContactType(str, Enum):
    """Types of contact methods."""
    EMAIL = "email"
    PHONE = "phone"
    LINKEDIN = "linkedin"
    GITHUB = "github"
    X = "x"
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"
    WEBSITE = "website"
    OTHER = "other"


class Mobility(str, Enum):
    """Types of mobility."""
    LOCAL = "local"
    REGIONAL = "regional"
    NATIONAL = "national"
    INTERNATIONAL = "international"


class Level(str, Enum):
    """Proficiency levels."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class ContractType(str, Enum):
    """Types of contract."""
    PERMANENT = "permanent"
    FIXED_TERM = "fixed-term"
    FREELANCE = "freelance"
    MISSION = "mission"
    INTERNSHIP = "internship"
    APPRENTICESHIP = "apprenticeship"


class RemoteType(str, Enum):
    """Types of remote work."""
    NO = "no"
    PARTIAL = "partial"
    FULL = "full"


class BibliographyType(str, Enum):
    """Types of bibliography entries."""
    ARTICLE = "article"
    BOOK = "book"
    CONFERENCE = "conference"
    REPORT = "report"
    OTHER = "other"


class HrxMetadata(StrictModel):
    """HRX metadata."""
    version: VersionCode
    schema_uri: HttpUrl = Field(alias="schema")
    issuer: str | None = None
    date: date
    lang: LanguageCode | None = None


class Contact(StrictModel):
    """Contact information."""
    type: ContactType
    value: str
    primary: bool | None = None


class Location(StrictModel):
    """Location information."""
    city: str | None = None
    postal_code: str | None = None
    country: CountryCode | None = None
    mobility: Mobility | None = None


class Identity(StrictModel):
    """Identity information."""
    civility: Civility | None = None
    last_name: str
    first_name: str
    contacts: list[Contact] | None = None
    location: Location | None = None


class SkillItem(StrictModel):
    """Skill item."""
    label: str
    level: Level | None = None


class SkillDomain(StrictModel):
    """Skill domain."""
    domain: str
    items: list[SkillItem]


class Skills(StrictModel):
    """Skills information."""
    hard: list[SkillDomain] | None = None
    soft: list[SkillDomain] | None = None


class Period(StrictModel):
    """Period information."""
    start: YearMonth
    end: YearMonth | None = None


class Project(StrictModel):
    """Project information."""
    title: str
    description: str | None = None
    role: str | None = None
    period: Period | None = None
    url: HttpUrl | None = None


class Experience(StrictModel):
    """Experience information."""
    position: str
    organisation: str
    sector: str | None = None
    period: Period
    description: str | None = None
    achievements: list[str] | None = None
    projects: list[Project] | None = None


class Education(StrictModel):
    """Education information."""
    title: str
    institution: str
    year: int = Field(ge=1900, le=2100)
    certification: bool | None = None


class Award(StrictModel):
    """Award information."""
    title: str
    issuer: str | None = None
    year: int | None = None
    description: str | None = None


class Reference(StrictModel):
    """Reference information."""
    name: str
    position: str | None = None
    organisation: str | None = None
    contact: str | None = None


class Bibliography(StrictModel):
    """Bibliography information."""
    title: str
    authors: list[str] | None = None
    year: int | None = None
    type: BibliographyType | None = None
    url: HttpUrl | None = None


class Credentials(StrictModel):
    """Credentials information."""
    awards: list[Award] | None = None
    references: list[Reference] | None = None
    bibliography: list[Bibliography] | None = None


class Preferences(StrictModel):
    """Preferences information."""
    availability: date | None = None
    contracts: list[ContractType] | None = None
    remote: RemoteType | None = None
    salary_min: int | None = None


class Candidate(StrictModel):
    """Candidate information."""
    hrx: HrxMetadata = Field(alias="$hrx")
    identity: Identity
    skills: Skills | None = None
    experiences: list[Experience] | None = None
    education: list[Education] | None = None
    credentials: Credentials | None = None
    preferences: Preferences | None = None
