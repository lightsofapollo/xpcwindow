/**
 * xpc module system designed
 * for extending the capabilities
 * of xpcwindow.
 *
 *
 * Designed to be mostly api compatible
 * with nodejs.
 */
window.xpcModule = (function() {

  var root = _IMPORT_ROOT;
  var cache = require.cache = {};

  var builtIn = {
    'process': _ROOT + '/lib/modules/process.js',
    'events': _ROOT + '/lib/modules/events.js',
    'env': _ROOT + '/lib/modules/env.js',
    'path': _ROOT + '/lib/modules/path.js',
    'tty': _ROOT + '/lib/modules/tty.js',
    'mocha-formatting': _ROOT + '/lib/modules/mocha-formatting.js'
  };

  var fsPath = require('path');

  function require(path) {
    if (path in builtIn) {
      return require(builtIn[path]);
    }

    if (path.substr(-3) !== '.js') {
      path += '.js';
    }

    if (path.substr(0, 1) !== '/') {
      path = fsPath.resolve(root, path);
    }

    if (path in cache) {
      return cache[path];
    }

    // module object
    var instance = {
      exports: {}
    };

    var scope = Object.create(window);
    scope.module = instance;
    scope.exports = instance.exports;

    try {
      mozIJSSubScriptLoader.loadSubScript(
        'file://' + path,
        scope
      );
    } catch (e) {
      throw new Error("Cannot load module at: '" + path + "'");
    }

    return cache[path] = scope.module.exports;
  }

  var module = {
    require: require
  };

  return module;
}());
