.PHONY: build compile-css launch

# Default containerizer is podman. Override on the make command line with
# `CONTAINERIZER=docker` or by setting the shorthand `DOCKER=1`.
CONTAINERIZER ?= podman
PROJECT_PATH ?= $(shell dirname $(abspath $(lastword $(MAKEFILE_LIST))))

ifeq ($(DOCKER),1)
CONTAINERIZER := docker
endif

build:
	$(CONTAINERIZER) build -t hrx-app .

compile-css:
	sass $(PROJECT_PATH)/static/css/main.scss $(PROJECT_PATH)/static/css/main.css

launch:
	$(CONTAINERIZER) run -p 5000:5000 hrx-app
