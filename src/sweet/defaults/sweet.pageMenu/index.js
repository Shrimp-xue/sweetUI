require("./index.less");
var SweetFrameMenu = require("sweetFrameMenu");
var getPage_Menu=function(){
    var result;
    if(typeof(appConfig.pageMenu)=="function")
    result=appConfig.pageMenu();
    else
    result=appConfig.pageMenu;
    return result;
}
var PAGE_MENU=getPage_Menu();
var pageMenu = {
    // 容器ID
    el: PAGE_MENU.el?PAGE_MENU.el:"#frameBox-pageMenu",
    type:"container",
    noCheckLogin: 1,
    className: ["frame-menu", "frame-pageMenu"],
    // 页面渲染之前执行
    beforeRender: function() {
        return true;
    },
    // 页面渲染
    renderer: {
        // #sweetRoot 为最顶层。可设置成其他容器，如#frameMain
        container: '#frameMain',
        // flase 为替换模式，true为追加模式
        mode: false,
        // 是否启用ajax模式   
        isAjax: false,
        // 开启ajax模式时，所需的jquery ajax 参数
        ajaxParams: {
            url: ""
        },
        // 手动设置初始数据
        data: {},
        // html模板
        template: require('./index.html')
    },
    init: function() {
        var _this = this,pageMenu;
        SWTOOL.closeNavSwitch();
        var PAGE_MENU=getPage_Menu();
        SWXHR.GET(PAGE_MENU.ajax.url, PAGE_MENU.ajax.data(_this.page.query)).done(function(data) {
            var obj = PAGE_MENU.ajax.response(data);
            if (obj) {
                var frameMenuConfig = PAGE_MENU,
                    skin = frameMenuConfig ? (frameMenuConfig.skin ? frameMenuConfig.skin : _this.defaults.skin) : _this.defaults.skin,
                    field = frameMenuConfig ? (frameMenuConfig.field ? frameMenuConfig.field : _this.defaults.field) : _this.defaults.field,
                    opt = frameMenuConfig ? frameMenuConfig.options : {};
                var options = $.extend({
                    skin:skin,
                    data: obj,
                    field: field,
                    leftRender: _this.buildMenuModule(skin),
                    currentUrl: window.currentUrl
                }, opt)
                new SweetFrameMenu('#frameMain-pageMenu', options);
            }
        })
    },
    //解析菜单模块
    buildMenuModule: function(path) {
        var results = function(r) {
            var a = r.keys(),
                res = {};

            for (var i = 0; i < a.length; i++) {
                var item = a[i];
                var str = item.replace(".", "").split("/")[1];
                if (str == path) {
                    var resolve = r(item);
                    item = item.split('/');
                    item = item[item.length - 1];
                    if (item.indexOf("template") == 0) {
                        res.template = resolve;
                    } else if (item.indexOf("style") == 0)
                        res.style = resolve
                }

            }
            return res;
        }

        return results(require.context('../sweet.frameMenu', true, /\.html|less$/));

        console.log(cache)
    }
}
module.exports = pageMenu;
