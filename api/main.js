var rotten = require('../config/rotten');

module.exports = {
  /**
   * Render the app's welcome page.
   */
  renderWelcomePage: function(req, res, next) {
    return rotten.listDvdsNewReleases({ page_limit: 20 }, function(err, val) {
      if (err) {
        return next(err);
      }
      return res.render('welcome', {
        user: req.user
        , movies: val.movies
        , csrfToken: req.csrfToken()
      });
    });
  }
};

