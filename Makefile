
all: help

help:
	bake -h

test:
	node tests/test.js && node tests/test-sync.js
