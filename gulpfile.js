/**
* This example:
*  Uses the built-in BrowserSync server for HTML files
*  Watches & compiles SASS files
*  Watches & injects CSS files
*/
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var filter      = require('gulp-filter');

var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var clean = require('gulp-clean');

var bases = {
  app: './',
  dist: 'dist/',
};

// var paths = {
//  scripts: ['scripts/**/*.js', '!scripts/libs/**/*.js'],
//  libs: ['scripts/libs/jquery/dist/jquery.js', 'scripts/libs/underscore/underscore.js', 'scripts/backbone/backbone.js'],
//  styles: ['styles/**/*.css'],
//  html: ['index.html', '404.html', '*.html'],
//  images: ['images/**/*.png'],
//  extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
// };

var paths = {
  scripts: ['scripts/**/*.js', /*'node_modules/scrollsnap-polyfill/dist/scrollsnap-polyfill.bundled.js',*/ '!scripts/libs/**/*.js'],
  libs: [/*'node_modules/scrollsnap-polyfill/dist/scrollsnap-polyfill.js'*/],
  styles: ['styles/**/*.css'],
  scss: ['scss/**/*.scss', 'scss/*.scss'],
  html: ['index.html', '404.html'],
  images: ['images/**/*.png', 'images/**/*.svg'],
  extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};

// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist)
  .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
  gulp.src(paths.scripts, {cwd: bases.app})
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(uglify())
  .pipe(concat('app.min.js'))
  .pipe(gulp.dest(bases.dist + 'scripts'));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
  gulp.src(paths.images, {cwd: bases.app})
  .pipe(imagemin())
  .pipe(gulp.dest(bases.dist + 'images/'));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
  // Copy html
  // gulp.src(paths.html, {cwd: bases.app})
  // .pipe(gulp.dest(bases.dist));

  // Copy styles
  // gulp.src(paths.styles, {cwd: bases.app})
  // .pipe(gulp.dest(bases.dist + 'styles'));

  // Copy lib scripts, maintaining the original directory structure
  // gulp.src(paths.libs, {cwd: 'app/**'})
  // .pipe(gulp.dest(bases.dist));

  gulp.src(paths.images, {cwd: bases.app})
  .pipe(gulp.dest(bases.dist + 'images'));
  // Copy extra html5bp files
  gulp.src(paths.extras, {cwd: bases.app})
  .pipe(gulp.dest(bases.dist));
});

// A development task to run anytime a file changes
gulp.task('watch', function() {
  gulp.watch('app/**/*', ['scripts', 'copy']);
});

// Define the default task as a sequence of the above tasks
// gulp.task('default', ['clean', 'scripts', 'imagemin', 'copy']);

// Browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', function() {
  browserSync({
    notify: true,
    //proxy: "http://localhost:3000",
    server: {
      baseDir: bases.app,
      injectChanges: true // this is new
    },
    port: 3000

    // ui: {
    //   port: 6969
    // },
    // port: 6968
  });
});

gulp.task('html', function() {
  return gulp.src(paths.html)
  .pipe(reload({stream:true})); // inject into browsers
});


// Sass task, will run when any SCSS files change.
gulp.task('styles', function () {
  return gulp.src('./scss/style.scss')
  .pipe(sass({includePaths: ['scss']})) // compile sass
  .pipe(gulp.dest(bases.dist + 'styles')) // write to css dir
  .pipe(reload({stream:true})); // inject into browsers
});

gulp.task('es6', function() {
  return gulp.src(paths.scripts)
  .pipe(sourcemaps.init())
  .pipe(babel({
			presets: ['@babel/env']
		}))

  .pipe(concat('all.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(bases.dist + 'scripts'))
  .pipe(reload({stream:true}));
});

const image = require('gulp-image');

gulp.task('image', function () {
  gulp.src(paths.images)
  .pipe(image())
  .pipe(gulp.dest(bases.dist + 'images'))
  .pipe(reload({stream:true})); // inject into browsers
});


// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist)
  .pipe(clean());
});

// Default task to be run with `gulp`
gulp.task('default', ['styles', 'browser-sync'], function () {
  gulp.watch(paths.scss, ['styles']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.scripts, ['es6']);
  gulp.watch(paths.images, ['image']);
});
