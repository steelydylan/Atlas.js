var gulp = require('gulp');
var rename = require('gulp-rename')
var uglify = require('gulp-uglify');

gulp.task('js', function () {
    console.log("hello");
    gulp.src('./Atlas.js')
    .pipe(uglify())
    .pipe(rename('Atlas.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch('./Atlas.js', ['js']);
});


gulp.task('default', function() {
  console.log("Hello World!");
});