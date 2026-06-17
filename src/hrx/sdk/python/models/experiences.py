"""
Model of user part for experiences using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, HttpUrl


class Experience(BaseModel):
    """
    Base Model of experience.

    Use this model for explore experiences of the candidate.

    Arguments:
    - items (list[ExperienceItems], optional): list of experiences

    Return:
    Return a pydantic model for experiences
    """
    items: Optional[list[ExperienceItem]] = None


class ExperienceItem(BaseModel):
    """
    Base Model of experience items.

    Use this model for explore experience items of the candidate.

    Arguments:
    - position (str): position of the experience
    - organisation (str, optional): organisation of the experience
    - period (Period): period of the experience
    - description (str, optional): description of the experience
    - achievements (list[Achievement], optional): list of achievements of the experience
    - projects (list[Project], optional): list of projects of the experience

    Return:
    Return a pydantic model for experience items
    """
    position: str
    organisation: str
    sector: str
    period: ExperiencePeriod
    description: Optional[str] = None
    achievements: Optional[list[ExperienceAchievement]] = None
    projects: Optional[list[ExperienceProject]] = None


class ExperiencePeriod(BaseModel):
    """
    Base Model of experience period.

    Use this model for explore experience period of the candidate.

    Arguments:
    - start_date (date): start date of the experience
    - end_date (date, optional): end date of the experience

    Return:
    Return a pydantic model for experience period
    """
    start_date: str
    end_date: Optional[str] = None


class ExperienceAchievement(BaseModel):
    """
    Base Model of experience achievements.

    Use this model for explore experience achievements of the candidate.

    Arguments:
    - achievement_type (str): type of the experience achievement

    Return:
    Return a pydantic model for experience achievements
    """
    achievement_type: str


class ExperienceProject(BaseModel):
    """
    Base Model of experience projects.

    Use this model for explore experience projects of the candidate.

    Arguments:
    - title (str): title of the experience project
    - description (str, optional): description of the experience project
    - role (str, optional): role of the experience project
    - period (ExperiencePeriod, optional): period of the experience project
    - url (HttpUrl, optional): url of the experience project

    Return:
    Return a pydantic model for experience projects
    """
    title: str
    description: Optional[str] = None
    role: Optional[str] = None
    period: Optional[ExperiencePeriod] = None
    url: Optional[HttpUrl] = None
