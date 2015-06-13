var gulp = require('gulp');
var rename = require('gulp-rename')
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var fs = require("fs");
gulp.task('js', function () {
	var pkg = require('./package.json');
    gulp.src('./Atlas.js')
    .pipe(uglify())
    .pipe(header(fs.readFileSync('header.txt', 'utf8'), { pkg : pkg }))
    .pipe(gulp.dest('../atlas-editor/public/js/'))
    .pipe(rename('Atlas.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch('./Atlas.js', ['js']);
});


gulp.task('default', ['js']);