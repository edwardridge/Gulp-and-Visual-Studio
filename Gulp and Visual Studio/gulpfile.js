var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('sass', function () {
    gulp.src('./Content/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('./Content'))
        .pipe(plugins.livereload())
    ;
});

gulp.task('watch-sass', function () {
    plugins.livereload.listen();
    gulp.watch('./Content/*.scss', ['sass']);
});

gulp.task('default', ['watch-sass']);