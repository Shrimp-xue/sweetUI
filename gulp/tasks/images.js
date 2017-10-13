/**
 * 图片压缩打包处理
 */

const gulp        = require('gulp');
const path        = require('path');
const gulpif      = require("gulp-if");
const imagemin    = require('gulp-imagemin');
const minimist    = require('minimist');
const modeOptions = {string: 'env',default: { env: process.env.NODE_ENV || 'dev' }};
const mode        = minimist(process.argv.slice(2), modeOptions);
const isProduct   = mode === "production";
const requireDir  = require('require-dir');
const dir         = requireDir('./', { recurse: true });
const imgPath     = path.join(process.cwd(), "dist", "assets", "images");


gulp.task('images', ['clean:images'], function() {
    //images/**/* images目录下的所有子目录和所有东西(包含东西最多)
    //images/*/* images目录下的东西和子目录下的东西
    //images/*.{png,jpg} images目录下的所有以png和jpg为后缀名的图片
    gulp.src('src/images/**/*')
        .pipe(gulpif(isProduct, imagemin())) //压缩图片
        .pipe(gulp.dest(imgPath));
});
