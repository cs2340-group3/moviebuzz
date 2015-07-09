var lib = require('./lib');

describe('rateMovie functionality', function() {
  lib.setUp();
  this.timeout(5000);
  lib.loginBeforeEach();

  it('Should be able to search movies', function(done){
    this.agent
      .get('/search/gone girl')
      .expect(200, done);
  });

  it('Should be able to rate movie', function(done){
    this.agent
      .post('/movie/771360861/rate')
      .send({
        score: 5
        , review: 'absolutely amazingly astonishingly awesomely ' +
'alliterationly acessible across all audiences'
      })
      .expect(302)
      .expect('Location', '/movie/771360861', done);
  });

});
