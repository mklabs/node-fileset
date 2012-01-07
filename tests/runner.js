

var exec = require('child_process').exec,
  windows = process.platform === 'win32';

// basic test runner test suite

// Needed only to be able to run the test seamlessly on posix / windows platform.
//
// If we don't want to rely on the vows global executable and rely on the
// devDependencies' installed locally, that's how I do it. I may need some advice on this.
//
// Bin executables are made available "locally" in node_modules/.bin. On posix, this map the
// `./node_modules/.bin/packagename`. On windows, the command is slightly different and needs to use
// `./node_modules/.bin/packagename.cmd`

var cmd = windows ? '\"./node_modules/.bin/vows.cmd\"' : './node_modules/.bin/vows';

exec(cmd + ' ./tests/callback.js ./tests/emitter.js --spec', function(err, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);

  process.exit(err ? 1 : 0);
});