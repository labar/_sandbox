// -----------------------------------------------------------------------------
// PLUGINS
// -----------------------------------------------------------------------------

var gulp         = require('gulp');
var sass         = require('gulp-sass');

// -----------------------------------------------------------------------------
// TARGETS
// -----------------------------------------------------------------------------

var sourceSass   = './assets/src/scss/**/*.scss';
var targetSass   = './assets/css';

// -----------------------------------------------------------------------------
// TASK: STYLE
// -----------------------------------------------------------------------------

function style() {
  return (
    gulp
      // get the source files
      .src(sourceSass)

      // Use sass with the files found, and log any errors
      .pipe(sass())
      .on("error", sass.logError)

      // What is the destination for the compiled file?
      .pipe(gulp.dest(targetSass))
  );
}

// Expose the task by exporting it.
exports.style = style;

// -----------------------------------------------------------------------------
// TASK: WATCH
// -----------------------------------------------------------------------------

function watch(){
  // gulp.watch takes in the location of the files to watch for changes
  // and the name of the function we want to run on change
  gulp.watch(sourceSass, style)
}

// Don't forget to expose the task!
exports.watch = watch
