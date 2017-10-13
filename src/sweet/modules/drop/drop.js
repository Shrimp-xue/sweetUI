/**
 * drop 0.1.0
 * Sweet弹出浮动层
 * Released on: 2017/05/12
 * Licensed under MIT
 * 
 * By: 马超群
 * Email：mchqun@126.com
 *
 */


require('./style.less');



var sweetDrop = function(el, params) {
    if (!(this instanceof sweetDrop)) return new sweetDrop(container, params);
    var defaults = {
        // 指定父容器
        container: '',
        // 弹出层标题
        title: '',
        // 弹出层图标
        icon: '',
        // 弹出层内容
        content: '',
        // 弹出层内容区域大小，数组模式，第一个为宽度，第二个为高度
        contentArea: [],
        // 触发操作，默认为click
        openEvent: 'click',
        // 按钮文本
        btns: [],
        // 按钮样式
        btnClass: [],
        // 按钮方法
        btnFn: [],
        // 滚动消失时，所触发的滚动容器
        scrollBody: '#frameMain',
        // layer参数
        layerOption: {
            skin: 'layer-drop',
            tips: [1, '#FFF'],
            time: 0,
            area: ['auto', 'auto']
        },
        onOpen: function() {
            return false;
        },
        onClose: function() {
            return false;
        },
        openSuccess:function () {
            return false;
        }
    };

    var s = this,
        body = $('body');

    params = $.extend(true, defaults, params || {});

    if (typeof el === 'string') {
        params.target = el;
        s.selector = params.container ? $(params.container).find(el) : $(el);
    } else {
        s.selector = $(el);
    }

    


    if (s.selector.length === 0) return false;
    if (s.selector.length > 1) {
        var selectors = [];
        s.selector.each(function() {
            selectors.push(new sweetDrop(this, params));
        });
        return selectors;
    }

    params.dropId = window.sweetDropId ? window.sweetDropId + 1 : 1;

    s.dropId = params.dropId;
    window.sweetDropId = params.dropId;
    // console.log(window.sweetDropId);
    s.params = params;
    s.dropElement = '#sw-drop-item-' + s.dropId;
    s.data = s.selector.data();
    body.attr('sweet-drop', s.dropId);
    s.selector.addClass('sw-drop-item sw-drop-handle-' + s.dropId);

    s.init();
    // console.log(s.params);
    return s;
};

sweetDrop.prototype = {
    v: '0.1.0',
    constructor: sweetDrop,
    init: function() {
        this.bindHandle();
        this.events();
    },
    bindHandle: function() {
        var that = this,
            params = that.params;
        that.selector.on(params.openEvent, function() {
            that.open();
        });
    },
    events: function() {
        var that = this;
        /*$("#frameMain").on('scroll', function() {
            that.close(that.layerIdx);
        });*/

        if (that.params.scrollBody) {
            $(that.params.scrollBody).on('scroll', function() {
                that.close(that.layerIdx);
            });
        }


        if (!that.dropEventFlag) {
            $(document).on('click', function(ev) {
                var target = $(ev.target);
                if (!target.hasClass('sw-drop-item') && target.parents(".layer-drop").length === 0) {
                    var layerDrop = $(".layer-drop");
                    if (layerDrop.length > 0) {
                        var layerIdx = layerDrop.attr('id').replace('layui-layer', '');
                        that.close(layerIdx);
                    }
                }
                that.dropEventFlag = true;


            });
        }

    },
    open: function() {
        var that = this,
            opt = that.params,
            content = typeof opt.content === 'function' ? opt.content(that) : opt.content,
            data = {
                title: opt.title,
                content: content,
                contentArea: opt.contentArea,
                dropId: that.dropId,
                icon: opt.icon,
                className: opt.className,
                btns: opt.btns,
                btnClass: opt.btnClass
            };

        if (typeof opt.onOpen === 'function') opt.layerOption.success = opt.onOpen.bind(that);
        
        opt.contentBody = require('./tpl.html')(data);
        that.layerIdx = layer.tips(opt.contentBody, ".sw-drop-handle-" + that.dropId, opt.layerOption);
        $(that.dropElement).find('.sw-drop-foot').on('click', '.btn', function(ev) {
            var self = $(this),
                btnIdx = self.index();
            if (typeof opt.btnFn[btnIdx] === 'function') opt.btnFn[btnIdx](that, ev);
        });

        $(that.dropElement).on('click', '.close', function() {
            that.close(that.layerIdx);
        });
    },
    close: function(layerIdx) {
        var that = this;
        layerIdx = layerIdx ? layerIdx : that.layerIdx;
        layer.close(layerIdx);
        if (typeof that.params.onClose === 'function') that.params.onClose();
    }
};

module.exports = sweetDrop;
