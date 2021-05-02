VERSION = 0.12.1
BUILD_NUMBER = 10
DATE = $(shell date --iso-8601=seconds)
CWD = $(shell pwd)
VCS_REF = $(shell git rev-parse --short HEAD)

DOCKER = docker

.PHONY: docker-image

docker-image: 
	$(DOCKER) build --build-arg version=$(VERSION) --build-arg build_number=$(BUILD_NUMBER) --build-arg date=$(DATE) --build-arg vcs_ref=$(VCS_REF) -t diceroller:$(VERSION) .
	# $(DOCKER) save diceroller:$(VERSION) > diceroller-$(VERSION).tgz
