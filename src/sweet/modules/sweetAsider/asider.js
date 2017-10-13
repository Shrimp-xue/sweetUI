/**
 * asider 0.1.0
 * Sweet滑出侧边栏组件
 * Released on: 2017/04/07
 * Licensed under MIT
 * 
 * By: 马超群、胡英军
 * Email：mchqun@126.com
 *
 * 更新记录
 * content:
 * 增加元素权限，可以设置点击到哪些元素不关闭slider。
 * by:胡英军
 * time:2017-07-05
 */
var Class = function(params) {
    var that = this;
    //点击元素权限检测
    var checkClick = function($target) {
        var exclude = that.options.exclude,
            result = false,
            status = that.getStatus();
        if (status && el.parents("#SWSliders").length === 0 && el.parents(".sweetSelect-box").length === 0)
            result = true;

        if (exclude && exclude.length !== 0 && exclude[0]) {
            for (var i = 0; i < exclude.length; i++) {
                var selector = exclude[i];
                if ($target.parents(selector).length !== 0)
                    result = false;
            }
        }
        return result;
    };
    that.index = ++slider.index;
    that.options = $.extend({}, that.defaults, params);

    if (document.body) {
        that.create();
        that.show();
    } else {
        setTimeout(function() {
            that.create();
            that.show();
        }, 30);
    }
    $("html.sweet-slider-open").off().on('click', function(ev) {
        el = $(ev.target);
        var bool = checkClick(el);
        if (bool) {
            if (!that.stepBefore)
                that.closeAll();
        }
        return;
    });
};
Class.prototype = {
    v: '0.1.0',
    constructor: Class,
    stepBefore: 0,
    defaults: {
        width: '40%',
        maxWidth: '400px',
        zIndex: 1100,
        title: '我是标题',
        activeEvent: 'click',
        btns: ['按钮1', '按钮2', '关闭'],
        btnsClass: [],
        btnFn: [function() {
            SWTOOL.layer.success("我是按钮1");
        }, function() {
            SWTOOL.layer.success("我是按钮2");
        }],
        single: true,
        onInit: function() {
            return false;
        },
        onOpen: function() {
            return false;
        },
        onClose: function() {
            return false;
        },
        content: '欢迎使用SweetAsider组件',
        events: {}
    },
    // 滑出侧边栏
    show: function(params) {
        var that = this,
            options = that.options;
        if (typeof that.options.onInit === 'function') that.options.onInit();

        that.sliders.addClass('on');
        $("html").addClass("sweet-slider-open");
        setTimeout(function() {
            that.slider.addClass('active');
            if (typeof options.onOpen === 'function') options.onOpen(that);
            if (typeof callback === 'function') callback();
        }, 10);
    },
    // 关闭侧边栏
    close: function(index, callback) {
        var that = this,
            options = that.options;

        index = index ? index : that.index;
        console.log(index);
        $('#SWSlider_' + index).removeClass('active');
        $("html").removeClass("sweet-slider-open");
        setTimeout(function() {
            that.sliders.removeClass('on');
            if (typeof options.onClose === 'function') options.onClose(that);
            if (typeof callback === 'function') callback();
            that.sliders.find(that.slider).remove();
        }, 300);

    },
    closeAll: function(callback) {
        var that = this,
            options = that.options;

        that.sliders.find('.sw-slider').removeClass('active');
        $("html").removeClass("sweet-slider-open");
        setTimeout(function() {
            that.sliders.removeClass('on');
            if (typeof options.onClose === 'function') options.onClose(that);
            if (typeof callback === 'function') callback();
            that.sliders.empty();
        }, 300);
    },
    // 主体内容渲染
    loadContent: function(content) {
        var that = this;
        that.interceptor("reload");
        content = content ? content : that.options.content;

        if (that.sliderBody.length) {
            that.sliderBody.html(content);
        } else {
            console.error('侧边栏主体未生成！');
        }
    },
    // 事件集合
    events: function(slider) {
        var that = this,
            sliderInner = that.slider.find('.sw-slider-inner');
        sliderInner.on('click', '.sw-close', function() { that.close(that.index); });
        sliderInner.on('click', '.sw-slider-foot button', function() {
            var self = $(this),
                fn = that.options.btnFn[self.index()];

            if (typeof fn === 'function') fn(that);
        });

        $.each(that.options.events, function(index, val) {
            var arr = index.split(' ');
            sliderInner.on(arr[0], arr[1], val);
        });
    },
    // 渲染侧边栏
    create: function(index) {

        var that = this,
            options = that.options,
            content = options.content ? options.content : '',
            btnsHtml = '';

        if ($("#SWSliders").length === 0) $('body').append('<div class="sw-sliders" id="SWSliders" style="width:' + that.options.width + '; max-width:' + that.options.maxWidth + '; z-index:' + that.options.zIndex + ';"></div>');
        else $("#SWSliders").css({
            width: that.options.width,
            maxWidth: that.options.maxWidth,
            zIndex: that.options.zIndex
        });

        that.sliders = $("#SWSliders");

        if (index) $('#SWSlider_' + index).empty();

        // 按钮
        if (options.btns.length > 0) {
            for (var i = 0; i < options.btns.length; i++) {
                var btnsClass = options.btnsClass[i] || "btn-default";
                btnsHtml += '<button class="btn waves-effect waves-light ' + btnsClass + '">' + options.btns[i] + '</button>';
            }
        }

        var headHtml = '<div class="sw-slider-head"><div class="sw-slider-head-inner">' +
            '<span class="sw-slider-head-title">' + options.title + '</span>' +
            '<a href="javascript:;" class="sw-slider-head-close sw-close"><i class="ion ion-close"></i></a>' +
            '</div></div>',
            footHtml = '<div class="sw-slider-foot"><div class="sw-slider-foot-inner">' + btnsHtml + '</div></div>',
            html = '<div class="sw-slider-inner">' + headHtml + '<div class="sw-slider-body">' + content + '</div>' + footHtml + '</div>';

        if (!index) {
            html = '<div class="sw-slider" id="SWSlider_' + that.index + '">' + html + '</div>';
            that.sliders.append(html);
            that.slider = $('#SWSlider_' + that.index);
        } else {
            that.slider.html(html);
        }
        that.sliderBody = that.slider.find('.sw-slider-body');
        that.events(that);
        that.slider.data("sweetAsider", that);
    },
    //重新加载 改变内容和按钮以及配置项
    reload: function(params) {
        var that = this;
        that.interceptor("reload");
        that.options = $.extend({}, that.options, params);

        that.create(that.index);
        if (typeof params.onOpen !== 'function') {
            that.options.onOpen = '';
        } else {
            that.options.onOpen(that);
        }
    },
    //获取状态
    getStatus: function() {
        var that = this;
        return that.slider.hasClass('active');
    },
    // 销毁
    destroy: function() {
        this.slider.empty();
        this.slider = null;
        $('.sw-slider').remove();
        this.options = null;
    },
    //拦截器 延迟 30ms
    interceptor: function(status) {
        var that = this;
        that.stepBefore = status;
        setTimeout(function() {
            that.stepBefore = 0;
        }, 30);
    }
};

var slider = {
    index: 0,
    open: function(params) {
        var o = new Class(params);
        return o;
    }
};
module.exports = slider;