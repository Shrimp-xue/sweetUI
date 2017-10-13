/**
 * SweetFrameMenu 0.2.0
 * Sweet框架菜单组件
 * Released on: 2017/04/28
 * Licensed under MIT
 * 
 * By: 马超群 胡英军
 * Email：mchqun@126.com
 *
 * 更新记录
 * update time: 2017/04/27
 * content:新增加载菜单模块机制，提供一个菜单的文件夹，下面包含2个文件,template.html为视图、style.less为样式。
 * By: 胡英军
 *
 * 更新记录
 * update time: 2017/04/28
 * content:新增加field机制
 * By: 胡英军
 *
 * 更新记录
 * update time: 2017/05/15
 * content:
 * 去掉找不到菜单时默认给第一个ul 添加 class "on"
 * 去掉groupMode
 * By: 胡英军
 */

var mousewheel = require("mousewheel");
var scrollBar = require("scrollBar");
window.SweetMenus = new Array();
var SweetFrameMenu = function(element, params) {
    var s = this;
    var options = $.extend(s.defaults, params || {});
    if(!options.auth)options.auth={};
    console.log(options);
    s.options = options;
    s.element = $(element);
    s.menuIndex = s.element.selector === "#frameMenu" ? 0 : 1;
    if (s.element.length === 0) return;
    s.init.apply(s, arguments);
    var checkSweetMenus = function(s, element) {
        if (SweetMenus) {
            for (var i = 0; i < SweetMenus.length; i++) {
                if (SweetMenus[i].element.selector === element) {
                    SweetMenus[i] = s;
                    return false;
                }

            }
        }
        return true;
    }
    if (checkSweetMenus(s, element))
        SweetMenus[s.element.selector === "#frameMenu" ? "unshift" : "push"](s);
    sweetHandler.linkMap();
    return s;
};

SweetFrameMenu.prototype = {
    v: '0.1.0',
    constructor: SweetFrameMenu,
    defaults: {
        // 0：带top按钮；1：不带top按钮
        type: 1,
        treeLevels: 999,
        data: [],
        menuConfig: '',
        field: '',
        rootId: 0,
        topRender: '',
        leftRender: ''
    },
    init: function() {
        var that = this;
        if (this.options.type === 0) that.element.addClass('menu-type-0');

        //皮肤默认值以及默认模版设置
        if(!this.options.skin)this.options.skin="Sweet_Menu_Default:normal";
        var skin=this.options.skin;
        this.options.leftRender=skin.split(":")[0]?skin.split(":")[0]:"Sweet_Menu_Default";
        if (this.options.leftRender)this.options.leftRender=that.buildMenuModule(this.options.leftRender);


        this.getData();
        this.events();
        this.renderer();
        $('#frameBox').removeClass("loading-menu");
    },
    getData: function() {
        var that = this,
            menuData = this.filedData(this.options.data),
            menuDataList = {},
            menuUrlList = {};

        var fn = function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i]["idField"])
                    menuDataList[data[i]["idField"]] = data[i];
                if (data[i].url) menuUrlList[data[i].url] = data[i];
                if (data[i].children) fn(data[i].children);
            }
        };
        fn(menuData);
        that.menuDataList = menuDataList;
        that.menuData = menuData;
        that.menuUrlList = menuUrlList;
        console.log(menuUrlList);
        return menuData;
    },
    getParents: function(id) {
        if (!id) return [];
        var that = this,
            parentIds = that.menuDataList[id]["treeField"].split('-');
        return parentIds;

    },
    makeData: function(obj) {
        var len = obj.length;
        if (typeof(len) == "undefined") {
            var result = $.extend(true, {}, obj)
        } else {
            var result = $.extend(true, [], obj)
        }
        return result
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

        return results(require.context('../defaults/sweet.frameMenu', true, /\.html|less$/));

        console.log(cache)
    },
    rendererMenuByType: {
        'Sweet_Menu_Default': {
            leftMenuInclude:1,
            render: function(activeId, data, type) {
                var that = this,
                    options = that.options,
                    menuData = data ? data : that.makeData(that.menuData),
                    isActive = 0,
                    activeClass = '',
                    topMenuHtml = '<ul>';
                if (options.type) return;
                var watchArrEvery = function(menuData) {
                    activeClass = '';
                    for (var i = 0; i < menuData.length; i++) {
                        // if(menuData[i]["groupField"])
                        // {
                        //     watchArrEvery(menuData[i].children);
                        // }
                        if (menuData[i].isMenu || menuData[i]["groupField"]) {
                            var url = menuData[i].url ? menuData[i].url : " javascript:;";
                            if (menuData[i]["groupField"]) {
                                menuData[i]["nameField"] = menuData[i]["groupField"];
                            }
                            if (that.activeParentIds.length > 0) {
                                activeClass = menuData[i]["idField"] == that.activeParentIds[0] ? ' active' : '';
                            } else if (!isActive) {
                                if (i === 0) {
                                    //控制默认第一个点亮
                                    isActive = 1;
                                    activeClass = 'active';
                                    that.activeParentIds[i] = menuData[i]["idField"];
                                }
                            }
                            topMenuHtml += '<li class="nav-menu-item ' + activeClass + '">' +
                                '<a href=' + url + ' data-menuIdx=' + i + ' data-id=' + menuData[i]["idField"] + ' title=' + menuData[i]["nameField"] + ' class="waves-effect waves-light ">' +
                                menuData[i]["nameField"] +
                                '</a></li>';
                        }
                    }

                }

                watchArrEvery(menuData);

                topMenuHtml += '</ul>';
                $("#navMenu").html(topMenuHtml);
            }
        },
        //门户式导航渲染
        'Sweet_Menu_fullTop,Sweet_Menu_hoverTop': {
            leftMenuInclude:0,
            render: function(activeId, data) {
                activeId = activeId ? activeId : window.menuActiveId ? window.menuActiveId : 0;
                var that = this,
                    options = that.options,
                    skinName = options.skin.split(":")[0].split("_")[2],
                    className = "nav-menu-"+(skinName?skinName:"fullTop"),
                    menuData = data ? data : that.makeData(that.menuData),
                    isActive = 0,
                    activeClass = '',
                    topMenuHtml = '<ul>',
                    tplData = that.menuDataList;

                var watchArrEvery = function(menuData) {
                    activeClass = '';
                    for (var i = 0; i < menuData.length; i++) {
                        if (menuData[i].isMenu || menuData[i]["groupField"]) {
                            var url = menuData[i].url ? menuData[i].url : " javascript:;";
                            if (menuData[i]["groupField"]) {
                                menuData[i]["nameField"] = menuData[i]["groupField"];
                            }
                            if (that.activeParentIds.length > 0) {
                                activeClass = menuData[i]["idField"] == that.activeParentIds[0] ? ' active' : '';
                            } else if (!isActive) {
                                if (i === 0) {
                                    //控制默认第一个点亮
                                    isActive = 1;
                                    activeClass = 'active';
                                    that.activeParentIds[i] = menuData[i]["idField"];
                                }
                            }
                            topMenuHtml += '<li class="nav-menu-item '+className+ activeClass + '">' + '<a  href=' + url + ' data-menuIdx=' + i + ' data-id=' + menuData[i]["idField"] + ' title=' + menuData[i]["nameField"] + ' class="waves-effect">' + menuData[i]["nameField"] + '</a>' + '<div class="frame-navs-'+skinName+'">' + options.leftRender.template(tplData[menuData[i]["idField"]]) + '</div>' + '</li>';
                        }
                    }

                }

                watchArrEvery(menuData);

                topMenuHtml += '</ul>';
                that.element.html(topMenuHtml);

                that.element.find("#fm-" + activeId).addClass("active");

                $("body").on("click", function(e) {
                    var $target = $(e.target);
                    if ($target.hasClass(className) || $target.parents("."+className).length != 0)
                        return;
                    else
                        $("body").find("."+className).removeClass("on");
                })
                that.element.find("."+className).off().on("click", function() {
                    that.element.find("."+className).removeClass("on");
                    $(this).addClass("on");
                })
            }
        }
    },
    //拦截树状结构
    interceptTree: function(data) {

    },
    //filed数据源
    filedData: function(data) {
        var that = this,
            options = that.options,
            limit = options.auth.limit?options.auth.limit:",",
            fieldCode = options.auth.fieldCode?options.auth.fieldCode:"code",
            auths = options.auth.data?options.auth.data.split(limit):null,
            fields = options.field,
            levelField = fields.levelField?fields.levelField:"level",
            type = options.type,
            menuData = data ? data : that.makeData(that.menuData),
            len = menuData.length

        //权限检查
        var checkAuth=function(item){
            if(!auths)
            return true;
            for(var i=0;i<auths.length;i++)
            {
                var code = auths[i];
                if(item[fieldCode] == code)
                return false;
            }

            return true;
        }

        //遍历所有菜单节点
        var watchArrEvery = function(arr, _level) {
            if (arr[0][levelField] == 1) {
                if (type) _level = 1;
                else _level = 0;
            }
            if (!_level) {
                if (type) level = 1;
                else level = 0;
            } else level = _level;
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                item = watchFields(item);
                item.isMenu=checkAuth(item);

                if (item.isMenu) {
                    level = _level + 1;
                    if(type)
                    item["swLevel"] = level;
                    else
                    item["swLevel"] = level + 1;
                }

                if (item.children && item.children.length)
                    watchArrEvery(item.children, level);
            }


        }
        var watchFields = function(item) {

            for (var key in fields) {
                if (item[fields[key]] || typeof(item[fields[key]]) != "undefined") {
                    item[key] = item[fields[key]]
                    delete item[fields[key]]
                }
                if (item["levelField"] == options.treeLevels) {
                    item.isBlock = 1;
                }
            }
            return item;
        }
        if (typeof(len) == "undefined") {
            watchFields(menuData);
            watchArrEvery(menuData.children);
        } else
            watchArrEvery(menuData);
        return menuData;
    },
    leftMenu: function(activeId, data) {
        activeId = activeId ? activeId : window.menuActiveId ? window.menuActiveId : 0;
        var that = this,
            options = that.options,
            skinName = that.options.skin.split(":")[0],
            menuData = data ? data : that.makeData(that.menuData),
            leftRender = options.leftRender.template,
            tplData = null;
        if (options.type === 0 && that.menuIndex === 0) {
            var parentIdx;
            if (data) {
                tplData = data;
            } else {
                tplData = that.activeParentIds.length > 0 ? that.menuDataList[that.activeParentIds[0]] : menuData[0];
            }
            tplData.isRoot = 1;
        } else {
            // tplData=menuData;
            tplData = {
                groupField: "默认根区块",
                idField: "sweet-root",
                isRoot: 1,
                children: menuData
            };
        }
        tplData.activeId = activeId;

        console.log(tplData);
        var html = leftRender(tplData),
            frameMenu = that.element;
        that.isRender = 1;
        if (options.type === 0)
            frameMenu.mCustomScrollbar("destroy");
        frameMenu.html(html);

        if (activeId) {
            frameMenu.find('.fm-title').removeClass('active');
            // $("#fm-" + activeId).addClass('active').parents(".fm-item").addClass('on');
            $("#fm-" + activeId).addClass('active').parents(".fm-item[data-role!='group']").addClass('on').children('[role=tabpanel]').addClass('in');
        } else {
            //当找不到菜单的时候，默认展开第一个菜单树
            // if ($('#navMenu').find('.nav-menu-item').eq(0).hasClass('active')) {
            //     frameMenu.children('ul').children('.fm-item').eq(0).addClass('on');
            // }
        }
        if (skinName !== "Sweet_Menu_fullTop" && skinName !== "Sweet_Menu_hoverTop")
            that.scrollBar();
    },
    // 设置菜单滚动条
    scrollBar: function() {
        var that = this;
        that.element.mCustomScrollbar({
            scrollInertia: 100,
            theme: "minimal-dark",
            autoHideScrollbar: true
        });
    },
    renderer: function(activeId) {
        var that = this,
            options = that.options,
            menuDataList = that.menuDataList,
            menuSkin = options.skin.split(":")[0];
        if (typeof activeId === 'undefined') activeId = this.getActiveId();
        window.menuActiveId = activeId;
        that.activeParentIds = that.getParents(activeId);
        if (!that.menuIndex) {
            for (var key in that.rendererMenuByType) {
                var types = key,
                    item = that.rendererMenuByType[key];
                if (types.indexOf(menuSkin) >= 0)
                    item.render.call(that, activeId);
                if (!that.isRender && item.leftMenuInclude)
                    that.leftMenu(activeId);
            }
        } else {
            if (!that.isRender)
                that.leftMenu(activeId);
        }

    },
    events: function() {
        var that = this;

        $("#navMenu").on('click', '.nav-menu-item', function() {
            var self = $(this);
            self.addClass('active').siblings('li').removeClass('active');
            that.leftMenu(0, that.menuDataList[self.find('a').data('id')]);
        });
        var frameMenu = that.element;
        frameMenu.on("click", ".accordion-toggle", function() {
                event.stopPropagation();
                var $this = $(this),
                    li = $this.parent();
                li.toggleClass("on");
                var parent = $this.data('parent');
                var actives = parent && $(parent).find('.collapse.in');
                var liItems = actives.parent(".fm-item");
                // From bootstrap itself
                if (actives && actives.length) {
                    hasData = actives.data('collapse');
                    //if (hasData && hasData.transitioning) return;
                    actives.collapse('hide');
                    liItems.removeClass("on");
                }

                var target = $this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); //strip for ie7
                var $targetLi = $(target).parent("li");
                $(target).collapse('toggle');
            })
            // frameMenu.on('click', '.fm-title', function() {
            //     var self = $(this),
            //         parent = self.parent(),
            //         subMenu = self.next('ul');
            //     if(!self.hasClass("fm-block"))
            //     {
            //         if (self.hasClass('has-children')) {

        //         } else {
        //             frameMenu.find('.fm-title').removeClass('active');
        //             self.addClass('active');
        //             window.menuActiveId = self.data('id');
        //             that.set(window.menuActiveId);
        //         }
        //     }

        // });
    },
    active: function(url) {
        this.set(this.getActiveId(url));
    },
    set: function(id) {
        $("#fm-" + id).parents(".fm-item").siblings('.fm-item').removeClass('on');
        if (window.menuActiveId == id) return false;
        window.menuActiveId = id;
        this.renderer(id);
        return this;
    },
    getActiveId: function(url) {
        var that = this,
            currentUrl = url ? url : window.currentUrl ? window.currentUrl : '',
            result;
        activeId = that.menuUrlList[currentUrl] ? that.menuUrlList[currentUrl]["idField"] : null;
        var idx = 0;
        var findId = function(url) {
            var urlArr = url.replace('#/', '').split('/'),
                newUrlArr = [];
            for (var i = 0; i < urlArr.length; i++) {
                if (urlArr[i]) newUrlArr.push(urlArr[i]);
            }
            var newUrl = '#/' + newUrlArr.splice(0, newUrlArr.length - 1).join('/');

            idx++;
            if (idx === 5) return null;
            if (!that.menuUrlList[newUrl]) {
                findId(newUrl);
            } else {
                result = that.menuUrlList[newUrl];
            }
        };
        if (activeId === null) {
            findId(currentUrl);
            activeId = result ? result["idField"] : null;
        }
        return activeId;
    },
    //刷新菜单，路由变化时调用，摒弃click事件
    refresh: function(url) {
        var that = this;
        var id = that.getActiveId(url),
            frameMenu = that.element;
        var self = $("#fm-" + id), 
            parent = self.parent().parent().parent().children('.has-children'),
            siblings = self.parent().siblings().children('ul'),
            subMenu = parent.next('ul');
        if (!self.hasClass("fm-block")) {
            if (self.hasClass('has-children')) {

            } else {
                siblings.removeClass("in");
                frameMenu.find('.fm-title').removeClass('active');
                frameMenu.find(".frame-fulltop-item").removeClass("active");
                if(!subMenu.hasClass("in"))
                {
                    parent.trigger('click');
                }
                self.addClass('active');
                window.menuActiveId = self.data('id');
                that.set(window.menuActiveId);
            }
        }
        //Sweet_Menu_fullTop 移除顶部展开
        if ($("body").find(".nav-menu-fullTop").length != 0) {
            $("body").find(".nav-menu-fullTop").removeClass("on");
        }
    }
};

module.exports = SweetFrameMenu;
