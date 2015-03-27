var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('dist', function() {
  return gulp.src('maincolor.js')
    .pipe(uglify())
    .pipe(rename('maincolor.min.js'))
    .pipe(gulp.dest('./'));
});
