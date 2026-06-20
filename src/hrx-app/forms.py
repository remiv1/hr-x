"""
HR-X App
Module to handle forms

__author__: Rémi Verschuur
__version__: version 1.0
"""

from __future__ import annotations

from flask_wtf import FlaskForm
from wtforms import SelectField, StringField
from wtforms.validators import DataRequired


class ContactForm(FlaskForm):
    """
    Form for contacts
    
    Attributes:
        type (str): Type of the contact
        value (str): Value of the contact
    """
    type = StringField('type')
    value = StringField('value')


class IdentityForm(FlaskForm):
    """
    Form for identity
    
    Attributes:
        civility (str): Civility of the candidate
        first_name (str): First name of the candidate
        last_name (str): Last name of the candidate
    """
    civility = SelectField('Civilité', choices=[('Mr.','Mr.'),('Mrs.','Mrs.'),('Dr.','Dr.'),('Prof.','Prof.'),('Mx.','Mx.'),('Me','Me'),('other','other')])
    first_name = StringField('Prénom', validators=[DataRequired()])
    last_name = StringField('Nom', validators=[DataRequired()])

    class SkillItemForm(FlaskForm):
        domain = StringField('Domaine')
        label = StringField('Label')
        level = SelectField('Niveau', choices=[('beginner','beginner'),('intermediate','intermediate'),('advanced','advanced'),('expert','expert')])

    class ExperienceForm(FlaskForm):
        position = StringField('Poste', validators=[DataRequired()])
        organisation = StringField('Organisation', validators=[DataRequired()])
        sector = StringField('Secteur')
        start = StringField('Start (YYYY-MM)')
        end = StringField('End (YYYY-MM or empty)')
        description = StringField('Description')

    class EducationForm(FlaskForm):
        title = StringField('Titre', validators=[DataRequired()])
        institution = StringField('Établissement', validators=[DataRequired()])
        year = StringField('Année')
        certification = SelectField('Certification', choices=[('no','no'),('yes','yes')])

    class AwardForm(FlaskForm):
        title = StringField('Titre')
        issuer = StringField('Émetteur')
        year = StringField('Année')

    class ReferenceForm(FlaskForm):
        name = StringField('Nom')
        position = StringField('Poste')
        organisation = StringField('Organisation')
        contact = StringField('Contact')

    class BibliographyForm(FlaskForm):
        title = StringField('Titre')
        authors = StringField('Auteurs (séparés par ;)')
        year = StringField('Année')
        url = StringField('URL')

    class PreferencesForm(FlaskForm):
        availability = StringField('Disponibilité (YYYY-MM-DD)')
        contracts = StringField('Contrats (séparés par ,)')
        remote = SelectField('Remote', choices=[('no','no'),('partial','partial'),('full','full')])
        salary_min = StringField('Salaire min')
