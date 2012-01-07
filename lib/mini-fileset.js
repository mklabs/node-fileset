


var findit = require('findit'),
  path = require('path'),
  minimatch = require('minimatch'),
  EventEmitter = require('events').EventEmitter;

module.exports = fileset;


function fileset(include, exclude, cb) {
  console.log('fileset', arguments);
  debugger;
  var em = new EventEmitter,
    // change api to support options, at least options.cwd
    root = process.cwd();

  if(!cb) {
    console.log(typeof exclude)
    if(typeof exclude === 'function') {
      cb = exclude;
      delete exclude;
    }
  }

  var dir = path.dirname(path.join(root, include)),
    filter = minimatch.filter(include, { matchBase : true }),
    files = {};

  console.log('b', dir, path.join(root, include));

  findit.find(dir)
    .on('error', cb)
    .on('end', function(err, results) {
      console.log('end findit', arguments);
      if(err) return cb(err);
      cb(null, Array.prototype.slice.call(arguments, 1).filter(filter));
    });


  console.log('fileset', arguments);
  return em;
}
