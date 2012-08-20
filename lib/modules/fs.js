var fsPath = window.xpcModule.require('path');

exports.readFileSync = function readFileSync(name) {
  var xhr = new XMLHttpRequest();
  var path = fsPath.resolve(name);

  xhr = new XMLHttpRequest();
  xhr.open('GET', 'file://' + path, false);

  xhr.send(null);
  return xhr.responseText;
};

exports.writeFileSync = function(name, content) {
  var file = fileInstance(name);
  return writeContents(file, content);
};

function writeContents(file, content) {
  var stream = Components.classes['@mozilla.org/network/file-output-stream;1']
                   .createInstance(Components.interfaces.nsIFileOutputStream);

  stream.init(file, 0x02 | 0x08 | 0x20, 0655, 0);
  stream.write(content, content.length);
  stream.close();
}

// Return an nsIFile by joining paths given as arguments
// First path has to be an absolute one
function fileInstance(path) {
  var path = fsPath.resolve(path);

  let file = Components.classes['@mozilla.org/file/local;1'].
    createInstance(Components.interfaces.nsILocalFile);

  file.initWithPath(path);
  return file;
}
