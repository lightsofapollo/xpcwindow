describe('tcp socket', function() {

  var subject;

  describe('initialize', function() {

    it('should work under xpcom', function(done) {
      this.timeout(5000);

      subject = window.TCPSocket.open('localhost', 80, {
        verifyCert: false
      });

      subject.onopen = function() {
        done();
      };
    });

    afterEach(function(done) {
      if (!subject)
        return done();

      subject.onclose = function() {
        done();
      };

      subject.close();
    });

  });

});
