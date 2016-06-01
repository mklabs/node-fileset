var assert       = require('assert');
var fileset      = require('..');
var EventEmitter = require('events').EventEmitter;

describe('Sync API - Given a **.md pattern', function() {
  it('returns the list of matching file in this repo', function() {
    var results = fileset.sync('*.md', 'test/fixtures/**/*.md');
    assert.ok(Array.isArray(results), 'should be an array');
    assert.ok(results.length, 'should return at least one element');
    assert.equal(results.length, 2, 'actually, should return only two');
  });
});

describe('Sync API - Given a *.md and **.js pattern, and two exclude', function() {
  it('returns the list of matching file in this repo', function() {
    var results = fileset.sync('*.md *.js', 'CHANGELOG.md test/fixtures/**/*.md test/fixtures/**/*.js');

    assert.ok(Array.isArray(results), 'should be an array');
    assert.ok(results.length, 'should return at least one element');

    assert.equal(results.length, 7, 'actually, should return only 7');
  });
});
