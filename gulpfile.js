var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass        = require('gulp-sass');

var config = {
  entryFile: './src/javascript/index.js',
  outputDir: './build/',
  outputFile: 'build.js'
};

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.outputDir + "javascript", cb);
});

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
};

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.outputFile ))
    .pipe(gulp.dest(config.outputDir + "javascript"))
    .pipe(reload({ stream: true }));
}

gulp.task('build-persistent', ['clean'], function() {
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
    server: {
      baseDir: './'
    }
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent')
  });
});

// html stuff
gulp.task('html', function() {
  return gulp.src('./*.html')
  .pipe(reload({stream:true})); // inject into browsers
});

// Sass task, will run when any SCSS files change.
gulp.task('styles', function () {
  return gulp.src('./src/scss/style.scss')
  .pipe(sass({includePaths: ['scss']})) // compile sass
  .pipe(gulp.dest(config.outputDir + "stylesheets")) // write to css dir
  .pipe(reload({stream:true})); // inject into browsers
});

/*
.eot
.otf
.svg
.ttf
.woff2
.woff
 * */
gulp.task('copyfiles', function() {
    gulp.src('./src/**/*.{ttf,woff,woff2,eof,svg,jpg,jpeg,png,gif}')
    .pipe(gulp.dest('./build'));
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('default', ['styles', 'watch'], function () {
  gulp.watch("./src/**/*.{ttf,woff,woff2,eof,svg,jpg,jpeg,png,gif}", ['copyfiles']);
  gulp.watch("./src/scss/**/*.scss", ['styles']);
  gulp.watch("./*.html", ['html']);
});


// #<{(|*
//  * This example:
//  *  Uses the built-in BrowserSync server for HTML files
//  *  Watches & compiles SASS files
//  *  Watches & injects CSS files
//  |)}>#
// var browserSync = require('browser-sync');
// var reload      = browserSync.reload;
// var gulp        = require('gulp');
// var sass        = require('gulp-sass');
// var filter      = require('gulp-filter');
// var sourcemaps = require('gulp-sourcemaps');
// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var browserify = require('browserify');
// var watchify = require('watchify');
// var babel = require('babelify');
//
// function compile(watch) {
//   var bundler = watchify(browserify('./src/javascript/index.js', { debug: true }).transform(babel));
//
//   function rebundle() {
//     bundler.bundle()
//       .on('error', function(err) { console.error(err); this.emit('end'); })
//       .pipe(source('build.js'))
//       .pipe(buffer())
//       .pipe(sourcemaps.init({ loadMaps: true }))
//       .pipe(sourcemaps.write('./'))
//       .pipe(gulp.dest('./build/javascript'));
//   }
//
//   if (watch) {
//     bundler.on('update', function() {
//       console.log('-> bundling...');
//       rebundle();
//     });
//   }
//
//   rebundle();
// }
//
// function watch() {
//   return compile(true);
// };
//
// // Browser-sync task, only cares about compiled CSS
// gulp.task('browser-sync', function() {
//   browserSync({
//     notify: true,
//     //proxy: "http://localhost:3000",
//     server: {
//       baseDir: "./",
//       injectChanges: true // this is new
//     },
//     port: 3000
//
//     // ui: {
//     //   port: 6969
//     // },
//     // port: 6968
//   });
// });
//
// gulp.task('html', function() {
//   return gulp.src('.#<{(|.html')
//   .pipe(reload({stream:true})); // inject into browsers
// });
//
// // Sass task, will run when any SCSS files change.
// gulp.task('styles', function () {
//   return gulp.src('./scss/style.scss')
//   .pipe(sass({includePaths: ['scss']})) // compile sass
//   .pipe(gulp.dest('./stylesheets')) // write to css dir
//   .pipe(reload({stream:true})); // inject into browsers
// });
//
// gulp.task('build', function() { return compile(); });
// gulp.task('watch', function() { return watch(); });
//
// // Default task to be run with `gulp`
// gulp.task('default', ['styles', 'browser-sync', 'watch'], function () {
//   gulp.watch("./scss#<{(||)}>#*.scss", ['styles']);
//   gulp.watch(".#<{(|.html", ['html']);
// });
