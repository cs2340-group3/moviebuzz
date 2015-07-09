/*
 * csrf.js
 * Set up cross-site request forgery (CSRF) protection.
 */

var csrf = require('csurf');

module.exports = function(app) {
  if (process.env.NODE_ENV !== 'test') {
    app.use(csrf());

    // CSURF error handler
    app.use(function(err, req, res, next) {
      if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
      }
      res.status(403).render('error', {
        message: 'Form tampered with'
      });
    });
  } else {
    app.use(function(req, res, next) {
      req.csrfToken = function() {};
      next();
    });
  }
};

