describe('window.xpcError', function() {

  var sample, subject = window.xpcError;

  before(function() {
    try {
      function failMe() {
        throw new Error('!message!');
      }
      failMe();
    } catch (e) {
      sample = e;
    }
  });

  describe('.format', function() {
    it('should format error', function() {
      var result = subject.format(sample);

      expect(result).to.contain(
        'Error: !message!'
      );

      expect(result).to.contain(
        '    at failMe (/lib/loader.js -> ' +
        '/lib/window/xpc-module.js -> /test/xpc-error-test.js:8)'
      );

      expect(result).to.contain(
        '    at anon (/lib/loader.js -> /lib/window/xpc-module.js' +
        ' -> /test/xpc-error-test.js:10)'
      );
    });
  });

});
