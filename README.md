# HR‑X — Standard portable de données candidat

[![Version PyPI](https://img.shields.io/pypi/v/hr-x)](https://pypi.org/project/hr-x)
[![Python](https://img.shields.io/pypi/pyversions/hr-x)](https://pypi.org/project/hr-x)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://remiv1.github.io/hr-x/)
![docs/logo_plain.png](https://raw.githubusercontent.com/remiv1/hr-x/main/doc/hr-x_heavy.png)

HR‑X est un format ouvert et minimaliste pour représenter les données d’un·e candidat·e de façon immédiatement exploitable par les systèmes RH (ATS, CRM, SI RH, plateformes), sans parsing de CV. Objectif: des données structurées, portables et vérifiables, au service de l’efficacité économique et du mieux‑être candidat.

- Standard JSON avec schéma formel (JSON Schema).
- **Portable**: un fichier unique `.hrx` — diffable, versionnable, partageable.
- **Interopérable**: identité, compétences, expériences, éducation, références, préférences.
- **Vérifiable**: validation automatique via l’URI de schéma officiel.
- **Sobre**: pas de mise en page, uniquement de la donnée.
- **Personnalisable** : Chaque lecteur pourra personnaliser l'outil de lecture.

> **Schéma**: [src/hrx/hrx-schema-v1.json](src/hrx/hrx-schema-v1.json)
>
> **Exemple complet**: [src/hrx/exemple-candidat.hrx](src/hrx/exemple-candidat.hrx)

## Portée et ambition

- Portée nationale puis européenne, avec enrôlement progressif des entreprises, éditeurs ATS et places de marché.
- Gouvernance ouverte pour aligner intérêts privés, acteurs publics et exigences RGPD.

## Pourquoi maintenant ? (constat marché)

Les documents de la section “constat” synthétisent la situation actuelle:

- Re‑saisie systématique, narratifs multiples, perte de qualité de données côté candidat.
- Parsing ATS d’un PDF — la donnée est structurée → aplatie → re‑structurée, avec pertes.
- 87% des candidatures sans réponse (Berguig 2023) et ~2% de conversion vers entretien.
- Coûts moyens par recrutement 5 000–8 000 €; un échec peut coûter 30–150 k€.

> **Références**: [01_constat.md](doc/constat/01_constat.md), [02_couts.md](doc/constat/02_couts.md), [03_article.md](doc/constat/03_article.md)

## ESG par conception

- **Moins de friction**: fin des re‑saisies et des formats divergents → charge mentale réduite, expérience candidat améliorée.
- **Équité et transparence**: données normalisées, traçables, prêtes pour des décisions explicables.
- **Sobriété numérique**: chaînes de traitement plus courtes, moins de parsing/erreurs/retraitements.
- **Inclusion**: meilleure visibilité des profils atypiques grâce à des champs explicites (réalisations, projets, préférences) plutôt qu’à des heuristiques opaques.

## Principes de conception

- Minimal mais suffisant sur le cœur RH.
- Lisible humainement, strict pour la machine (types, formats, enum).
- Versionné via `$hrx` (version, schéma, date, langue, émetteur).
- Extensible par gouvernance plutôt que par fourre‑tout libre.

## Structure du format (vue d’ensemble)

L'idée est de créer un COPIL avec des professionnels, dirigeants politiques, institutionnels, etc. Pour le moment, voici ce qui est proposer pour la démonstration.

- `$hrx`: métadonnées du document
  - `version` (ex: "1.0"), `schema` (URI), `issuer`, `date` (YYYY‑MM‑DD), `lang` (ISO 639‑1).
- `identity`: identité et coordonnées
  - `civility`, `last_name`, `first_name`, `contacts[]` (email, phone, linkedin, github, x, …), `location` (ville, code pays ISO‑2, mobilité).
- `skills`: compétences
  - `hard[]`, `soft[]` regroupées par `domain`, avec `items[]` { `label`, `level` ∈ beginner|intermediate|advanced|expert }.
- `experiences[]`: emplois/missions/projets
  - `position`, `organisation`, `sector`, `period` (YYYY‑MM), `description`, `achievements[]`, `projects[]`.
- `education[]`: diplômes et certifications
  - `title`, `institution`, `year`, `certification`.
- `credentials`: preuves et références
  - `awards[]`, `references[]`, `bibliography[]`.
- `preferences`: modalités
  - `availability` (date), `contracts[]`, `remote` (no|partial|full), `salary_min`.

Le détail exhaustif des contraintes est défini dans le schéma: [src/hrx/hrx-schema-v1.json](src/hrx/hrx-schema-v1.json).

## Exemple minimal

```json
{
    "$hrx": {
    "version": "1.0",
        "schema": "https://schema.audit-io.fr/hrx/1.0",
        "date": "2026-06-14",
        "lang": "fr"
    },
    "identity": {
        "last_name": "Durand",
        "first_name": "Alex",
        "contacts": [
            { "type": "email", "value": "alex.durand@example.com", "primary": true }
        ],
        "location": { "city": "Paris", "country": "FR" }
    }
}
```

Un exemple complet est fourni ici: [src/hrx/exemple-candidat.hrx](src/hrx/exemple-candidat.hrx)

## Valider un fichier HR‑X

- Schéma officiel: [src/hrx/hrx-schema-v1.json](src/hrx/hrx-schema-v1.json)
- Extension recommandée `.hrx` (JSON), type MIME suggéré `application/hrx+json`.

Python (jsonschema):

```bash
pip install check-jsonschema
check-jsonschema src/hrx/models/exemple-candidat.hrx --schemafile src/hrx/models/hrx-schema-v1.json
```

## Cas d’usage

- ATS/CRM: ingestion directe sans parsing, mapping stable vers modèles internes.
- Matching: exploitation fiable des `skills`, `experiences`, `preferences`.
- Marchés publics/privés: échange inter‑plateformes unifié.
- SI RH: référentiel collaborateurs/candidats propre et diffable.

## Vision plateforme et outillage

- **Plateforme HR‑X**: génération, édition et portabilité des profils par les candidats, dépôt unifié vers les entreprises et plateformes.
- **HR-X Reader**: visionneuse/SDK d’interface de la donnée brute, avec sélection des sections à afficher et mapping paramétrable vers des modèles de lecture (ex: focus « projets » vs « références »).
- **SDKs d’adaptation**: librairies de conversion pour éditeurs ATS/CRM afin de limiter l’effort d’intégration.

## Gouvernance, adoption et échelle

- **Stratégie d’adoption**: entreprises « anchor » et éditeurs ATS pilotes pour créer une norme de fait, relais institutionnels (portée européenne) pour la visibilité et l’alignement réglementaire.
- **Alignement RGPD/portabilité (art. 20)**: traçabilité via `$hrx.issuer`/`date`, minimisation des données, consentement explicite côté plateformes.

## Versioning et compatibilité

- **Document**: `$hrx.version` (ex: 1.0) et `$hrx.schema` (URI de validation).
- **Politique**: versions mineures rétro‑compatibles; majeures avec changelog et guide de migration.

Schéma v1.0 — ID: `https://schema.audit-io.fr/hr-x/v1.0/schema`

## Démarrer rapidement

1) Copier [src/hrx/models/exemple-candidat.hrx](src/hrx/models/exemple-candidat.hrx)  
2) Renseigner les champs requis (`$hrx`, `identity`)  
3) Valider contre le schéma (commandes ci‑dessus)  
4) Ingestion dans votre système (mapping minimal)

## Contribution

- Propositions d’évolution du schéma et de la doc via issues/PR.
- Merci de discuter en amont tout ajout d’énumérations/domaines de compétences.

## Licence et crédits

- Spécification et schéma publiés par Audit IO.
- Licence MIT.
