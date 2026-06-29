# HRX Python SDK (hrxlib)

Paquet Python fournissant les modeles Pydantic et helpers pour le format HRX.

Installation (locally):

```bash
pip install build
cd src/hrx/sdk/python
python -m build
pip install dist/hrxlib-0.1.0-py3-none-any.whl
```

Usage:

```python
from pathlib import Path

from hrx import HRX

doc = HRX.from_path(Path("candidate.hrx"))
candidate = doc.candidate
payload_dict = doc.to_dict()
payload_json = doc.to_json(indent=2)

# Optional: strict JSON schema validation
doc.validate_against_schema(Path("../../models/hrx-schema-v1.json"))
```

Erreurs SDK:

- `HrxFileError`: probleme de lecture/ecriture fichier
- `HrxParseError`: JSON invalide
- `HrxValidationError`: payload non conforme aux modeles Pydantic
- `HrxSchemaError`: payload non conforme au schema JSON
- `HrxVersionError`: version HRX non supportee

Licence: MIT
