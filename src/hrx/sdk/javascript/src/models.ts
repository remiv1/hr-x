/**
 * Modèles de données (interfaces) alignés avec le schéma JSON HRX v1.
 */

export type YearMonth = string;      // Pattern: ^\d{4}-\d{2}$
export type CountryCode = string;    // Pattern: ^[A-Z]{2}$
export type LanguageCode = string;   // Pattern: ^[a-z]{2}$
export type VersionCode = string;    // Pattern: ^\d+\.\d+$

export enum Civility {
    MR = "Mr.",
    MRS = "Mrs.",
    DR = "Dr.",
    PROF = "Prof.",
    MX = "Mx.",
    ME = "Me",
    OTHER = "other",
}

export enum ContactType {
    EMAIL = "email",
    PHONE = "phone",
    LINKEDIN = "linkedin",
    GITHUB = "github",
    X = "x",
    FACEBOOK = "facebook",
    INSTAGRAM = "instagram",
    WEBSITE = "website",
    OTHER = "other",
}

export enum Mobility {
    LOCAL = "local",
    REGIONAL = "regional",
    NATIONAL = "national",
    INTERNATIONAL = "international",
}

export enum Level {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert",
}

export enum ContractType {
    PERMANENT = "permanent",
    FIXED_TERM = "fixed-term",
    FREELANCE = "freelance",
    MISSION = "mission",
    INTERNSHIP = "internship",
    APPRENTICESHIP = "apprenticeship",
}

export enum RemoteType {
    NO = "no",
    PARTIAL = "partial",
    FULL = "full",
}

export enum BibliographyType {
    ARTICLE = "article",
    BOOK = "book",
    CONFERENCE = "conference",
    REPORT = "report",
    OTHER = "other",
}

export interface HrxMetadata {
    version: VersionCode;
    schema: string;
    issuer?: string;
    date: string; // format date
    lang?: LanguageCode;
}

export interface Contact {
    type: ContactType;
    value: string;
    primary?: boolean;
}

export interface Location {
    city?: string;
    postal_code?: string;
    country?: CountryCode;
    mobility?: Mobility;
}

export interface Identity {
    civility?: Civility;
    last_name: string;
    first_name: string;
    contacts?: Contact[];
    location?: Location;
}

export interface SkillItem {
    label: string;
    level?: Level;
}

export interface SkillDomain {
    domain: string;
    items: SkillItem[];
}

export interface Skills {
    hard?: SkillDomain[];
    soft?: SkillDomain[];
}

export interface Period {
    start: YearMonth;
    end?: YearMonth;
}

export interface Project {
    title: string;
    description?: string;
    role?: string;
    period?: Period;
    url?: string;
}

export interface Experience {
    position: string;
    organisation: string;
    sector?: string;
    period: Period;
    description?: string;
    achievements?: string[];
    projects?: Project[];
}

export interface Education {
    title: string;
    institution: string;
    year: number;
    certification?: boolean;
}

export interface Award {
    title: string;
    issuer?: string;
    year?: number;
    description?: string;
}

export interface Reference {
    name: string;
    position?: string;
    organisation?: string;
    contact?: string;
}

export interface Bibliography {
    title: string;
    authors?: string[];
    year?: number;
    type?: BibliographyType;
    url?: string;
}

export interface Credentials {
    awards?: Award[];
    references?: Reference[];
    bibliography?: Bibliography[];
}

export interface Preferences {
    availability?: string; // format date
    contracts?: ContractType[];
    remote?: RemoteType;
    salary_min?: number;
}

export interface Candidate {
    $hrx: HrxMetadata;
    identity: Identity;
    skills?: Skills;
    experiences?: Experience[];
    education?: Education[];
    credentials?: Credentials;
    preferences?: Preferences;
}
