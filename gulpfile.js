// =============================================================================
//
//  GULPFILE v4
//
// =============================================================================

// Thanks Bobbie Goede!
// https://goede.site/setting-up-gulp-4-for-automatic-sass-compilation-and-css-injection

// -----------------------------------------------------------------------------
// PLUGINS
// -----------------------------------------------------------------------------

var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    postcss      = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano      = require('cssnano'),
    sourcemaps   = require('gulp-sourcemaps'),
    browserSync  = require('browser-sync').create();

// -----------------------------------------------------------------------------
// TARGETS
// -----------------------------------------------------------------------------

var sourceSass   = './assets/src/scss/**/*.scss',
    targetSass   = './assets/css';

// -----------------------------------------------------------------------------
// TASK: STYLE
// -----------------------------------------------------------------------------

function style() {
  return (
    gulp

      // Get the source files
      .src(sourceSass)

      // Initialize sourcemaps before compilation starts
      .pipe(sourcemaps.init())

      // Use sass with the files found, and log any errors
      .pipe(sass())
      .on('error', sass.logError)

      // Use postcss with autoprefixer and compress the compiled file using cssnano
      .pipe(postcss([autoprefixer(), cssnano()]))

      // add/write the sourcemaps
      .pipe(sourcemaps.write())

      // Destination for the compiled file
      .pipe(gulp.dest(targetSass))

      // Add browsersync stream pipe after compilation
      .pipe(browserSync.stream())
  );
}

// Expose the task by exporting it.
exports.style = style;

// -----------------------------------------------------------------------------
// TASK: WATCH
// -----------------------------------------------------------------------------

function watch(){

  // Add browsersync initialization at the start of the watch task
  browserSync.init({
    proxy: 'sandbox.labar'
  });
  gulp.watch(sourceSass, style);
}

// Don't forget to expose the task!
exports.watch = watch
