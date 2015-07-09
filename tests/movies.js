var lib = require('./lib');

describe('api/movies.js', function() {
  lib.setUp();
  this.timeout(5000);
  lib.loginBeforeEach();

  describe('rate movies', function() {
    it('Should be able to search movies', function(done){
      this.agent
        .get('/search/gone girl')
        .expect(/Gone Girl/g) // See the name of the movie
        .expect(/moviePoster/g) // Show the poster
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
        .expect(302) // -> Redirect to the origin page.
        .expect('Location', '/movie/771360861', done);
    });
  });

  // Test other functionalities of movies.js ....

});

