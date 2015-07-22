var github = new (require('github'))({
  version: '3.0.0',
  debug: true
});

if (process.env.GITHUB_AUTH_TOKEN) {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_AUTH_TOKEN
  });
}

module.exports = {
  /**
   * Submit a new issue to the Github project.
   */
  submitBug: function(req, res, next) {
    var title = req.body.title;
    var body = req.body.body + '\n\n' +
      '(Reported by "Report Bug" feature in webapp.)';
    github.issues.create({
      user: 'cs2340-group3',
      repo: 'moviebuzz',
      title: title,
      body: body,
      labels: ['bug']
    }, function(err) {
      if (err) {
        next(err);
      }
      next();
    });
  }
};

