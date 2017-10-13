const gulp       = require('gulp');
const browserSync = require('browser-sync').create();
const requireDir = require('require-dir');
const dir        = requireDir('./',{ recurse: true}); 


gulp.task('watch',function(){
	gulp.watch("src/less/**/*.less",["less-watch"]);
	gulp.watch("src/*(modules|plugins|sweet)/**/*.*(less|css)",["contactModuleCss"]);
	gulp.watch("src/fonts/**/*",["fonts"],function(){browserSync.reload();});
	gulp.watch("src/json/**/*",["json"],function(){browserSync.reload();});
	gulp.watch("src/locales/**/*",["locales"],function(){browserSync.reload();});
	gulp.watch("src/images/**/*",["images"],function(){browserSync.reload();});
	gulp.watch("src/modules/**/*.js",function(ev){
		console.log('文件变化类型：'+ev.type);
		if(ev.type !== 'changed'){
			gulp.start('buildController');
		}
	});
});