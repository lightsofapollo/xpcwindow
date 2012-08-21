describe('mkdir p', function() {
  var fs = require('fs');
  var mkdirp = require('mkdirp');


  it('should create missing leafs', function() {
    var path = __dirname + '/../my/path';
    mkdirp.sync(path);
    expect(fs.existsSync(path)).to.be(true);
    fs.rmdirSync(__dirname + '/../my/');
    expect(fs.existsSync(path)).to.be(false);
  });

  it('should not create new dirs on existing ones', function() {
    mkdirp.sync(__dirname);
  });

});
