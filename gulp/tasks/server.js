const gulp            = require('gulp');
const minimist        = require('minimist');
const webpackConfig   = require('../webpack.config');
const browserSync     = require('browser-sync').create();
const proxyMiddleware = require("http-proxy-middleware");
const requireDir      = require('require-dir');
const dir             = requireDir('./', { recurse: true }); // 通过 require-dir 将gulp 任务配置导入
const modeOptions     = { string: 'env', default: { env: process.env.NODE_ENV || 'dev' } };
const mode            = minimist(process.argv.slice(2), modeOptions);
const envConfig       = require("../config")[mode.env];

/**
 * [利用webapck中间件，搭建webpack热更新开发服务环境]
 */

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

gulp.task('server', ['images', 'move', 'contactModuleCss', 'less', 'js'], function() {

    // 合并中间件
    let wbMiddleware = [
            //global.compiler 来自于 js task内的定义
            webpackDevMiddleware(global.compiler, {
                publicPath: webpackConfig.output.publicPath,
                stats: { colors: true }
            }),
            webpackHotMiddleware(global.compiler)
        ],
        middleware = envConfig.middleware.concat(wbMiddleware);

    // 启动开发服务环境
    browserSync.init({
        ghostMode:false,
        server: {
            baseDir: 'dist',
            middleware: middleware
        },
        port: envConfig.port,
        files: [
            '**/*.html',
            '**/*.css'
        ]
    });
    gulp.start("watch");
});