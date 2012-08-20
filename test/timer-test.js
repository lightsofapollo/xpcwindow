describe('timers', function() {

  describe('methods', function() {
    var methods = [
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval'
    ];

    methods.forEach(function(method) {
      it('window.' + method + ' should exist', function() {
        expect(window[method]).to.be.ok();
      });
    });
  });

  describe('window.setTimeout', function() {
    it('should behave as normal', function(done) {
      var start = Date.now();
      setTimeout(function() {
        var diff = Date.now() - start;
        expect(diff).to.be.above(40);
        done();
      }, 50);
    });
  });

  describe('window.clearTimeout', function() {
    it('should clear a timeout', function(done) {
      setTimeout(function() {
        done();
      }, 50);

      var id = setTimeout(function(){
        done(new Error('Timeout was not cleared'));
      }, 150);

      clearTimeout(id);
    });
  });

});
