# External dependencies.
path            = require 'path'
{spawn, exec}   = require 'child_process'
{EventEmitter}  = require 'events'
colors          = require 'colors'


# error handler, usage:
#
#     return error err if err
#
#     return error new Error(':((') if err
error = (err) ->
  console.error '  ✗ '.red + err.message.red
  process.exit 1


# ### docs
# Generates the source documentation using docco into documentation
# folder
task 'docs', 'Generates the source documentation of this cake script', (options) ->
  commands = [
    "rm -rf documentation"
    "docco src/**.coffee"
    "cp -r docs documentation"
    "rm -rf docs"
  ].join(' && ')

  exec commands, (err, stdout) ->
    return error err if err
    console.log '\n  » ' + stdout.trim().split('\n').join('\n  » ').grey

task 'build', 'Build project from src/*.coffee to lib/*.js', ->
  exec 'coffee --compile --output lib/ src/', (err, stdout, stderr) ->
    return error err if err
    console.log ' ✔ Build project from src/*.coffee to lib/*.js'.grey

