describe('xhr', function() {

  it('should work', function(done) {
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
