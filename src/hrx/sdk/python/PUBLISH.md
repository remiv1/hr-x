# Publishing hrxlib to PyPI

## Prerequisites

- Have an account on PyPI and API token configured in `~/.pypirc` or use environment variable `TWINE_USERNAME` and `TWINE_PASSWORD` (or `TWINE_PASSWORD` set to an API token).
- Install `twine` (`pip install twine`) and `build` (`pip install build`).

Build and upload steps:

```bash
cd src/hrx/sdk/python
python -m build
python -m twine upload dist/*
```

To upload to Test PyPI:

```bash
python -m twine upload --repository testpypi dist/*
```
