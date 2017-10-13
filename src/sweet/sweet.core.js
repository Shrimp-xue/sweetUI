/**
 * SweetUI 0.3.1
 * Sweet 核心文件
 * Released on: 2017/04/07
 * Licensed under MIT
 *
 * By：Mcqun
 *
 * 更新记录
 * content:
 * 1、剥离renderer请求ajax方法
 * 2、增加控制器 controller.renderer.refresh(options) 方法，options={query:{}} 设置参数 该参数是继承状态
 *
 * time: 2017/06/12
 * By:huyingjun 
 *
 * content:
 * 1、增加ctrl.renderer.refreshByData方法
 * time: 2017/07/25
 * By:huyingjun 
 *
 * content:
 * 1、增加SWTOOL.go可带参数，window.sweetNowParams即可获取最近一次go发生的携带的参数。
 * 2、增加sui-router-data属性，当sui-router触发时，该元素有存在sui-router-data属性则将该属性的值一并带入SWTOOL.go
 * 中去。
 * 3、window.sweetNowParams会在控制器变化的时候自动销毁。
 *
 * content:
 * 1、当ajax模式启动时，若没有返回url的话，那么ajax不生效。
 *
 * 2、增加ctrl.renderer.data回调函数参数ctrl
 *
 */
var Sweet = function() {
    var s = this;

    this.init.apply(s, arguments);
    return s;
};

Sweet.prototype = {
    v: appConfig.version,
    constructor: Sweet,
    init: function(params, callback) {
        var html='<div class="sw-root" id="sweetRoot"></div>';
        if($('body').find("#sweetRoot").length!=0)
        $('body').find("#sweetRoot").remove()

        $('body').append(html);
        window.loadModule = [];
        if (typeof callback === 'function') callback();
    },
    //console.log欢迎语
    welcome: function() {
        var that = this;
        console.group('%c欢迎使用Sweet-UI v' + that.v, 'font-size:14px;color:#296ab4;');
        console.log('%cSweet UI是一个前后端分离，自动化，模块化，拥有强大丰富组件库，高效的前端开发框架', 'color:#999');
        console.groupEnd();
    },
    controller: function(ctrl, query, loadModuleIdx) {

        var that = this,
            routesLength = that.getRoute().length - query.length;

        //先判断登录验证
        if (!app.chkLogin.check() && !ctrl.noCheckLogin) {
            SWTOOL.go(appConfig.loginUrl,null,{
                callback: function() {
                    app.clearStorage();
                }
            });
            console.log("%c控制器el为:"+ctrl.el+"登录验证不通过",'color:#ff0000')
            return false;
        }

        //后判断生命周期
        if (typeof ctrl.beforeRender === "function") {
            var before = ctrl.beforeRender();
            if (!before) return false;
        }

        var renderer = function(ctrl,isLast) {
            window.currentCtrl = ctrl;
            var trueEl=ctrl.el;
            //解决存在多个pageMenu的可能
            if(typeof(trueEl)=="function")
            trueEl=ctrl.el();
            //已存在该容器，选择刷新渲染
            if ($(trueEl).length > 0) {
                if(isLast)
                refreshRenderer(ctrl)
                return false;
            }
            var tplData = ctrl.page.data ? ctrl.page.data : {};
            var html = ctrl.renderer.template(tplData),
                className = ctrl.className ? ctrl.className : '',
                sweetRoot = $("#sweetRoot");
            if (typeof(className) == "object") {
                className = className.join(" ");
            }
            renderContainer = ctrl.renderer.container ? $(ctrl.renderer.container) : sweetRoot;

            if (renderContainer.length === 0) {
                if (ctrl.renderer.mode) {
                    sweetRoot.html('<div id="' + ctrl.renderer.container.replace(/#|\./, "") + '"><div id=' + trueEl.replace(/#|\./, "") + ' class="' + className + '">' + html + '</div></div>');
                } else {
                    sweetRoot.append('<div id="' + ctrl.renderer.container.replace(/#|\./, "") + '"><div id=' + trueEl.replace(/#|\./, "") + ' class="' + className + '">' + html + '</div></div>');
                }
            } else {
                if (ctrl.renderer.mode) {
                    renderContainer.append('<div id=' + trueEl.replace(/#|\./, "") + ' class="' + className + '">' + html + '</div>');
                } else {
                    renderContainer.html('<div id=' + trueEl.replace(/#|\./, "") + ' class="' + className + '">' + html + '</div>');
                }
            }
            //事件托管
            eventsWork(ctrl);
            controllerByRefresh(ctrl);
            ctrl.isCurrentPage = isLast;
            ctrl.init();

            sweetHandler.init(trueEl);
        };
        var refreshRenderer = function(ctrl){
            var tplData = ctrl.page.data ? ctrl.page.data : {};
            var html = ctrl.renderer.template(tplData),
                className = ctrl.className ? ctrl.className : '',
                sweetRoot = $("#sweetRoot");
            if (typeof(className) == "object") {
                className = className.join(" ");
            }
            renderContainer = ctrl.renderer.container ? $(ctrl.renderer.container) : sweetRoot;

            if (renderContainer.length === 0) {
                if (ctrl.renderer.mode) {
                    sweetRoot.html('<div id="' + ctrl.renderer.container.replace(/#|\./, "") + '"><div id=' + ctrl.el.replace(/#|\./, "") + ' class="' + className + '">' + html + '</div></div>');
                } else {
                    sweetRoot.append('<div id="' + ctrl.renderer.container.replace(/#|\./, "") + '"><div id=' + ctrl.el.replace(/#|\./, "") + ' class="' + className + '">' + html + '</div></div>');
                }
            } else {
                if (ctrl.renderer.mode) {
                    renderContainer.append('<div id=' + ctrl.el.replace(/#|\./, "") + ' class="' + className + '">' + html + '</div>');
                } else {
                    renderContainer.html('<div id=' + ctrl.el.replace(/#|\./, "") + ' class="' + className + '">' + html + '</div>');
                }
            }

            ctrl.init();
            eventsWork(ctrl);
            sweetHandler.init(ctrl.el);
        }
        var moduleLoad = function(ctrl, routesLength, loadModuleIdx) {
            var status = app.chkLogin.check();
            //装载控制器待执行
            console.log("装载控制器：" + ctrl.el);
            console.log("装载控制器moduleidx:" + loadModuleIdx);
            console.log("当前登录状态:" + status);
            for (var i = 0; i < loadModuleIdx; i++) {
                if (!window.loadModule[i]) {
                    window.loadModule[i] = "empty";
                }
            }
            window.loadModule[loadModuleIdx - 1] = {
                ctrl: ctrl,
                query: query,
                fn: renderer
            };
            window.loadModule.length = window.loadModule.length ? window.loadModule.length : 0;

            // window.loadModule.length++;
            if (checkModuleFull() && window.loadModule.length === routesLength) {
                for (var i = 0; i < window.loadModule.length; i++) {
                    var type=window.loadModule[i].ctrl.type;
                    var isLast = (i+1) === window.loadModule.length;
                    if (typeof window.loadModule[i].fn === 'function'&&(isLast||type=="container")) {
                        window.loadModule[i].fn(window.loadModule[i].ctrl,isLast);
                    }
                }

                window.loadModule = [];
                window.loadModuleIdx = 0;
            }
        };
        //判断控制器池是否装载满
        var checkModuleFull = function() {
            var result = true;
            for (var i = 0; i < window.loadModule.length; i++) {
                if (window.loadModule[i] === "empty") {
                    result = false;
                    break;
                }
            }
            return result;
        }
        //控制器刷新方法
        var controllerByRefresh=function(ctrl){
            if(ctrl.renderer.isAjax&&!ctrl.renderer.refresh)
            {
                ctrl.renderer.refresh=function(options){
                    if(!options)options={};
                    controllerByAjax(ctrl,options)
                }
            }
            if(!ctrl.renderer.refreshByData)
            {
                ctrl.renderer.refreshByData=function(data){
                    if(typeof(data)=="function")
                    {
                        ctrl.page.data=data(ctrl.page.data)
                        refreshRenderer(ctrl);
                    }
                    
                }
            }
        }
        //控制器ajax 请求
        var controllerByAjax=function(ctrl,options){
            var ajaxParams = $.extend(true, {}, ctrl.renderer.ajaxParams),
                ajaxUrl = typeof ajaxParams.url === 'function' ? ajaxParams.url(ctrl.page) : ajaxParams.url,
                ajaxMethod = ajaxParams.method ? ajaxParams.method : 'GET';
            ajaxParams.data = typeof ajaxParams.data === "function" ? ajaxParams.data.call(ctrl,ctrl.page) : ajaxParams.data;

            if(options)
            {
                ajaxParams.data=$.extend(true,ajaxParams.data,options.query);
            }
            //当没有返回url时 ajax不生效
            if(ajaxUrl)
            SWXHR.AJAX(ajaxMethod, ajaxUrl, ajaxParams, "ajaxoption").done(function(data) {
                var status = true;
                if (!ctrl.noCheckLogin) {
                    status = appConfig.httpInterceptors.response(data);
                }
                if (status) {
                    var mData,
                        handleData = typeof(ctrl.renderer.data)=="function"? ctrl.renderer.data(ctrl.page) : (ctrl.renderer.data?$.extend(true,{},ctrl.renderer.data):{});
                    if (typeof ctrl.renderer.responseHandler === 'function') {
                        mData = ctrl.renderer.responseHandler(data);
                    } else {
                        mData = data;
                    }
                    ctrl.page.data = $.extend(handleData, mData);

                    if(options)
                    {
                        if(typeof(options.response)=="function")
                        {
                            // refreshData=options.response(ctrl.page.data,data);
                        }
                        refreshRenderer(ctrl);
                    }
                    else
                    moduleLoad(ctrl, routesLength, loadModuleIdx);                    
                }
            });
            else
            {
                ctrl.page.data=$.extend(true,{},ctrl.renderer.data);
                moduleLoad(ctrl, routesLength, loadModuleIdx);
            }
            
        }
        //事件托管处理
        var eventsWork = function(ctrl) {
                var container = ctrl.el;
                var listener = ctrl.eventListener;
                for (var key in listener) {
                    var arr = key.split(" ");
                    var method = arr[0],
                        fn = listener[key],
                        el = "";
                    for (var i = 1; i < arr.length; i++) {
                        el = el + (i == 1 ? "" : " ") + arr[i];
                    }
                    console.log($(container)[method]);
                    $(container).on(method, el, {
                        controller: ctrl
                    }, fn);
                }
        }
            /*console.log("~~~~loadModuleIdx");
            console.log(loadModuleIdx);*/
        if (!ctrl.page) ctrl.page = {};
        ctrl.page.query = query;

        var handleData;
        if (ctrl.renderer.isAjax) {
            controllerByAjax(ctrl);
        } else {
            if(typeof(ctrl.renderer.data)=="function")
            ctrl.page.data=ctrl.renderer.data(ctrl.page);
            else
            ctrl.page.data=$.extend(true,{},ctrl.renderer.data);
            moduleLoad(ctrl, routesLength, loadModuleIdx);
        }

        return that;
    }
};

window.Sweet = new Sweet();
window.Sweet.welcome();

module.exports = window.Sweet;
