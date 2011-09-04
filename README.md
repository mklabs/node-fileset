# node-fileset

Expose a basic wrapper around [node-glob](https://github.com/isaacs/node-glob) by isaacs and [findit](https://github.com/substack/node-findit) by substack. Enable multiple pattern matching, and include exlude ability.

## install

    npm install fileset

## usage

### fileset

Can be used with callback or emitter style.

* **include**: list of glob patterns `foo/**/*.js *.md src/lib/**/*`
* **exclude**: *optional* list of glob patterns to filter include results `foo/**/*.js *.md`
* **callback**: *optional* function that gets called with an error if something wrong happend, otherwise null with an array of results

The callback is optional since the fileset method return an instance of EventEmitter which emit different events you might use: 

* *match*: triggered on findit.file and each glob returned by node-glob, triggerd multiple times
* *includes*: array of includes files, triggered once
* *excludes*: array of exclude files, triggered once
* *end*:  array of include files, filter by exluded files, triggered once


#### callback

    var fileset = require('fileset');

    fileset('**/*.js', '**.min.js', function(err, files) {
      if (err) return console.error(err);

      console.log('Files: ', files.length);
      console.log(files);
    });


#### event emitter

    var fileset = require('fileset');

    fileset('**.coffee README.md *.json Cakefile **.js', 'node_modules')
      .on('match', console.log.bind(console, 'error'))
      .on('includes', console.log.bind(console, 'includes'))
      .on('excludes', console.log.bind(console, 'excludes'))
      .on('end', console.log.bind(console, 'end'));

Check out the [tests](https://github.com/mklabs/node-fileset/tree/master/tests) for more examples.


## tests

just run `npm test` (make sure to install devDependencies too)

## why

mainly as a build tool with cake files, to provide me an easy way to get a list of files by either using glob or path patterns, optionnaly allowing exclude patterns to filter out the results.

All the magic is happening in  [node-glob](https://github.com/isaacs/node-glob) and [findit](https://github.com/substack/node-findit)y, check them out !
