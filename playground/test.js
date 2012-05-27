describe("something", function() {

  it('should work', function() {

  });

  it('#2', function(done) {
    try {
      throw new Error('!SHIT!');
    } catch(e) {
    }
  });

});
