const gulp  = require('gulp');
const clean = require("gulp-clean");

/**
 * [清空dist文件]
 */
gulp.task("clean:all", function() {
    return gulp.src('./dist', {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean:js', function() {
    return gulp.src('./dist/assets/js', {
            read: false
        })
        .pipe(clean());
});


gulp.task('clean:images', function() {
    return gulp.src('./dist/assets/images', {
            read: false
        })
        .pipe(clean());
});


gulp.task('clean:css', function() {
    return gulp.src('./dist/assets/css', {
            read: false
        })
        .pipe(clean());
});
