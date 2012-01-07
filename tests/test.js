
var EventEmitter = require('events').EventEmitter,
  fileset = require('../'),
  assert = require('assert'),
  tests = {};

// Given a **.coffee pattern
test('Given a **.md pattern', function(em) {

  return {
    'should return the list of matching file in this repo': function(em) {
      console.log('should should', this, arguments);

      fileset('*.md', function(err, results) {
        if(err) return em.emit('error', err);
        assert.ok(results && results.length);
        assert.ok(Array.isArray(results), 'should be an array');
        console.log(results.length, results);

        assert.equal(results.length, 1);

        em.emit('end');
      });
    }
  }
});


test('Say we want the **.js files', function(em) {

  return {
    'Should recursively walk the dir and return the matching list': function(em) {
      console.log('should should', this, arguments);

      fileset('**.js', function(err, results) {
        if(err) return em.emit('error', err);
        assert.ok(Array.isArray(results), 'should be an array');
        console.log(results.length, results);
        assert.ok(results.length);



        assert.equal(results.length, 1);

        em.emit('end');
      });
    }
  }
});


run();













// ## Test helpers
function test(msg, handler) {
  tests[msg] = handler;
}

function run() {
  var specs = Object.keys(tests),
    specsRemaining = specs.length;

  specs.forEach(function(spec) {
    var handler = tests[spec];

    // grab the set of asserts for this spec
    var shoulds = handler(),
      keys = Object.keys(shoulds),
      remaining = keys.length;

    keys.forEach(function(should) {
      var em = new EventEmitter();

      em
        .on('error', function assertFail(err) { assert.ifError(err) })
        .on('end', function assertOk() {
          shoulds[should].status = true;

          // till we get to 0
          if(!(--remaining)) {
            console.log([
              '',
              '» ' + should,
              '',
              '   Total: ' + keys.length,
              '   Failed: ' + keys.map(function(item) { return shoulds[should].status; }).filter(function(status) { return !status; }).length,
              ''
            ].join('\n'));

            if(!(--specsRemaining)) {
              console.log('All done');
            }

          }
        });

      shoulds[should](em);
    });



    console.log(shoulds);
  });
}



/*
vows.describe('Callback api test suite for node-fileset')
  .addBatch({
    'Given a **.coffee pattern': {
      topic: function() {
        var self = this,
        em = new EventEmitter;

        fileset('**.coffee', function(err, results) {
          if (err) return em.emit('error', err);
          em.emit('success', results);
        });

        return em;
      },

      'should return the list of matching file in this repo': function(err, results) {
        assert.ok(results.length);
      },
    },

    'exludes pattern to node_modules': {
      topic: function() {
        var self = this,
        em = new EventEmitter;

        fileset('**.coffee', 'node_modules', function(err, results) {
          if (err) return em.emit('error', err);
          em.emit('success', results);
        });

        return em;
      },

      'should return a list of files without node_modules in their path': function(err, results) {
        var ok = results.filter(function(it) {
          return (/node_modules/.test(it))
        });

        assert.ok(!ok.length);
      }
    },

    'a more complex example': {
      topic: function() {
        var self = this,
        em = new EventEmitter;

        fileset('**.coffee README.md *.json Cakefile **.js', 'node_modules', function(err, results) {
          if (err) return em.emit('error', err);
          em.emit('success', results);
        });

        return em;
      },

      'should work as expected': function(err, results) {
        assert.equal(results.length, 7);
      }
    }

  })
  .export(module)
*/