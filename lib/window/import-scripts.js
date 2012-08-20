window.importScripts = importScripts;

function importScripts() {
  var root = _IMPORT_ROOT,
      files = Array.prototype.slice.call(arguments);

  files.forEach(function(file) {
    if (typeof(file) !== 'string') {
      return;
    }
    var loc = 'file://' + root + '/' + file;

    try {
      mozIJSSubScriptLoader.loadSubScript(loc, window);
    } catch(e) {
      throw new Error('importScript failed while trying to load: "' + loc + '"');
    }
  });
}
