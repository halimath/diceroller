VERSION = 0.13.2
BUILD_NUMBER = 14
CWD = $(shell pwd)
VCS_REF = $(shell git rev-parse --short HEAD)

DOCKER = docker

.PHONY: build-image
build-image: 
	$(DOCKER) build --build-arg version=$(VERSION) --build-arg build_number=$(BUILD_NUMBER) --build-arg vcs_ref=$(VCS_REF) -t diceroller:$(VERSION) .

.PHONY: save-image
save-image: build-image
	$(DOCKER) save diceroller:$(VERSION) > diceroller-$(VERSION).tgz

.PHONY: push-image
push-image: build-image
	$(DOCKER) tag diceroller:$(VERSION) ghcr.io/halimath/diceroller/diceroller:$(VERSION)
	$(DOCKER) push ghcr.io/halimath/diceroller/diceroller:$(VERSION)
