importScripts('mocha.js', 'test-agent.js');

mocha.setup({
  ui: 'bdd',
  reporter: mocha.reporters.XUnit
});

importScripts('test.js');

var end = mocha.run(function() {
  window.eventLoop.stop();
});

window.eventLoop.start();
