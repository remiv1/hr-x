.PHONY: build compile-css launch

# Default containerizer is podman. Override on the make command line with
# `CONTAINERIZER=docker` or by setting the shorthand `DOCKER=1`.
CONTAINERIZER ?= podman

ifeq ($(DOCKER),1)
CONTAINERIZER := docker
endif

build:
	$(CONTAINERIZER) build -t hrx-app .

compile-css:
	sass ./static/css/main.scss ./static/css/main.css

launch:
	$(CONTAINERIZER) run -p 5000:5000 hrx-app
