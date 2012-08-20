importScripts('vendor/mocha.js');
importScripts('vendor/expect.js');

process.stdout.write = window.xpcDump;

mocha.setup({
  ui: 'bdd',
  reporter: mocha.reporters.Spec
});

var IS_TEST = /^test\//;
var files = window.xpcArgv.map(function(file) {
  if (IS_TEST.test(file)) {
    return file.replace(IS_TEST, '');
  }
  return file;
});

importScripts.apply(this, files);

window.xpcModule.require('mocha-formatting').enhance(mocha);

var end = mocha.run(function() {
  window.xpcEventLoop.stop();
});

window.xpcEventLoop.start();

