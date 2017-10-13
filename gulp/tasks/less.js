/**
 * less编译
 */


const gulp         = require('gulp');
const path         = require('path');
const fs           = require('fs');
const less         = require('gulp-less');
const concat       = require('gulp-concat');
const cssmin       = require('gulp-cssmin');
const filter       = require("gulp-filter");
const browserSync  = require('browser-sync').create();
const handleErrors = require('../handleErrors');
const gulpif       = require("gulp-if");
const isProduct    = process.argv[2] == "production";
const cssPath      = path.join(process.cwd(), "dist", "assets", "css");

gulp.task("less-watch",function() {
    return gulp.src('src/less/index.less')
        .pipe(less())
        .on('error', handleErrors) //交给notify处理错误
        .pipe(gulp.dest(cssPath))
        .pipe(filter(cssPath+'**/*.css')) // Filtering stream to only css files
        .pipe(browserSync.reload({
            stream: true
        }));
});



var srcDir = path.resolve(process.cwd(), 'src/less');
fs.writeFile(srcDir + "/combine.less", "", (err) => {
    if (err) throw err;
});

gulp.task("contactModuleCss", function() {
    return gulp.src(['src/*(modules|plugins|sweet)/**/*.*(less|css)'])
        .pipe(concat('combine.less'))
        .pipe(gulp.dest('src/less'));
});


gulp.task("less",["contactModuleCss"],function(){
     return gulp.src('src/less/index.less')
        .pipe(less())
        .on('error', handleErrors) //交给notify处理错误
        //这里可以加css sprite 让每一个css合并为一个雪碧图
        // .pipe(spriter({}))
        .pipe(gulpif(isProduct, cssmin()))
        .pipe(gulp.dest(cssPath));
});
