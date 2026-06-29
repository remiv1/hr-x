.PHONY: build check publish doc

build:
	@echo "-–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–-"
	@echo "Building..."
	@python -m build 2>&1 > /dev/null
	@echo
	@echo "Distribution files:"
	@ls -lh dist

check:
	@echo "-–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–-"
	@echo "Checking..."
	@python -m twine check dist/*; \
	if [ $$? -ne 0 ]; then \
		echo "Check failed. Please fix the issues above before publishing."; \
		exit 1; \
	else \
		echo "Check completed successfully."; \
	fi
	@echo

publish:
	@echo "-–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–-"
	@read -p "Are you sure you want to publish the package? (y/n): " answer; \
	if [ "$$answer" != "y" ]; then \
		echo "Publishing aborted."; \
		exit 1; \
	fi;
	@python -m twine upload dist/*
	@echo

doc:
	@echo "-–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–--–——–-"
	@echo "Building documentation..."
	@python -m mkdocs build 2>&1 > /dev/null; \
	if [ $$? -ne 0 ]; then \
		echo "Documentation build failed. Please fix the issues above."; \
		exit 1; \
	else \
		echo "Documentation built successfully."; \
	fi
	@echo