'use strict'

const status = require('http-status');

module.exports = function (app, options) {
  const repo = options['repo'];

  app.get('/movies', function (req, res, next) {
      repo.getAllMovies().then(function (movies) {
          res.status(status.OK).json(movies);
      })
  });

  app.get('/movies/premieres', function (req, res, next) {
      repo.getMoviePremiers().then(function (movies) {
        res.status(status.OK).json(movies);
      }).catch(next)
  });

  app.get('movies/:id', function (req, res, next) {
    repo.getMovieById(req.params.id).then(function (movie) {
        res.status(status.OK).json(movie)
    }).catch(next)
  })
};
