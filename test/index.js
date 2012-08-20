importScripts('vendor/mocha.js');
importScripts('vendor/expect.js');

process.stdout.write = window.xpcDump;

mocha.setup({
  ui: 'bdd',
  reporter: mocha.reporters.Spec
});

var IS_TEST = /^test\//;
var files = window.xpcArgv.slice(2).forEach(function(file) {
  if (IS_TEST.test(file)) {
    file = file.replace(IS_TEST, '');
  }
  window.xpcModule.require(file);
});

window.xpcModule.require('mocha-formatting').enhance(mocha);

var end = mocha.run(function() {
  window.xpcEventLoop.stop();
});

window.xpcEventLoop.start();
