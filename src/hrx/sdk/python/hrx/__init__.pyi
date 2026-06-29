"""Stubs du package HRX: réexporte l'API publique du SDK."""
from .api import HRX    # type: ignore
from .errors import (
    HrxError,   # type: ignore
    HrxFileError,   # type: ignore
    HrxParseError,   # type: ignore
    HrxSchemaError,   # type: ignore
    HrxValidationError,   # type: ignore
    HrxVersionError,   # type: ignore
)
from .models import (
    Award,   # type: ignore
    Bibliography,   # type: ignore
    BibliographyType,   # type: ignore
    Candidate,   # type: ignore
    Civility,   # type: ignore
    Contact,   # type: ignore
    ContactType,   # type: ignore
    ContractType,   # type: ignore
    Credentials,   # type: ignore
    Education,   # type: ignore
    Experience,   # type: ignore
    HrxMetadata,   # type: ignore
    Identity,   # type: ignore
    Level,   # type: ignore
    Location,   # type: ignore
    Mobility,   # type: ignore
    Preferences,   # type: ignore
    Project,   # type: ignore
    Reference,   # type: ignore
    RemoteType,   # type: ignore
    SkillDomain,   # type: ignore
    SkillItem,   # type: ignore
    Skills,   # type: ignore
)

__all__: list[str]

__version__: str
