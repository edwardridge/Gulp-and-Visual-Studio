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

var sources = ['./Scripts/*.js', '!./Scripts/libs/*.js'];

gulp.task('watch-lint', function () {
    gulp.watch(sources, ['lint']);
});

gulp.task('lint', function () {
    return gulp.src(sources)
        .pipe(plugins.jshint({
            strict: true,
            predef: [""]
        }))
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.jshint.reporter('fail'))
    ;
});

var Server = require('karma').Server;

gulp.task('runTests', function () {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }).start();
});

gulp.task('default', ['watch-sass']);