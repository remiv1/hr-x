PYTHON_PKG_DIR=src/hrx/sdk/python

.PHONY: build docs test clean

build:
	cd $(PYTHON_PKG_DIR) && python -m build

docs:
	cd $(PYTHON_PKG_DIR) && mkdocs build

test:
	cd $(PYTHON_PKG_DIR) && pytest -q

clean:
	rm -rf $(PYTHON_PKG_DIR)/dist $(PYTHON_PKG_DIR)/*.egg-info

publish:
	cd $(PYTHON_PKG_DIR) && python -m twine upload dist/*
