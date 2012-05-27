importScripts('mocha.js', 'test-agent.js');

mocha.setup({
  ui: 'bdd',
  reporter: mocha.reporters.XUnit
});

importScripts('test.js');

var end = mocha.run(function() {
  window.xpcEventLoop.stop();
});

window.xpcEventLoop.start();
