.PHONY: all clean compile package install docs publish help

.DEFAULT_GOAL := help

# ==============================================================================
# VARIABLES
# ==============================================================================

MVN := mvn

# ==============================================================================
# TARGETS
# ==============================================================================

all: package

clean:
	@echo "Cleaning project..."
	@$(MVN) clean

compile:
	@echo "Compiling project..."
	@$(MVN) compile

package: compile
	@echo "Packaging project..."
	@$(MVN) package

install: package
	@echo "Installing package to local Maven repository..."
	@$(MVN) install

docs:
	@echo "Generating Javadoc..."
	@$(MVN) javadoc:javadoc

publish: package
	@echo "Publishing package..."
	@echo "Note: Publishing requires <distributionManagement> to be configured in pom.xml"
	@$(MVN) deploy

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  all        - Cleans and creates the package (default)."
	@echo "  clean      - Removes build artifacts."
	@echo "  compile    - Compiles the source code."
	@echo "  package    - Packages the compiled code into a JAR."
	@echo "  install    - Installs the JAR in your local Maven repository."
	@echo "  docs       - Generates Javadoc."
	@echo "  publish    - Publishes the package to a remote repository."
	@echo "  help       - Shows this help message."

