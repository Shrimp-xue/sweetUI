/**
 * SweetRouter 0.1.0
 * Sweet路由组件
 * Released on: 2017/04/07
 * Licensed under MIT
 * 
 * By: 马超群
 * Email：mchqun@126.com
 *
 */

var director = require('director');
var sweetController = require("sweetController");
var SweetFrameMenu = require("sweetFrameMenu");

var Class = function(params) {
    var s = this;

    var options = $.extend(s.defaults, params || {});

    s.options = options;

    return s;
};

Class.prototype = {
    v: '0.1.0',
    constructor: Class,
    defaults: {
        onBefore: function() {
            return false;
        },
        onChange: function() {
            return false;
        },
        onAfter: function() {
            return false;
        }
    },
    init: function() {
        var that = this;
        that.router = that.create();
    },
    create: function() {
        var that = this,
            routes = appConfig.routes;
        window.router = director.Router(routes).configure({
            before: function() {
                var suffix = Array.prototype.slice.call(arguments).join('/');
                window.currentUrl = '#/' + window.location.hash.slice(2);
                $("#sweetRoot").attr('data-view', window.currentUrl);
                // if(window.frameMenu&&window.frameMenu.active) window.frameMenu.active(window.currentUrl);

                if(layer) layer.closeAll();

                if (typeof that.options.onBefore === 'function') that.options.onBefore();
                
                
            },
            on: function() {
                var _this=this;
                that.changeUrlByActiveMenu(window.currentUrl);
                // that.traversal.call(_this,appConfig.routes);  
                //每次变化路由必须清空ModuleIdx
                app.resetModuleIdx();
                if (typeof that.options.onChange === 'function') that.options.onChange();
            },
            after:function(){
                if (typeof that.options.onAfter === 'function') that.options.onAfter();
            },
            resource: sweetController,
            recurse: "forward"
        }).init();

        return window.router;
    },
    //每次路由变化需要点亮菜单，遗弃点击逻辑.
    changeUrlByActiveMenu:function(url){
        if(SweetMenus.length!=0&&SweetMenus)
        {
            for(var i=0;i<SweetMenus.length;i++)
            {
                var menuObject=SweetMenus[i];
                if(typeof(menuObject.refresh)=="function")
                {
                    menuObject.refresh(url);
                }
            }
        }
    },
    //匹配路由，获取当前路由规则
    traversal:function(routes){
        var arr=this.getRoute();
        var index=0;
        var everyTraversal=function(obj){
            for(var key in obj)
            {
                var item=obj[key],
                    module=key.replace(/\//g,"");
                console.log("======"+module+"========")
                console.log(item);
                console.log("======"+module+"========")
                if(module!="on")
                {
                    var str=arr[index];
                    if(str==module)
                    {
                        if(typeof(item)=="object")
                        {
                            index++;
                            everyTraversal(item);   
                        }
                    }
                }   
            }
        };
        var matchPath=function(){

        }
        everyTraversal(routes);
    }
};

var SweetRouter = {
    init: function(params) {
        var swRouter = new Class(params);
        swRouter.init();
        return router;
    }
};

window.SweetRouter = SweetRouter;

module.exports = window.SweetRouter;
