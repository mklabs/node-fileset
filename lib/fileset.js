(function() {
  var EventEmitter, findit, fs, glob, globs, path, rsplit;
  glob = require('glob');
  EventEmitter = require('events').EventEmitter;
  path = require('path');
  fs = require('fs');
  findit = require('findit');
  rsplit = /\s|,\s/;
  module.exports = function(include, exclude, callback) {
    var em, excludes, exludesLength, includes, includesLength, match;
    em = new EventEmitter;
    match = {
      includes: [],
      excludes: []
    };
    if (!callback && typeof exclude === 'function') {
      callback = exclude;
      exclude = "";
    }
    if (!callback && !exclude) {
      exclude = "";
    }
    includes = include.split(rsplit).filter(function(it) {
      return it;
    }) || [];
    excludes = exclude.split(rsplit).filter(function(it) {
      return it;
    }) || [];
    exludesLength = excludes.length;
    includesLength = includes.length;
    globs(includes, em, function(err, results) {
      if (err) {
        if (callback) {
          callback(err);
        }
        return em.emit('error', err);
      }
      match.includes = results;
      em.emit('include', results);
      if (!excludes.length) {
        if (callback) {
          callback(null, results);
        }
        return em.emit('end', results);
      }
      return globs(excludes, em, function(err, results) {
        if (err) {
          if (callback) {
            callback(err);
          }
          return em.emit('error', err);
        }
        match.excludes = results;
        em.emit('exclude', results);
        match.includes = match.includes.filter(function(it) {
          var dotbegin, excluded;
          dotbegin = /^\./.test(it.split('/').reverse()[0]);
          excluded = !!~match.excludes.indexOf(it);
          return !excluded;
        });
        em.emit('end', match.includes);
        if (callback) {
          return callback(null, match.includes);
        }
      });
    });
    return em;
  };
  globs = function(patterns, em, callback) {
    var index, matches, pattern, remaining, _len, _results;
    if (!patterns.length) {
      return callback(new Error('patterns is empty'));
    }
    matches = [];
    patterns = patterns.filter(function(it) {
      return it;
    });
    remaining = patterns.length;
    _results = [];
    for (index = 0, _len = patterns.length; index < _len; index++) {
      pattern = patterns[index];
      _results.push((function(pattern, index) {
        var absolute, errors, files, isGlob;
        isGlob = /\*/.test(pattern);
        if (isGlob) {
          return glob(pattern, function(err, results) {
            if (err) {
              return callback(err);
            }
            matches = matches.concat(results.map(function(it) {
              return path.resolve(it);
            }));
            if (--remaining === 0) {
              return callback(null, matches);
            }
          });
        }
        files = [];
        errors = [];
        absolute = path.resolve(pattern);
        return fs.stat(absolute, function(err, stat) {
          if (err) {
            if (--remaining === 0) {
              callback(null, matches);
            }
            return;
          }
          if (stat && stat.isFile()) {
            matches = matches.concat([absolute]);
            if (--remaining === 0) {
              callback(null, matches);
            }
            return;
          }
          return findit(absolute).on('file', function(file) {
            em.emit('match', file);
            return files.push(file);
          }).on('error', function(err) {
            return errors.push(err);
          }).on('end', function() {
            if (errors.length) {
              return callback(new Error('findit returned with errors'), errors);
            }
            matches = matches.concat(files);
            if (--remaining === 0) {
              return callback(null, matches);
            }
          });
        });
      })(pattern, index));
    }
    return _results;
  };
}).call(this);
