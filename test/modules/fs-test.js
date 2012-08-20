describe('modules/fs', function() {
  var fs = window.xpcModule.require('fs');

  describe('read', function() {
    var fileName = __dirname + '/../fixtures/file.js';
    var expected = 'local file';

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
