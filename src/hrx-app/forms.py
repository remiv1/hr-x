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

YEAR = 'Année'

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
    civility = SelectField(
        'Civilité',
        choices=[
            ('Mr.','Mr.'),
            ('Mrs.','Mrs.'),
            ('Dr.','Dr.'),
            ('Prof.','Prof.'),
            ('Mx.','Mx.'),
            ('Me','Me'),
            ('other','other')
        ]
    )
    first_name = StringField('Prénom', validators=[DataRequired()])
    last_name = StringField('Nom', validators=[DataRequired()])

    class SkillItemForm(FlaskForm):
        """
        Form for a skill item
        
        Attributes:
            domain (str): Domain of the skill
            label (str): Label of the skill
            level (str): Level of the skill
        """
        domain = StringField('Domaine')
        label = StringField('Label')
        level = SelectField(
            'Niveau',
            choices=[
                ('beginner','beginner'),
                ('intermediate','intermediate'),
                ('advanced','advanced'),
                ('expert','expert')
            ]
        )

    class ExperienceForm(FlaskForm):
        """
        Form for an experience item
        
        Attributes:
            position (str): Position of the experience
            organisation (str): Organisation of the experience
            sector (str): Sector of the experience
            start (str): Start date of the experience
            end (str): End date of the experience
            description (str): Description of the experience
        """
        position = StringField('Poste', validators=[DataRequired()])
        organisation = StringField('Organisation', validators=[DataRequired()])
        sector = StringField('Secteur')
        start = StringField('Start (YYYY-MM)')
        end = StringField('End (YYYY-MM or empty)')
        description = StringField('Description')

    class EducationForm(FlaskForm):
        """
        Form for an education item
        
        Attributes:
            title (str): Title of the education
            institution (str): Institution of the education
            year (str): Year of the education
            certification (str): Certification of the education
        """
        title = StringField('Titre', validators=[DataRequired()])
        institution = StringField('Établissement', validators=[DataRequired()])
        year = StringField(YEAR)
        certification = SelectField('Certification', choices=[('no','no'),('yes','yes')])

    class AwardForm(FlaskForm):
        """
        Form for an award item
        
        Attributes:
            title (str): Title of the award
            issuer (str): Issuer of the award
            year (str): Year of the award
        """
        title = StringField('Titre')
        issuer = StringField('Émetteur')
        year = StringField(YEAR)

    class ReferenceForm(FlaskForm):
        """
        Form for a reference item
        
        Attributes:
            name (str): Name of the reference
            position (str): Position of the reference
            organisation (str): Organisation of the reference
            contact (str): Contact of the reference
        """
        name = StringField('Nom')
        position = StringField('Poste')
        organisation = StringField('Organisation')
        contact = StringField('Contact')

    class BibliographyForm(FlaskForm):
        """
        Form for a bibliography item
        
        Attributes:
            title (str): Title of the bibliography
            authors (str): Authors of the bibliography
            year (str): Year of the bibliography
            url (str): URL of the bibliography
        """
        title = StringField('Titre')
        authors = StringField('Auteurs (séparés par ;)')
        year = StringField(YEAR)
        url = StringField('URL')

    class PreferencesForm(FlaskForm):
        """
        Form for preferences
        
        Attributes:
            availability (str): Availability of the candidate
            contracts (str): Contracts of the candidate
            remote (str): Remote of the candidate
            salary_min (str): Salary min of the candidate
        """
        availability = StringField('Disponibilité (YYYY-MM-DD)')
        contracts = StringField('Contrats (séparés par ,)')
        remote = SelectField('Remote', choices=[('no','no'),('partial','partial'),('full','full')])
        salary_min = StringField('Salaire min')
