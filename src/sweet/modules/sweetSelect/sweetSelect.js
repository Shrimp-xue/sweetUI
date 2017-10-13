/**
 * SweetSelect 0.2.0
 * Sweet下拉菜单组件
 * Released on: 2017/04/07
 * Licensed under MIT
 * 
 * By: 胡英军
 * 
 * 更新记录
 * content:
 * 1、增加下拉树状图多选模式
 * time:2017/05/18
 * 
 * 更新记录
 * content:
 * 增加搜索功能
 * time:2017/05/24
 * 
 * 更新记录
 * content:
 * 修复重复实例化bug
 * time:2017/06/02
 *
 * 更新记录
 * content:
 * 增加生命周期回调函数 beforeShow(trees)
 *
 * 更新记录
 * content:
 * 增加多选模式下的渲染多选值时的回调函数onPutNode(data),其中data是返回的全部数据。一个选择的nodes数组
 */

var swZtree = require("swZtree");

$.fn.SweetSelect = function(params, data, currentNode) {
    if (!this[0].swPluginData) this[0].swPluginData = new Object();
    var _this = this[0].swPluginData,
        SweetSelects = [];
    _this.element = $(this);
    _this.ID = "sweetSelect-stree-" + new Date().getTime();
    _this.EL = "sweetSelect-" + new Date().getTime();
    _this.direction = _this.element.data("direction");
    _this.data = data;
    _this.searchData = null;
    _this.params = params;
    _this.currentNode = currentNode;
    _this.searchSelector = "sweetSelect-search";
    _this.defaults = {
        selector: "#" + _this.EL + " .selection-container[aria-expanded]"
    }

    _this.init = function() {
        _this.renderStyle();
    }
    _this.renderStyle = function() {
        _this.selection = _this.element.next('.sweetSelect').length == 0 ? _this.renderHTML().selection_select : _this.element.next('.sweetSelect');
        _this.selection_box = _this.renderHTML().selection_box;
        _this.element.hide();
        _this.element.after(_this.selection);
        _this.initEvents(_this.selection);
    }
    _this.renderHTML = function() {
        var _this = this,
            multiSelect = _this.params.multiSelect;
        if (multiSelect)
            return {
                selection_select: $('<span class="sweetSelect" id="' + _this.EL + '">' + '<span class="selection">' + '<span class="bootstrap-tagsinput selection-mutil selection-container" aria-expanded="false">' + _this.getSelected(currentNode) + '</span>' + '</span>' + '</span>'),
                selection_box: $('<div class="sweetSelect-box">' + '<div class="sw-select-tree">' + '<div sw-select-tree>' + '<div role="form">' + _this.getSearchDom() + '<div id="' + _this.ID + '" class="ztree check"></div>' + '</div>' + '</div>' + '</div>')
            }
        else
            return {
                selection_select: $('<span class="sweetSelect" id="' + _this.EL + '">' + '<span class="selection">' + '<span class="selection-container" onselectstart="return false;" aria-expanded="false">' + '<span class="selection-rendered">' + _this.getSelected(currentNode) + '</span>' + '<span class="selection-arrow"><b></b></span>' + '</span>' + '</span>' + '</span>'),
                selection_box: $('<div class="sweetSelect-box">' + '<div class="sw-select-tree">' + '<div sw-select-tree>' + '<div role="form">' + _this.getSearchDom() + '<div id="' + _this.ID + '" class="ztree"></div>' + '</div>' + '</div>' + '</div>')
            };
    }
    _this.initEvents = function($this) {
        $("body").off().on("click", function(event) {
            var $target = $(event.target),
                _this = window.currentSweetSelect;
            if (!_this) return;
            if ($target.parents(".sweetSelect").length != 0 || $target.parents(".sweetSelect-box").length != 0 || $target.hasClass("sweetSelect-box"))
                return;
            else {
                var status = $(_this.defaults.selector).attr("aria-expanded");
                if (status === "true")
                    $(_this.defaults.selector).trigger('click');
            }
        })
        $(_this.defaults.selector).unbind().on('click', function(event) {
            var $this = $(this),
                _this = $this.parents(".sweetSelect").prev('input')[0].swPluginData,
                $target = $(event.target),
                status = $this.attr("aria-expanded");
            if ($target.data("role") == "remove" && $target.hasClass("sweetSelect-remove")) {
                var id = $target.parent().data("id");
                var obj = new Object();
                obj[_this.params.ss.selectId] = id;
                _this.uncheckByBtn(obj);
                return false;
            } else {
                if (status === "true") {
                    $this.attr("aria-expanded", false)
                    _this.destroy();
                } else if (status === "false") {
                    $this.attr("aria-expanded", true)
                    _this.showBox($this);
                }
            }
        })
    }
    _this.destroy = function() {
        _this.selection_box.remove();
    }
    _this.removeNodeForCurrentNode = function(node) {
        var nodes = _this.currentNode;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i][_this.params.ss.selectId] == node[_this.params.ss.selectId]) {
                nodes.splice(i, 1);
            }
        }
    }
    _this.showBox = function($selection) {
        var offset = $selection.offset(),
            width = $selection.outerWidth(),
            height = $selection.outerHeight(),
            scrollTop = $(window).scrollTop();


        $("body").append(_this.selection_box.css({
            top: (function() {
                if (!_this.direction || _this.direction == 'down')
                    return offset.top + height + 5
                else if (_this.direction == 'top')
                    return offset.top + height + 5
            })(),
            left: offset.left,
            width: width
        }))
        var selectNode = $selection.data("sweetSelected");
        if (selectNode) _this.currentNode = selectNode;
        _this.ztree.init(_this.currentNode);
        _this.searchinit();

        window.currentSweetSelect = _this;
    }
    _this.check = function(treeId) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var checkedNodes = treeObj.getCheckedNodes();
        var returnNodes = _this.ss_CallBack.onPutNode(checkedNodes);
        checkedNodes = (typeof(returnNodes) == "undefined" ? checkedNodes : returnNodes);
        var html = _this.getSelected(checkedNodes);
        $(_this.defaults.selector).html(html);
    }
    _this.uncheck = function(treeId, treeNode) {
        $(_this.defaults.selector).find("span.tag").each(function() {
            var $this = $(this),
                id = $this.attr("data-id");
            if (treeNode[_this.params.ss.selectId] == id) {
                _this.removeNodeForCurrentNode(treeNode);
            }
        })
        var html = _this.getSelected(_this.currentNode);
        $(_this.defaults.selector).html(html);
    }
    _this.uncheckByBtn = function(treeNode) {
        var _this = this;
        var status = $(_this.defaults.selector).attr("aria-expanded");
        var treeObj = $.fn.zTree.getZTreeObj(_this.ID);
        $(_this.defaults.selector).find("span.tag").each(function() {
            var $this = $(this),
                id = $this.attr("data-id");
            if (treeNode[_this.params.ss.selectId] == id) {
                if (status === "true") {
                    treeNode = treeObj.getNodesByParam(_this.params.ss.selectId, treeNode[_this.params.ss.selectId])[0];
                    treeObj.checkNode(treeNode, false, false, true);
                } else {
                    _this.removeNodeForCurrentNode(treeNode);
                    var html = _this.getSelected(_this.currentNode);
                    $(_this.defaults.selector).html(html);
                }
            }
        })
    }
    _this.putValue = function(params) {
        var multiSelect = _this.params.multiSelect;
        if (multiSelect) {
            var result = new Array();
            for (var i = 0; i < params.length; i++) {
                result.push(params[i][_this.params.ss.selectId]);
            }
            _this.element.val(result.join(","));
        } else {
            _this.element.val(params);
        }
    }
    _this.select = function(treeNode) {
        var keyname = _this.params.ss.selectName,
            keyId = _this.params.ss.selectId;
        _this.selection.find(".selection-rendered").html(treeNode[keyname]);
        _this.selection.find(".selection-container").data("sweetSelected", treeNode);
        _this.putValue(treeNode[keyId]);
        $(_this.defaults.selector).trigger('click');
    }
    _this.getSelected = function(treeNode) {
        if (_this.params.multiSelect) {
            if (treeNode) {
                if (_this.currentNode) {
                    treeNode = SWTOOL.mergeArray(_this.currentNode, treeNode, _this.params.ss.selectId);
                }
                _this.currentNode = treeNode;
                var result = "";
                for (var i = 0; i < treeNode.length; i++) {
                    var item = treeNode[i];
                    var span = '<span class="tag label label-info" data-id=' + item[_this.params.ss.selectId] + '>' + item[_this.params.ss.selectName] + '<span data-role="remove" class="sweetSelect-remove"></span>' + '</span>';
                    result = result + span;
                }
                _this.putValue(treeNode);
                return result ? result : "请选择"
            } else {
                _this.element.val("")
                return "请选择";
            }
        } else {
            if (treeNode) {
                _this.element.val(treeNode[_this.params.ss.selectId])
                return treeNode[_this.params.ss.selectName]
            } else {
                _this.element.val("-1")
                return "请选择";
            }
        }
    }
    _this.getSearchDom = function() {
        if (_this.params.search)
            return '<div class="form-group contact-search">' + '<input type="text" id="' + _this.searchSelector + '" class="form-control" placeholder="部门名称">' + '<button type="submit" class="btn btn-white"><i class="iconfont icon-sousuo"></i></button>' + '</div>' + '</div>'

        return "";
    }
    _this.search = function(keyword) {
        var options = _this.params.search,
            url = options.url.replace(/\{keyword}/g, keyword),
            type = options.type,
            responseHandler = options.responseHandler,
            data = options.data;
        if (keyword) {
            SWXHR[type](url, data, "JSON").done(function(data) {
                _this.searchData = responseHandler(data);
                _this.ztree.init(_this.currentNode);
            })
        } else {
            _this.searchData = null;
            _this.ztree.init(_this.currentNode);
        }

    }
    _this.searchinit = function() {
        var $search = $("#" + _this.searchSelector),
            treeObj = $.fn.zTree.getZTreeObj(_this.ztree.el.replace("#", "")),
            oldAllNodes = treeObj.getNodes();
        $search.val("");
        $search.off().on('input', function() {
            var $this = $(this),
                keyword = $this.val();
            _this.search(keyword);

        })
    }
    _this.ztree = {
        el: "#" + _this.ID,
        init: function(treeNode) {
            var that = this;
            that.stree = that.handler();
            var multiSelect = _this.params.multiSelect;
            if (multiSelect)
                that.expandNodeByChecked(that.stree, treeNode);
            else
                that.expandNodeBySelected(that.stree, treeNode);
        },
        handler: function() {
            var that = this,
                swdata = {};
            if (_this.params.multiSelect)
                that.option = {
                    callback: {
                        onClick: function(treeNode) {
                            _this.ss_CallBack.onClick(that.stree, treeNode);
                            return false;
                        },
                        onCheck: function(event, treeId, treeNode) {
                            if (treeNode.checked)
                                _this.check(treeId, treeNode);
                            else
                                _this.uncheck(treeId, treeNode)

                        }
                    },
                    check: {
                        autoCheckTrigger: true,
                        enable: true,
                        chkboxType: { "Y": "", "N": "" },
                        chkStyle: "checkbox"
                    },
                    data: _this.params.st ? _this.params.st.data : {}
                }
            else
                that.option = {
                    swdata: {
                        callback: {
                            onClick: function(treeNode) {
                                _this.ss_CallBack.onClick(that.stree, treeNode);
                                _this.select(treeNode);
                            }
                        }
                    },
                    data: _this.params.st ? _this.params.st.data : {}
                }
            var data = _this.searchData ? _this.searchData : _this.data;
            _this.searchData = null;

            if (_this.params.st) $.extend(true, that.option, _this.params.st);
            return swZtree.init(data, that.el, that.option);
        },
        expandNodeBySelected: function(stree, currentNode) {
            var that = this;
            if (currentNode) {
                var node = stree.getNodesByParam(_this.params.ss.selectId, currentNode[_this.params.ss.selectId])[0];
                if (node) {
                    var parents = node.getPath();
                    if (_this.ss_CallBack.beforeShow(stree))
                        stree.expandNode(parents[0], true, true);
                    $('#' + node.tId).addClass('selectNode');
                }
            } else
                _this.ss_CallBack.beforeShow(stree)

        },
        expandNodeByChecked: function(stree, currentNode) {
            var that = this;
            if (currentNode) {
                for (var i = 0; i < currentNode.length; i++) {
                    var node = stree.getNodesByParam(_this.params.ss.selectId, currentNode[i][_this.params.ss.selectId])[0];
                    if (node) {
                        stree.checkNode(node, true, false, false);

                        var parents = node.getPath();
                        if (_this.ss_CallBack.beforeShow(stree))
                            stree.expandNode(parents[0], true, false);
                    }

                }
            } else
                _this.ss_CallBack.beforeShow(stree)
        },
        showNode: function(nodes) {
            console.log(nodes);
            var that = this;
            that.stree.showNodes(nodes);
        },
        hideNode: function(nodes) {
            var that = this;
            that.stree.hideNodes(nodes);
        },
        refresh: function(data) {
            var that = this;
            $.fn.zTree.destroy(that.el.replace("#", ""));
            return swZtree.init(data, that.el, that.option);
        }
    }
    _this.ss_CallBack = {
        'onClick': function(stree, treeNode) {
            if (_this.params.ss.callback && typeof(_this.params.ss.callback.onClick) == "function") {
                var result = _this.params.ss.callback.onClick(stree, treeNode)
            }
            return result;

        },
        'beforeShow': function(stree) {
            if (_this.params.ss.callback && typeof(_this.params.ss.callback.beforeShow) == "function") {
                var result = _this.params.ss.callback.beforeShow(stree);
            }
            return result;

        },
        'onPutNode': function(nodes) {
            if (_this.params.ss.callback && typeof(_this.params.ss.callback.onPutNode) == "function") {
                var result = _this.params.ss.callback.onPutNode(nodes);
            }
            return result;
        }
    }

    //优化写法，不要用this来存储数据，只能提供方法

    //隐藏下拉框
    this.hide = function() {

    }


    _this.init();
}