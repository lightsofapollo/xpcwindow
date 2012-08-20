describe('window.xpcModule', function() {
  var require = window.xpcModule.require;
  var subject;

  describe('built in: process', function() {
    return;
    var process;

    beforeEach(function() {
      process = require('process');
    });

    it('should have exit', function() {
      assert.equal(process.exit, quit);
    });

    it('should have stdout.write', function() {
      assert.equal(process.stdout.write, dump);
    });
  });

  describe('built in: events', function() {
    var EventEmitter;

    beforeEach(function() {
      EventEmitter = require('events').EventEmitter;
    });

    it('should emit events', function(done) {
      var obj = {};
      var event = new EventEmitter();
      event.on('test', function(arg) {
        expect(arg).to.be(obj);
        done();
      });

      event.emit('test', obj);
    });

  });

  describe('built in: env', function() {
    var env;

    beforeEach(function() {
      env = require('env');
    });

    it('should get environment variables', function() {
      expect(env.get).to.be.ok();
    });
  });

  describe('built in: mocha-formatting', function() {
    var mocha;

    beforeEach(function() {
      mocha = require('mocha-formatting');
    });

    it('should load mocha', function() {
      expect(mocha).to.be.ok();
      expect(mocha.enhance).to.be.ok();
    });
  });

  describe('built in: path', function() {
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
    var fsPath = require('path');


    describe('.json', function() {
      beforeEach(function() {
        subject = require('./fixtures/file.json');
      });

      it('should load & parse json file', function() {
        expect(subject).to.eql({
          json: true
        });
      });

    });

    describe('.js', function() {
      beforeEach(function() {
        subject = require('./fixtures/test-mod.js');
      });

      it('should define __dirname', function() {
        var root = fsPath.resolve('./fixtures/');
        expect(subject.__dirname).to.be(root);
        expect(subject.__filename).to.contain('fixtures/test-mod.js');
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

});
