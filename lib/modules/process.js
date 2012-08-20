module.exports = {
  argv: window.xpcArgv,
  cwd: function() {
    return _IMPORT_ROOT;
  },
  exit: quit,
  stdout: {
    write: dump
  }
};
