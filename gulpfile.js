var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var exit = require('gulp-exit');
var install = require('gulp-install');

gulp.task('install', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe(install());
});

gulp.task('lint', function() {
  return gulp.src(['*.js', 'api/*.js', 'config/*.js',
         'models/*.js', 'public/js/*.js', 'tests/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('mocha', function() {
  return gulp.src('tests/*.js', { read: false })
    .pipe(mocha())
    .pipe(exit());
});

gulp.task('test', ['lint', 'mocha']);

gulp.task('default', ['test']);

