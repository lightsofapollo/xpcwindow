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
    'fs': _ROOT + '/lib/modules/fs.js',
    'process': _ROOT + '/lib/modules/process.js',
    'events': _ROOT + '/lib/modules/events.js',
    'env': _ROOT + '/lib/modules/env.js',
    'path': _ROOT + '/lib/modules/path.js',
    'tty': _ROOT + '/lib/modules/tty.js',
    'mocha-formatting': _ROOT + '/lib/modules/mocha-formatting.js'
  };

  function lazyDefine(obj, prop, fn) {
    Object.defineProperty(obj, prop, {
      configurable: true,
      get: function() {
        delete obj[prop];
        return obj[prop] = fn();
      }
    });
  }

  require.handlers = {
    js: function requireJS(path) {

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

      lazyDefine(scope, 'process', function() {
        return require('process');
      });

      // Work around race condition we can't use
      // fsPath while loading it :)
      if (fsPath) {
        scope.__dirname = fsPath.resolve(path, '../');
        scope.__filename = path;
      }

      try {
        mozIJSSubScriptLoader.loadSubScript(
          'file://' + path,
          scope
        );
      } catch (e) {
        throw new Error(
          "Cannot load module at: '" + path + "'\n\n: " +
          e.toString()
        );
      }

      return cache[path] = instance.exports;
    },

    json: function requireJSON(path) {
      var path = fsPath.resolve(path);
      var contents = require('fs').readFileSync(path);
      return JSON.parse(contents);
    }
  };

  var fsPath = require('path');

  function require(path) {

    if (path in builtIn) {
      return require(builtIn[path]);
    }

    var ext;
    if (fsPath) {
      ext = fsPath.extname(path).slice(1);
    } else {
      ext = 'js';
    }

    if (!ext) {
      path += '.js';
      ext = 'js';
    }

    return require.handlers[ext](path);
  }

  var module = {
    require: require
  };

  return module;
}());
