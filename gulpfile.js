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

// Browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', function() {
  browserSync({
    notify: true,
    //proxy: "http://localhost:3000",
    server: {
      baseDir: "./",
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
  return gulp.src('./*.html')
  .pipe(reload({stream:true})); // inject into browsers
});


// Sass task, will run when any SCSS files change.
gulp.task('styles', function () {
  return gulp.src('./scss/style.scss')
  .pipe(sass({includePaths: ['scss']})) // compile sass
  .pipe(gulp.dest('./stylesheets')) // write to css dir
  .pipe(reload({stream:true})); // inject into browsers
});

const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

gulp.task('es6', () =>
    gulp.src('es6/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
);

// Default task to be run with `gulp`
gulp.task('default', ['styles', 'browser-sync'], function () {
  gulp.watch("./scss/*/*.scss", ['styles']);
  gulp.watch("./*.html", ['html']);
  gulp.watch("./es6/**/*.js", ['es6']);
});
