describe('tcp socket', function() {

  var klass = MozTCPSocket,
              subject;

  afterEach(function(done) {
    subject.on('close', function() {
      done();
    });
    subject.close();
  });

  describe('initialize', function() {

    it('should work under xpcom', function(done) {
      subject = new MozTCPSocket('localhost', 80, {
        verifyCert: false
      });

      subject.on('open', function() {
        done();
      });
    });
  });

});
