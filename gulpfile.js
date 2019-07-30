// -----------------------------------------------------------------------------
// PLUGINS
// -----------------------------------------------------------------------------

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var uglify       = require('gulp-uglify');
var pipeline     = require('readable-stream').pipeline;
var browserSync  = require('browser-sync').create();
var sourcemaps   = require('gulp-sourcemaps');

// -----------------------------------------------------------------------------
// TARGETS
// -----------------------------------------------------------------------------

// CSS Source
var inputSass   = './assets/src/scss/**/*.scss';
// CSS Destination
var outputSass  = './assets/css';
// JS Source
var inputJS     = './assets/src/js/**/*.js';
// JS Target
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
  return pipeline(
    gulp.src(inputJS),
    uglify(),
    gulp.dest(outputJS)
  );
  browserSync.reload();
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
gulp.watch('default', gulp.series(['sass', 'compressJS', 'browser-sync-labar']));
