describe('window.xpcModule', function() {
  var require = window.xpcModule.require;
  var subject;

  describe('built ins', function() {
    var path;
    beforeEach(function() {
      path = require('path');
    });

    it('should load path', function() {
      expect(path).to.be.ok();
      expect(path.join).to.be.ok();
    });

    it('should export #join', function() {
      var a = 'some/foo//';
      var b = '//another//';
      var result = path.join(a, b);

      expect(result).to.be('some/foo/another/');
    });

    it('should export #resolve', function() {
      var output = path.resolve('/foo/bar', '../baz');
      expect(output).to.be('/foo/baz');
    });
  });

  describe('#require', function() {

    beforeEach(function() {
      subject = require('./fixtures/test-mod.js');
    });

    it('should not polute global scope', function() {
      expect(window.globalContextDirty).not.to.be.ok();
    });

    it('should load module', function() {
      expect(subject).to.be.ok();
    });

    it('should be the same object when required twice', function() {
      expect(subject).to.be(require('./fixtures/test-mod.js'));
    });

  });

});
