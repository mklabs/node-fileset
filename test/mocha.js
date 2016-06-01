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

// Given a **.md pattern
describe('Given a **.md pattern', function() {
  it('returns the list of matching file in this repo', function(done) {
    fileset('*.md', function(err, results) {
      if(err) return done(err);
      assert.ok(Array.isArray(results), 'should be an array');
      assert.ok(results.length, 'should return at least one element');
      assert.equal(results.length, 2, 'actually, should return only two');
      done();
    });
  });
});

describe('Say we want the **.js files, but not those in node_modules', function() {
  it('recursively walks the dir and returns the matching list', function(done) {
    fileset('**/*.js', '', function(err, results) {
      if(err) return done(err);
      assert.ok(Array.isArray(results), 'should be an array');
      assert.equal(results.length, 11);
      done();
    });
  });

  it('recursively walks the dir and returns the matching list', function(done) {
    fileset('**/*.js', function(err, results) {
      if(err) return done(err);
      assert.ok(Array.isArray(results), 'should be an array');
      assert.equal(results.length, 11);
      done();
    });
  });

  it('supports multiple paths at once', function(done) {
    fileset('**/*.js *.md', 'node_modules/**', function(err, results) {
      if(err) return done(err);

      assert.ok(Array.isArray(results), 'should be an array');
      assert.equal(results.length, 13);

      assert.deepEqual(results, [
        'CHANGELOG.md',
        'README.md',
        'lib/fileset.js',
        'test/fixtures/an (odd) filename.js',
        'test/fixtures/glob/common.js',
        'test/fixtures/glob/glob.js',
        'test/fixtures/glob/sync.js',
        'test/fixtures/minimatch/minimatch.js',
        'test/mocha.js',
        'tests/fixtures/an (odd) filename.js',
        'tests/helper.js',
        'tests/test-sync.js',
        'tests/test.js'
      ]);

      done();
    });
  });

  it('Should support multiple paths for excludes as well', function(done) {
    fileset('**/*.js *.md', 'node_modules/** **.md tests/*.js', function(err, results) {
      if(err) return done(err);
      assert.ok(Array.isArray(results), 'should be an array');
      assert.equal(results.length, 8);

      assert.deepEqual(results, [
        'lib/fileset.js',
        'test/fixtures/an (odd) filename.js',
        'test/fixtures/glob/common.js',
        'test/fixtures/glob/glob.js',
        'test/fixtures/glob/sync.js',
        'test/fixtures/minimatch/minimatch.js',
        'test/mocha.js',
        'tests/fixtures/an (odd) filename.js',
      ]);

      done();
    });
  });
});

describe('Testing out emmited events', function() {
  it('recursively walk the dir and return the matching list', function(done) {
    fileset('**/*.js', 'node_modules/**')
      .on('error', done)
      .on('end', function(results) {
        assert.ok(Array.isArray(results), 'should be an array');
        assert.equal(results.length, 11);
        done();
      });
  });

  it('support multiple paths at once', function(done) {
    fileset('**/*.js *.md', 'node_modules/**')
      .on('error', done)
      .on('end', function(results) {
        assert.ok(Array.isArray(results), 'should be an array');
        assert.equal(results.length, 13);

        assert.deepEqual(results, [
          'CHANGELOG.md',
          'README.md',
          'lib/fileset.js',
          'test/fixtures/an (odd) filename.js',
          'test/fixtures/glob/common.js',
          'test/fixtures/glob/glob.js',
          'test/fixtures/glob/sync.js',
          'test/fixtures/minimatch/minimatch.js',
          'test/mocha.js',
          'tests/fixtures/an (odd) filename.js',
          'tests/helper.js',
          'tests/test-sync.js',
          'tests/test.js'
        ]);

        done();
      });
  });
});

describe('Testing patterns passed as arrays', function() {
  it('match files passed as an array with odd filenames', function(done) {
    fileset(['lib/*.js', 'test/fixtures/an (odd) filename.js'], ['node_modules/**'])
      .on('error', done)
      .on('end', function(results) {
        assert.ok(Array.isArray(results), 'should be an array');
        assert.equal(results.length, 2);
        assert.deepEqual(results, [
          'lib/fileset.js',
          'test/fixtures/an (odd) filename.js',
        ]);

        done();
      });
  });
});
