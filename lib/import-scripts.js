window.importScripts = importScripts;

function importScripts() {
  var root = _IMPORT_ROOT,
      files = Array.prototype.slice.call(arguments);

  files.forEach(function(file) {
    var loc = 'file://' + root + '/' + file;

    mozIJSSubScriptLoader.loadSubScript(loc, window);
  });
}
