const Cc = Components.classes;
const Ci = Components.interfaces;

const mozIJSSubScriptLoader = Cc['@mozilla.org/moz/jssubscript-loader;1']
                            .getService(Components.interfaces.mozIJSSubScriptLoader);


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


//Register xpcwindow
// Map resource://xpcwindow/ to lib/
(function () {
  function do_get_file(path, allowNonexistent) {
    try {
      let lf = Components.classes["@mozilla.org/file/directory_service;1"]
        .getService(Components.interfaces.nsIProperties)
        .get("CurWorkD", Components.interfaces.nsILocalFile);

      let bits = path.split("/");
      for (let i = 0; i < bits.length; i++) {
        if (bits[i]) {
          if (bits[i] == "..")
            lf = lf.parent;
          else
            lf.append(bits[i]);
        }
      }

      if (!allowNonexistent && !lf.exists()) {
        // Not using do_throw(): caller will continue.
        _passed = false;
        var stack = Components.stack.caller;
        _dump("TEST-UNEXPECTED-FAIL | " + stack.filename + " | [" +
              stack.name + " : " + stack.lineNumber + "] " + lf.path +
              " does not exist\n");
      }

      return lf;
    }
    catch (ex) {
      do_throw(ex.toString(), Components.stack.caller);
    }

    return null;
  }

  let (ios = Components.classes['@mozilla.org/network/io-service;1']
             .getService(Components.interfaces.nsIIOService)) {
    let protocolHandler =
      ios.getProtocolHandler('resource')
         .QueryInterface(Components.interfaces.nsIResProtocolHandler);
    dump(do_get_file('').path + '\n');
    let curDirURI = ios.newFileURI(do_get_file(''));
    protocolHandler.setSubstitution('xpcwindow', curDirURI);
  }
}());

Components.utils.import('resource://xpcwindow/lib/components/tcp-socket.jsm');

importLib('window/timers.js');
importLib('window/import-scripts.js');
importLib('window/console.js');
importLib('window/window.js');
importLib('window/xpc-event-loop.js');

window.MozTCPSocket = MozTCPSocket;

mozIJSSubScriptLoader.loadSubScript(
  'file://' + _IMPORT_FILE,
  window
);
