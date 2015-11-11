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
gulp.task('sass', function () {
    return gulp.src('./stylesheets/style.scss')
        .pipe(sass({includePaths: ['scss']})) // compile sass
        .pipe(gulp.dest('./stylesheets')) // write to css dir
        .pipe(reload({stream:true})); // inject into browsers
});

// Default task to be run with `gulp`
gulp.task('default', ['sass', 'browser-sync'], function () {
    gulp.watch("./stylesheets/*.scss", ['sass']);
    gulp.watch("./*.html", ['html']);
});
