/**
 * 将文件复制到打包目录中
 */

const gulp             = require('gulp');
const path             = require('path');
const merge            = require('merge-stream');
const jsonPath         = path.join(process.cwd(), "dist", "json");
const localesPath      = path.join(process.cwd(), "dist", "locales");
const fontsPath        = path.join(process.cwd(), "dist", "assets", "fonts");
const thirdsourcesPath = path.join(process.cwd(), "dist", "thirdsources");

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest(fontsPath));
});

gulp.task('json', function() {
    return gulp.src('src/json/**/*')
        .pipe(gulp.dest(jsonPath));
});

gulp.task('locales', function() {
    return gulp.src('src/locales/**/*')
        .pipe(gulp.dest(localesPath));
});

//第三方资源文件
gulp.task("thirdsources", function() {
    return gulp.src('src/thirdsources/**/*')
        .pipe(gulp.dest(thirdsourcesPath));
});

gulp.task("move",['fonts','json','locales','thirdsources']);

