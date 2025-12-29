/**
 * Gulp build for storypixel.github.io
 *  - BrowserSync dev server
 *  - SASS compilation
 *  - ES6 transpilation via Babel
 */
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var filter = require('gulp-filter');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

var bases = {
  app: './',
  dist: 'dist/',
};

var paths = {
  scripts: ['scripts/**/*.js', '!scripts/libs/**/*.js'],
  libs: [],
  styles: ['styles/**/*.css'],
  scss: ['scss/**/*.scss', 'scss/*.scss'],
  html: ['index.html', '404.html'],
  images: ['images/**/*.png', 'images/**/*.svg'],
  extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};

// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist, { read: false, allowEmpty: true }).pipe(clean());
});

// Copy files to dist
gulp.task('copy', function() {
  gulp.src(paths.images, { cwd: bases.app }).pipe(gulp.dest(bases.dist + 'images'));
  return gulp.src(paths.extras, { cwd: bases.app, allowEmpty: true }).pipe(gulp.dest(bases.dist));
});

// Browser-sync dev server
gulp.task('browser-sync', function() {
  browserSync({
    notify: true,
    server: {
      baseDir: bases.app,
      injectChanges: true,
    },
    port: 3000,
  });
});

gulp.task('html', function() {
  return gulp.src(paths.html).pipe(reload({ stream: true }));
});

// Compile SASS
gulp.task('styles', function() {
  return gulp
    .src('./scss/style.scss')
    .pipe(sass({ includePaths: ['scss'] }).on('error', sass.logError))
    .pipe(gulp.dest(bases.dist + 'styles'))
    .pipe(reload({ stream: true }));
});

// Transpile ES6 and concatenate
gulp.task('es6', function() {
  return gulp
    .src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(bases.dist + 'scripts'))
    .pipe(reload({ stream: true }));
});

// Default task with watch
gulp.task(
  'default',
  gulp.series(gulp.parallel('styles', 'browser-sync'), function watchFiles() {
    gulp.watch(paths.scss, gulp.series('styles'));
    gulp.watch(paths.html, gulp.series('html'));
    gulp.watch(paths.scripts, gulp.series('es6'));
  })
);

// Build task
gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'es6', 'copy')));
