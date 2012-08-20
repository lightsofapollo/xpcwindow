describe('xhr', function() {

  it('should be able to load file://', function() {
    var path = 'file://' + __dirname + '/fixtures/file.js';
    var xhr = new XMLHttpRequest();

    xhr.open('GET', path, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          done();
        } else {
          done(new Error('xhr failed'));
        }
      }
    }

    xhr.send();
  });

  it('should be able to load google.com', function(done) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://google.com', true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          done();
        } else {
          done(new Error('xhr failed'));
        }
      }
    }

    xhr.send();
  });

});
