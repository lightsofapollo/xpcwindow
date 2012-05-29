//prevent the global spams
window.RandomFile = false;

describe('window.importScripts', function() {

  beforeEach(function() {
    window.RandomFile = false;
  });

  it('should allow loading up a directory', function() {
    importScripts('../lib/random-file.js');
    expect(window.RandomFile).to.be(true);
  });

});
