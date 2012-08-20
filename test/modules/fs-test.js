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

});
