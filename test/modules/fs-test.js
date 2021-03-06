describe('modules/fs', function() {
  var fs = window.xpcModule.require('fs');

  describe('dir', function() {
    var fileName = __dirname + '/../fixtures/test-dir/';

    function cleanup() {
      if (fs.existsSync(fileName))
        fs.rmdirSync(fileName);
    }

    beforeEach(cleanup);
    afterEach(cleanup);

    it('should have operations to create & remove dirs', function() {
      expect(fs.existsSync(fileName)).to.be(false);
      fs.mkdirSync(fileName, 0655);
      expect(fs.existsSync(fileName)).to.be(true);

      var stat = fs.statSync(fileName);
      expect(stat.isDirectory()).to.be(true);
      expect(stat.isFile()).to.be(false);


      fs.rmdirSync(fileName);
      expect(fs.existsSync(fileName)).to.be(false);
    });

  });

  describe('exists', function() {
    var fileName = __dirname + '/../fixtures/file.js';

    describe('#existsSync', function() {
      it('should return true when exists', function() {
        expect(fs.existsSync(fileName)).to.be(true);
      });

      it('should return false when does not exist', function() {
        expect(fs.existsSync('/foo/baz/bar')).to.be(false);
      });
    });

  });

  describe('remove', function() {
    var fileName = __dirname + '/../fixtures/deleted.js';

    describe('#unlinkSync', function() {
      it('should remove a file', function() {
        fs.writeFileSync(fileName, 'foo');
        fs.unlinkSync(fileName);
        expect(function() {
          fs.readFileSync(fileName);
        }).to.throwError();
      });
    });
  });

  describe('read', function() {
    var fileName = __dirname + '/../fixtures/file.js';
    var expected = 'local file';

    describe('statSync', function() {
      it('should have stat functions', function() {
        var stat = fs.statSync(fileName);
        expect(stat.isDirectory()).to.be(false);
        expect(stat.isFile()).to.be(true);
      });
    });

    describe('readFileSync', function() {
      it('should be able to read files', function() {
        var result = fs.readFileSync(fileName);
        expect(result).to.contain('local file');
      });
    });

  });

  describe('write', function() {
    var file = __dirname + '/../fixtures/write-me.js';

    describe('writeFileSync', function() {
      it('should be able to write to files', function() {
        //var start = result = fs.readFileSync(file);
        var write = Date.now().toString();
        fs.writeFileSync(file, write);
        expect(fs.readFileSync(file), write);
      });

      afterEach(function() {
        fs.writeFileSync(file, '');
      });

    });

  });

});
