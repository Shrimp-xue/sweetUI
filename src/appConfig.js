//系统配置项
var _baseEnv = baseEnv;
module.exports = {
    version:"1.1.0",
    title: "SWEET UI",
    baseURL: _baseEnv.baseURL,
    homeUrl:"#/main",     //默认首页
    loginUrl:"",            //登录页面
    //路由配置了sweet.pageMenu则生效
    pageMenu: function() {
        var bool = window.currentUrl.indexOf("/main/index/docs") >= 0 ? 1 : 0;
        return {
            el: function() {
                var str = window.currentUrl.indexOf("/main/index/docs") >= 0 ? '1' : '2';
                return "#frameBox-pageMenu" + str
            },
            ajax: {
                url: bool ? "/json/docsmenu.json" : "/json/iconsmenu.json",
                type: "GET",
                response: function(data) {
                    return data.data
                },
                data: function() {
                    return;
                }
            },
            skin: "Sweet_Menu_Default", //菜单主题,目前只有这一种
            field: { //接口返回的权限菜单的字段格式化
                levelField: "level",
                parentIdField: 'parent',
                idField: 'id',
                nameField: 'name',
                treeField: 'path',
                groupField: "group"
            }
        }
    },
    //SWXHR 请求拦截器
    httpInterceptors: {
        //统一更改SWXHR模式. "ajaxoption"为新模式 false 为老模式  谨慎使用
        // modelType:"ajaxoption",
        //可选 拦截SWXHR请求之前的ajax参数
        request: function(options, tools) {
            if (localStorage.loginInfo) {
                var info = JSON.parse(localStorage.loginInfo);
                // console.log(info);
            }
            return options;
        },
        //可选 拦截SWXHR成功请求后的
        response: function(data) {
            return true;
        }
    },
    // 配置路由
    routes: {
        "/main": {
            // 框架
            on: "frame_index"
        }
    }


};