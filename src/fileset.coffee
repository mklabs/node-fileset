
# `helpers` expose a basic wrapper around node-glob by isaacs and 
# findit by substack. Enable multiple pattern matching, and include
# exlude ability.


# External dependency
glob            = require 'glob'
{EventEmitter}  = require 'events'
path            = require 'path'
fs              = require 'fs'
findit          = require 'findit'

# regex used to split include and excludes pattern
rsplit = /\s|,\s/

# ## fileset
#
# a wrapper around node-glob by isaacs that enables
# multiple pattern matching and exlude mechanism
#
# Can be used with callback or emitter style.
#
# * **include**: list of glob patterns `foo/**/*.js *.md src/lib/**/*`
# * **exclude**: list of glob patterns to filter include results `foo/**/*.js *.md`
# * **callback**: function that gets called with an error if something
# wrong happend, otherwise null with an array of results
#
# The callback is optional since the fileset method return an instance
# of EventEmitter which emit different events you might use: 
#
#   * *match*: triggered on findit.file and each glob returned by
#   node-glob, triggerd multiple times
#   * *includes*: array of includes files, triggered once
#   * *excludes*: array of exclude files, triggered once
#   * *end*:  array of include files, filter by exluded files, triggered
#   once
#
module.exports = (include, exclude, callback) ->
  em = new EventEmitter
  match = 
    includes: []
    excludes: []

  # handle no exclude case
  if !callback and typeof exclude is 'function'
    callback = exclude
    exclude = ""

  if !callback and !exclude
    exclude = ""

  includes = include.split(rsplit).filter((it) -> it) or []
  excludes = exclude.split(rsplit).filter((it) -> it) or []
  exludesLength = excludes.length
  includesLength = includes.length

  globs includes, em, (err, results) ->
    if err
      callback err if callback
      return em.emit 'error', err

    match.includes = results
    em.emit 'include', results

    unless excludes.length
      callback null, results if callback
      return em.emit 'end', results

    globs excludes, em, (err, results) ->
      if err
        callback err if callback
        return em.emit 'error', err

      match.excludes = results
      em.emit 'exclude', results

      match.includes = match.includes.filter (it) ->
        dotbegin = /^\./.test it.split('/').reverse()[0]
        excluded = !!~match.excludes.indexOf(it)
        return !(excluded)

      em.emit 'end', match.includes
      callback null, match.includes if callback

  em


# ### globs
# higher level module-scopped function. 
#
# Takes an array of patterns which may match a glob pattern, a file or
# directory. In the case of glob pattern (with a `*`), node-glob is
# used, otherwise findit is used.
#
# The callback get a single array of results.
#
globs = (patterns, em, callback) ->
  return callback new Error('patterns is empty') unless patterns.length

  matches = []
  patterns = patterns.filter (it) -> it
  remaining = patterns.length
  for pattern, index in patterns then do (pattern, index) ->
    isGlob = /\*/.test(pattern)

    if isGlob
      return glob pattern, (err, results) ->
        return callback err if err
        matches = matches.concat results.map((it) -> path.resolve it)
        callback null, matches if --remaining is 0

    files = []
    errors = []
    absolute = path.resolve(pattern)

    # check if we're hitting an existing file
    fs.stat absolute, (err, stat) ->
      # be sure to decrement `remaining` and invoke callback on err
      # but without error state, just give back array `matches`
      if err
        callback null, matches if --remaining is 0
        return

      # when hitting a file, append its path to matches, and prevent
      if stat and stat.isFile()
        matches = matches.concat [absolute]
        callback null, matches if --remaining is 0
        return

      # finaly, we can findit a valid and existing directory
      findit(absolute)
        .on('file', (file) -> em.emit('match', file); files.push(file))
        .on('error', (err) -> errors.push(err))
        .on 'end', () ->
          return callback new Error('findit returned with errors'), errors if errors.length
          matches = matches.concat files
          callback null, matches if --remaining is 0




