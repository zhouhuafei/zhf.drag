const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserify = require('gulp-browserify');

gulp.task('watch', function () {
    gulp.watch(['src/**/*.**'], ['es5', 'jsmin', 'demo']);
    gulp.watch(['demo/index.js'], ['demo']);
});

gulp.task('es5', function () {
    gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('dist'));
});

gulp.task('jsmin', function () {
    gulp.src('src/**/*.js').pipe(babel()).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('dist'));
});

gulp.task('demo', function () {
    gulp.src('demo/index.js')
        .pipe(browserify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('demo'));
});

gulp.task('default', ['es5', 'jsmin', 'demo', 'watch']);
