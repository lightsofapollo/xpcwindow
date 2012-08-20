var fsPath = window.xpcModule.require('path');

exports.readFileSync = function readFileSync(name) {
  var xhr = new XMLHttpRequest();
  var path = fsPath.resolve(name);

  xhr = new XMLHttpRequest();
  xhr.open('GET', 'file://' + path, false);

  xhr.send(null);
  return xhr.responseText;
};

exports.writeFileSync = function writeFileSync() {

};
