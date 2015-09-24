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

gulp.task('minifyFilesForRelease', function () {

    var cssFilter = plugins.filter('**/*.css', { restore: true });
    var jsFilter = plugins.filter('**/*.js', { restore: true });

    var assets = plugins.useref.assets();
    gulp.src('./**/*.cshtml')
        .pipe(assets)

        //Process JavaScript
        .pipe(jsFilter)
        .pipe(plugins.uglify())
        .pipe(plugins.rev())
        .pipe(assets.restore())
        .pipe(jsFilter.restore)
        
        //Process CSS
        .pipe(cssFilter)
        .pipe(plugins.minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(plugins.rev())
        .pipe(assets.restore())
        .pipe(cssFilter.restore)

        .pipe(plugins.useref())
        .pipe(plugins.revReplace({
            replaceInExtensions: ['.js', '.css', '.html', '.cshtml']
        }))
        .pipe(gulp.dest(function (data) {
            return data.base;
        }
        ));
});

gulp.task('watch-sass', function () {
    plugins.livereload.listen();
    gulp.watch('./Content/*.scss', ['sass']);
});

gulp.task('default', ['watch-sass']);