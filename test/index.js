importScripts('vendor/mocha.js');
importScripts('vendor/expect.js');

process.stdout.write = window.xpcDump;

mocha.setup({
  ui: 'bdd',
  reporter: mocha.reporters.Spec
});

importScripts.apply(this, window.xpcArgv);

var end = mocha.run(function() {
  window.xpcEventLoop.stop();
});

window.xpcEventLoop.start();

