/**
 * 自动生成控制器
 * @type {[type]}
 */
const gulp        = require('gulp');
const path        = require('path');
const fs          = require("fs");
const globby      = require('globby');
const requireDir  = require('require-dir');
const dir         = requireDir('./',{ recurse: true});
const patternList = ['src/modules/**/*.js','src/sweet/defaults/**/*.js'];


gulp.task('buildController',['clean:js'], function(cb) {
    //生成异步加载配置文件
    globby(patternList).then(function(files) {
        var srcDir = path.resolve(process.cwd(), 'src/');
        var FilesText = "/*此文件由node动态生成，切勿修改！！*/ \n" +
            "module.exports = {" + "\n";
        for (var i = 0; i < files.length; i++) {
            var str = files[i].match(/(.+)\.js$/),
                filePath = path.relative('src/sweet/', str[1]).replace(/(\/|\\)/g, '/').replace('defaults', './defaults'),
                fileName = filePath.replace(/(\..(\/|\\)modules|\.(\/|\\)defaults)(\/|\\)/, '').replace(/(\/|\\)/g, '_');
            var tmp = '  "' + fileName + '":function(){\n' +
                '       let args = Array.prototype.slice.call(arguments);\n' +
                '       let that = this;\n' +
                '       let loadModuleIdx = window.loadModuleIdx ? window.loadModuleIdx : 0;\n' +
                '       loadModuleIdx++;\n' +
                '       window.loadModuleIdx = loadModuleIdx;\n' +
                '       require.ensure([], function(require) {\n' +
                '           let ctrl = require("' + filePath + '");\n' +
                '           Sweet.controller.call(that,ctrl,args,loadModuleIdx);\n' +
                '       },"' + fileName + '");\n' +
                '   },\n';
            FilesText += tmp;

            if (i + 1 === files.length) {
                FilesText += "\n};";
            }
        }
        fs.writeFile(srcDir + "/sweet/sweet.controller.js", FilesText, (err) => {
            if (err) throw err;
            console.log('=====控制器模块生成完毕=====');
            cb();
        });
    });
});
