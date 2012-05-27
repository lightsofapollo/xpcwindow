const Cc = Components.classes;
const Ci = Components.interfaces;

const mozIJSSubScriptLoader = Cc["@mozilla.org/moz/jssubscript-loader;1"]
                            .getService(Components.interfaces.mozIJSSubScriptLoader);


var err = Cc['@mozilla.org/exceptionservice;1']
                 .getService(Components.interfaces.nsIExceptionManager)

var args = _ARGV.split(' ');


if (args[0] === '') {
  args.shift();
}

this.window = {
  xpcDump: dump,
  xpcComponents: Components
};
this.window.window = this.window;

this.window.xpcArgv = args;

function importLib(file) {
  mozIJSSubScriptLoader.loadSubScript(
    'file://' + _ROOT + '/lib/' + file
  );
}

importLib('window/timers.js');
importLib('window/import-scripts.js');
importLib('window/console.js');
importLib('window/window.js');
importLib('window/xpc-event-loop.js');

window.err = err;

mozIJSSubScriptLoader.loadSubScript(
  'file://' + _IMPORT_FILE,
  window
);
