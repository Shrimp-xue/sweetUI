const gulp             = require('gulp');
const requireDir       = require('require-dir');
const dir              = requireDir('./gulp/tasks',{ recurse: true}); // 通过 require-dir 将gulp 任务配置导入


/**
 * gulp默认启动配置
 */
gulp.task('default', ['server']);


gulp.task('afterClean',['images', 'move', 'less', 'js']);
gulp.task('build', ['clean:all'],function(){
    gulp.start("afterClean");
});
