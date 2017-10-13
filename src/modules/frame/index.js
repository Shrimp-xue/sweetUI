/**
 * SweetFrame 0.1.0
 * Sweet框架控制器
 * Released on: 2017/04/27
 * Licensed under MIT
 * 
 * By: 马超群 胡英军
 * Email：mchqun@126.com
 *
 * 更新记录
 * update time: 2017/04/27
 * content:新增加载菜单模块机制buildMenuModule，提供一个菜单的文件夹，下面包含2个文件,template.html为视图、style.less为样式。
 * By: 胡英军
 */


var SweetFrameMenu = require("sweetFrameMenu");
var sweetFullScreen = require("sweetFullScreen");
var mousewheel = require("mousewheel");
var scrollBar = require("scrollBar");
var appConfig = require("appConfig");
//事件集合
var eventsHandler = {
    changeUser: function() {
        
    },
    logoutSystem: function() {
        SWTOOL.go(appConfig.loginUrl,null,{callback:function(){
            app.clearStorage();
        }});
    },
    toggleExpandMenu: function(event) {
        var $this = $(this),
            $root = $this.parents("#sweetRoot");
        console.log($root)
        $root.toggleClass("sw-close-menu")
        $('.bootstrap-table table').each(function(){
            var id=$(this).attr("id");
            if(id)
            {
                $("#"+id).bootstrapTable("resetWidth");
            }
            
        })
    }
}

var layoutInfo=localStorage.layoutInfo?JSON.parse(localStorage.layoutInfo):{type:""};

var frameCtrl = {
    // 容器ID
    el: "#frameBox",
    //控制器类型 container则为承载框架 设置后无论如何会执行该控制器，默认不是当前页面不执行。
    type:"container",
    className: ["frame-box","loading-menu"],
    noCheckLogin:1,
    // 页面渲染之前执行
    beforeRender: function() {
        return true;
    },
    //事件监听器
    eventListener: {
        'click .nav-switch': eventsHandler.toggleExpandMenu,
        'click #tanentChoseUl li a': eventsHandler.changeUser,
        'click #logout': eventsHandler.logoutSystem
    },
    // 页面渲染
    renderer: {
        // #sweetRoot 为最顶层。可设置成其他容器，如#frameMain
        container: '#sweetRoot',
        // flase 为替换模式，true为追加模式
        mode: false,
        // 是否启用ajax模式   
        isAjax: false,
        // 开启ajax模式时，所需的jquery ajax 参数
        ajaxParams: {
            url: "/platform/session-info"
        },
        // 手动设置初始数据
        data: {
            currentVersion:Sweet.v+" 版本",
            versions:[
                {
                    id:1,
                    name:Sweet.v+" 版本"
                },
                // {
                //     id:2,
                //     name:"sweet-ui 0.2.0"
                // }
            ]
        },
        // html模板
        template: (function(){
            if(layoutInfo)
            var skin = layoutInfo.type;
            else
            var skin = "Sweet_Menu_Default:normal";

            var type=skin.split(":")[1],
                name=skin.split(":")[0].split("_")[2];
            type=type?type:"normal";
            name=name?name:"Default";
            return require("./template/"+name+"/template-"+type+".html")
        })()
    },
    init: function() {
        var that = this;
        that.setFrame();
        $(window).resize(function(event) {
            that.setFrame();
        });

        that.menuInit();

        that.fullscreen();

        // that.getUserDetail();
    },
    defaults: {
        skin: "Sweet_Menu_Default",
        field: {
            levelField: "level",
            parentIdField: 'parent',
            idField: 'id',
            nameField: 'name',
            treeField: 'path',
            groupField: "group"
        }
    },
    // 设置框架高度
    setFrame: function() {
        var topH = $(window).height() - $(".frame-top").height();
        $(".frame-left-inner").height(topH);
    },
    menuInit:function(){
        //单独剥离菜单，自行配置
        var _this = this;

        //promise 
        var menuData,authData;
        var xhrmenu=SWXHR.GET("/json/login.json")
        $.when(xhrmenu).done(function(data){
            var obj=data.data.userPermissionVO;
            console.log(obj);
            SWXHR.GET("/json/auth.json").done(function(data){
                if (obj&&obj.length>0) {
                    //菜单渲染
                    new SweetFrameMenu('#frameMenu',{
                        skin:(function(){
                            if(layoutInfo)
                            return layoutInfo.type;
                            else
                            return "Sweet_Menu_Default:normal"
                        })(), 
                        data:obj,                  //只接受菜单的数组
                        field: {                   //接口返回的权限菜单的字段格式化
                            levelField: "level",
                            parentIdField: 'parent',
                            idField: 'id',
                            nameField: 'name',
                            treeField: 'path',
                            groupField: "group"
                        },
                        // 0：带top按钮；1：不带top按钮 Sweet_Menu_Default主题有效
                        type:(function(){
                            if(layoutInfo.type.split(":")[2])
                            return 0;
                            else
                            return 1;
                        })(),
                        // 数值代表拦截第几层转化为标签(没有展开功能)
                        treeLevels:99999,
                        //权限部分
                        auth:{
                            fieldCode:"idField",    //和菜单对应的
                            limit:",",          //code码分割符 默认,
                            data:data.auth      //code码
                        }
                    });
                }
                else
                SWTOOL.layer.alert({
                    type:"error",
                    content:"请配置菜单接口"
                })
            })
        })   
    },
    fullscreen: function() {
        var fullscreen = new sweetFullScreen('#fullscreenBtn');
        fullscreen.init();
    },
    // 设置菜单滚动条
    scrollBar: function() {
        $("#frameMenu").mCustomScrollbar({
            scrollInertia: 100,
            theme: "minimal-dark",
            autoHideScrollbar: true
        });
    },
    //暂时解决session-info 不实时的问题
    getUserDetail:function(){
        SWXHR.GET('/user-center/system/user/', {}, 'json').done(function (res) {
            if (res.code === 'success') {
                if (res.data.avatar) {
                    $('#userHeadImg').attr('src', res.data.avatar)
                } else {
                    $('#userHeadImg').attr('src', 'assets/images/head.png')
                }
            }
        })
    }
};

module.exports = frameCtrl;