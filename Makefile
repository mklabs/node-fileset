
all: help

help:
	bake -h

test:
	mocha -R spec test

eslint:
	eslint .

fix:
	eslint . --fix

old-tests:
	node tests/test.js
	node tests/test-sync.js
