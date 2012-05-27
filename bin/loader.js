const Cc = Components.classes;
const Ci = Components.interfaces;

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
const mozIJSSubScriptLoader = Cc["@mozilla.org/moz/jssubscript-loader;1"]
                            .getService(Components.interfaces.mozIJSSubScriptLoader);


this.window = {};
this.window.window = this.window;

function importLib(file) {
  mozIJSSubScriptLoader.loadSubScript(
    'file://' + _ROOT + '/lib/' + file
  );
}

importLib('timers.js');
importLib('import-scripts.js');
importLib('console.js');
importLib('window.js');
importLib('event-loop.js');

mozIJSSubScriptLoader.loadSubScript(
  'file://' + _IMPORT_FILE,
  window
);
