var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('dist', function() {
  return gulp.src('src/maincolor.js')
    .pipe(gulp.dest('./dist'))
    .pipe(uglify({
      preserveComments: 'some'      
    }))
    .pipe(rename('maincolor.min.js'))
    .pipe(gulp.dest('./dist'));
});
