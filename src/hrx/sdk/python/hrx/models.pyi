from datetime import date

class HrxMetadata:
    version: str
    schema_uri: str
    issuer: str | None
    date: date
    lang: str | None

class Identity:
    first_name: str
    last_name: str

class Candidate:
    hrx: HrxMetadata
    identity: Identity
