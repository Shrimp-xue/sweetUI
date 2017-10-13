const gulp             = require('gulp');
const gutil            = require("gulp-util");
const webpack          = require('webpack');
const webpackConfig = require('../webpack.config');
const requireDir       = require('require-dir');
const dir              = requireDir('./',{ recurse: true}); // 通过 require-dir 将gulp 任务配置导入


/**
 * [webpack打包JS模块]
 */
global.compiler = "";
gulp.task('js',['buildController'], function(callback) {
    // run webpack
    global.compiler = webpack(webpackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));

        callback();
    });
});