"""
Model of user part for hard and soft skills using hrx schema

See https://schema.audit-io.fr/hrx/1.0/documentation
"""
from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class Skills(BaseModel):
    """
    Base Model of skills.

    Use this model for explore skills of the candidate.

    Arguments:
    - hard (SkillGroup, optional): group of hard-skills
    - soft (SkillGroup, optional): group of soft-skills

    Return:
    Return a pydantic model for skills
    """
    hard: Optional[SkillGroup] = None
    soft: Optional[SkillGroup] = None


class SkillGroup(BaseModel):
    """
    Base Model of skills.

    Use this model for explore skills of the candidate.

    Arguments:
    - items (list[Skill], optional): list of skills

    Return:
    Return a pydantic model for skills
    """
    items: SkillUnits


class SkillUnits(BaseModel):
    """
    Base Model of skills.

    Use this model for explore skills of the candidate.

    Arguments:
    - label (str): label of the skill
    - level (Level, optional): level of the skill

    Return:
    Return a pydantic model for skills
    """
    label: str
    level: Optional[Level] = None


class Level(Enum):
    """
    Enum of levels.

    Use this model for explore levels of the candidate.

    Arguments:
    - BEGINNER (str): beginner level
    - INTERMEDIATE (str): intermediate level
    - ADVANCED (str): advanced level
    - EXPERT (str): expert level

    Return:
    Return a pydantic model for levels
    """
    BEGINNER = 'beginner'
    INTERMEDIATE = 'intermediate'
    ADVANCED = 'advanced'
    EXPERT = 'expert'
