// -----------------------------------------------------------------------------
// PLUGINS
// -----------------------------------------------------------------------------

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var uglify       = require('gulp-uglify');
var browserSync  = require('browser-sync').create();
var sourcemaps   = require('gulp-sourcemaps');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// -----------------------------------------------------------------------------
// TARGETS
// -----------------------------------------------------------------------------

// SOURCE - SCSS
var inputSass   = './assets/src/scss/**/*.scss';
// TARGET - CSS
var outputSass  = './assets/css';
// SOURCE - JS
var inputJS     = './assets/src/js/**/*.js';
// TARGET - JS
var outputJS    = './assets/js';

// -----------------------------------------------------------------------------
// TASKS
// -----------------------------------------------------------------------------

// COMPILE SCSS
// -----------------------------------------------------------------------------

gulp.task('sass', function() {
  return gulp.src(inputSass)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // OutputStyle options: nested, compact, expanded, compressed
    .pipe(postcss([ autoprefixer({grid: true, browserlist:["last 2 versions"]}) ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outputSass))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// COMPRESS JS
// -----------------------------------------------------------------------------

gulp.task('compressJS', function() {
  return gulp.src(inputJS)
    // .pipe(uglify())
    .pipe(gulp.dest(outputJS));
});

// BROWSERSYSC
// -----------------------------------------------------------------------------

// LABAR: Browser Sync
gulp.task('browser-sync-labar', function() {
    browserSync.init({
      proxy: "sandbox.labar"
    });
});

// -----------------------------------------------------------------------------
// WATCH EVERYTHING
// -----------------------------------------------------------------------------

// LABAR: Watch Everything
gulp.task('default', gulp.series(['sass', 'compressJS', 'browser-sync-labar']));
