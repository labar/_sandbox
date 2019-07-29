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
// COMPILE SCSS
// -----------------------------------------------------------------------------

gulp.task('sass', function() {
  return gulp.src(inputSass)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // OutputStyle options: nested, compact, expanded, compressed
    .pipe(postcss([ autoprefixer({grid: true, browsers:["last 2 versions"]}) ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outputSass))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// -----------------------------------------------------------------------------
// MINIFY JS
// -----------------------------------------------------------------------------

gulp.task('compressJS', function() {
  return gulp.src(inputJS)
    // .pipe(uglify())
    .pipe(gulp.dest(outputJS));
});

// -----------------------------------------------------------------------------
// SPECIFIC USER TASKS
// -----------------------------------------------------------------------------

// LABAR: Browser Sync
gulp.task('browser-sync-labar', function() {
    browserSync.init({
      proxy: "sandbox.labar"
    });
});

// LABAR: Watch Everything
gulp.task('watch-labar', ['browser-sync-labar', 'sass', 'compressJS'], function (){
  gulp.watch(inputSass, ['sass']);
  gulp.watch(inputJS, ['compressJS'], browserSync.reload);
});
