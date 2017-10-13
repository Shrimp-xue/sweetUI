/*
app.js
*/
var SweetRouter = require("sweetRouter");
var SweetCheckLogin = require("sweetCheckLogin");

//loader进度条
var pace = require("pace");
pace.start();

var waves = require("waves");

//collapse展开组件
var tabs = require("tabs");
var transiton = require("transition");
var collapse = require("collapse");

//select组件
var dropdown = require("dropdown");
var tagsInput = require("tagsInput");


var sweetlinkMap = require("sweetlinkMap");

// 清除缓存
template.defaults.cache = false;


// 设置页面对象，将页面中要使用到的方法附到该对象中
var app = {
    // 初始化执行
    init: function() {
        var that = this;

        //设置标题
        that.setTitle();

        

        // 路由功能初始化
        SweetRouter.init();

        // 权限校验初始化
        that.checkLogin.init();

        //全局事件托管
        that.events.init();
    },
    checkLogin: {
        init: function() {
            app.chkLogin = new SweetCheckLogin({
                expireTime: 604800000
            });
            if (!window.currentUrl) SWTOOL.go(appConfig.homeUrl);
            // this.check();
        },
        check: function() {
            var chkStatus = app.chkLogin.check();
            if (chkStatus) {
                if (!window.currentUrl) SWTOOL.go(appConfig.homeUrl);
            } else {
                SWTOOL.go(appConfig.loginUrl);
            }
        }
    },
    resetModuleIdx:function(){
      window.loadModule = [];
      window.loadModuleIdx = 0;
    },
    events:{
        init:function(){
            var _this=this;
            //向下兼容sweet-ui 0.2.0版本的 sui-router功能
            $("html").on("click",'[sui-router]',_this.locationChange);
            $("html").on("click",'[iframe-router]',_this.iframeRouter);
        },
        locationChange:function(){
            var $this=$(this);
            var url=$this.attr("sui-router");
            //以./开头，表示相对
            if(url.indexOf("./")==0)
            {
                url=window.location.hash.replace(/^\#/,'')+url.replace(/^\./,'');
            }
            SWTOOL.go('#'+url);
        },
        iframeRouter:function(){
            var $this=$(this),
                url=$this.attr("iframe-router");
            SWTOOL.go("#"+url);
            return false;
        }
    },
    // 清除数据缓存
    clearStorage: function() {
        localStorage.clear();
    },
    setTitle:function(text){
        $("title").text(text?text:appConfig.title);
    }
};


window.app = app;
Sweet.init({}, function() {
    app.init();
});
// webpack热加载
if (module.hot) { module.hot.accept(); }