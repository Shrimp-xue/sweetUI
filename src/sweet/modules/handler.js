/*
 * =====================================
 * name    : sweetHandler 框架组件处理器
 * version : v2.0.0
 * time    : 2017-08-30 16:29:13
 * auth    : huyingjun
 * e-mail  : yingjun.hu@geely.com
 * =====================================
 */

require('jquertSelect2');
require('selectZh');
require('switchery');
require('bootstrapSelect');
require('notify');
require("touchspin");
require("tooltip");
require('sweetDemoBox');

var sweetlinkMap = require("sweetlinkMap");

//插件集合
class plugins {
    demobox(container, el, options){
        el = el ? el : '[sw-plugin="demoBox"]';
        let ob = $(container).find(el),
            option = {
                toggleElement:'.toggerContainer',
                hide:true,
                time:200
            }
        $.extend(true, option, options);
        ob.sweetDemoBox(option);
    }
    lazyImg(container, el, options) {
        el = el ? el : '[sw-lazy-img]';
        let ob = $(container).find(el);
        if (ob.length === 0) return false;
        let textovfs = [];

        ob.each(function() {
            let $this = $(this),
                successImg = $this.data("src");
            var img = new Image();
            img.src = successImg;
            img.onload = function() {
                $this.attr("src", successImg);
            }
        })
    }
    textovf(container, el, options) {
        el = el ? el : '[textovf]';
        let ob = $(container).find(el);
        if (ob.length === 0) return false;
        let textovfs = [];
        ob.each(function() {
            let $this = $(this),
                number = $(this).attr("textovf"),
                result = $(this).text();
            if (result.length > number && number > 0) {
                result = result.substring(0, number) + "...";
            }
            $(this).text(result);
        })
    }
    tooltip(container, el, options) {
        el = el ? el : '[data-toggle="tooltip"]';
        let ob = $(container).find(el);
        if (ob.length === 0) return false;
        let tooltips = [];
        ob.each(function() {
            let $this = $(this);
            let option = {};
            $.extend(true, option, $this.data(), options);
            var tooltip = $this.tooltip()
            tooltips.push(tooltip);
        })

        return tooltips;
    }
    touchspin(container, el, options) {
        el = el ? el : '[sw-plugin="touchspin"]';
        let ob = $(container).find(el);
        if (ob.length === 0) return false;
        let touchspins = [];
        ob.each(function() {
            let $this = $(this);
            let option = {
                verticalbuttons: true,
                verticalupclass: 'iconfont icon-xiangshang_jiantou',
                verticaldownclass: 'iconfont icon-xiangxiajiantou',
            }
            $.extend(true, option, $this.data(), options);
            var touchspin = $this.TouchSpin(option)
            touchspins.push(touchspin);
        })
        return touchspins;
    }
    select(container, el, options) {
        el = el ? el : '[sui-selectpicker]';
        let ob = $(container).find(el);
        if (ob.length === 0) return false;

        return $(ob).selectpicker(options);
    }
    select2(container, el, options) {
        el = el ? el : '[sui-select]';
        let ob = $(container).find(el);
        if (ob.length === 0) return false;
        let select2s = [];

        ob.each(function() {
            let $this = $(this);
            let color = $this.attr('data-style') ? $this.attr('data-style') : "default",
                showTick = $this.hasClass('show-tick') ? "show-tick" : "",
                theme = color + " " + showTick,
                showSearch = $this.attr('data-search'),
                placeholder = $this.attr("placeholder") ? $this.attr("placeholder") : "",
                ismultiple = $this.attr("multiple"),
                maximumSelectionLength = $this.attr("mulnum"),
                option = {
                    language: "zh-CN",
                    theme: theme,
                    minimumInputLength: 0 //至少输入几个字符才显示
                };
            if (!showSearch) option.minimumResultsForSearch = Infinity;
            if (placeholder) option.placeholder = placeholder;
            if (maximumSelectionLength) option.maximumSelectionLength = maximumSelectionLength;

            // console.log(option);

            $.extend(true, option, $this.data(), options);
            var select2 = $this.select2(option);
            $this.data("sweetSelect2",select2);

            select2s.push(select2);
        })
        return select2s;
    }
    switchery(container, el, options) {
        el = el ? el : "[data-plugin='switchery']";
        let ob = $(container).find(el);
        if (ob.length === 0) return false;
        let switcherys = [];

        ob.each(function() {
            let $this = $(this);
            var color = $this.attr("data-color"),
                size = $this.attr("data-size"),
                secondaryColor = $this.attr("data-secondary-color");
            var opt = {
                color: color,
                size: size,
                secondaryColor: secondaryColor ? secondaryColor : "#CBCBCB"
            }
            if ($this.next().hasClass("switchery")) {
                $this.next().remove();
            }
            var switchery = new Switchery(this, opt);
            $this.data("sweetHandler", switchery);
            switcherys.push(switchery)
        });
        return switcherys;
    }
    tagsinput(container, el, options) {
        el = el ? el : "input[data-role=tagsinput], select[multiple][data-role=tagsinput]";
        let ob = $(container).find(el);
        let opt = {};
        if (ob.length === 0) return false;

        ob.each(function() {
            let $this = $(this);
            $.extend(true, opt, $this.data(), options);
            $this.tagsinput();
        });
    }
    notify(container, el, options) {
        el = el ? el : "[sw-plugin='notify']";
        let _this = this;
        let ob = $(container).find(el);
        if (ob.length === 0) return false;
        let notifys = [],
            opt = {
                type: "info",
                position: "right top",
                title: "消息提醒",
                text: "消息提醒"
            };
        //添加样式
        this.addStyle = function() {
            $.notify.addStyle("metro", {
                html: "<div>" +
                    "<div class='image' data-notify-html='image'/>" +
                    "<div class='text-wrapper'>" +
                    "<div class='title' data-notify-html='title'/>" +
                    "<div class='text' data-notify-html='text'/>" +
                    "</div>" +
                    "</div>",
                classes: {
                    default: {
                        "color": "#fafafa !important",
                        "background-color": "#ABB7B7",
                        "border": "1px solid #ABB7B7"
                    },
                    error: {
                        "color": "#fafafa !important",
                        "background-color": "#f05050",
                        "border": "1px solid #ef5350"
                    },
                    custom: {
                        "color": "#fafafa !important",
                        "background-color": "#5fbeaa",
                        "border": "1px solid #5fbeaa"
                    },
                    success: {
                        "color": "#fafafa !important",
                        "background-color": "#81c868",
                        "border": "1px solid #33b86c"
                    },
                    info: {
                        "color": "#fafafa !important",
                        "background-color": "#34d3eb",
                        "border": "1px solid #29b6f6"
                    },
                    warning: {
                        "color": "#fafafa !important",
                        "background-color": "#ffbd4a",
                        "border": "1px solid #ffd740"
                    },
                    black: {
                        "color": "#fafafa !important",
                        "background-color": "#4c5667",
                        "border": "1px solid #212121"
                    },
                    white: {
                        "background-color": "#e6eaed",
                        "border": "1px solid #ddd"
                    }
                }
            });
        }
        //构建
        this.buildSwNotify = function() {
            var Notification = function() {};

            //simple notificaiton
            Notification.prototype.notify = function(style, position, title, text) {
                    var icon = 'fa fa-adjust';
                    if (style == "error") {
                        icon = "fa fa-exclamation";
                    } else if (style == "warning") {
                        icon = "fa fa-warning";
                    } else if (style == "success") {
                        icon = "fa fa-check";
                    } else if (style == "custom") {
                        icon = "fa fa-album";
                    } else if (style == "info") {
                        icon = "fa fa-question";
                    } else {
                        icon = "fa fa-adjust";
                    }
                    $.notify({
                        title: title,
                        text: text,
                        image: "<i class='" + icon + "'></i>"
                    }, {
                        style: 'metro',
                        className: style,
                        globalPosition: position,
                        showAnimation: "show",
                        showDuration: 0,
                        hideDuration: 0,
                        autoHide: true,
                        clickToHide: true
                    });
                },

                //auto hide notification
                Notification.prototype.autoHideNotify = function(style, position, title, text) {
                    var icon = "fa fa-adjust";
                    if (style == "error") {
                        icon = "fa fa-exclamation";
                    } else if (style == "warning") {
                        icon = "fa fa-warning";
                    } else if (style == "success") {
                        icon = "fa fa-check";
                    } else if (style == "custom") {
                        icon = "md md-album";
                    } else if (style == "info") {
                        icon = "fa fa-question";
                    } else {
                        icon = "fa fa-adjust";
                    }
                    $.notify({
                        title: title,
                        text: text,
                        image: "<i class='" + icon + "'></i>"
                    }, {
                        style: 'metro',
                        className: style,
                        globalPosition: position,
                        showAnimation: "show",
                        showDuration: 0,
                        hideDuration: 0,
                        autoHideDelay: 5000,
                        autoHide: true,
                        clickToHide: true
                    });
                },
                //confirmation notification
                Notification.prototype.confirm = function(style, position, title) {
                    var icon = "fa fa-adjust";
                    if (style == "error") {
                        icon = "fa fa-exclamation";
                    } else if (style == "warning") {
                        icon = "fa fa-warning";
                    } else if (style == "success") {
                        icon = "fa fa-check";
                    } else if (style == "custom") {
                        icon = "md md-album";
                    } else if (style == "info") {
                        icon = "fa fa-question";
                    } else {
                        icon = "fa fa-adjust";
                    }
                    $.notify({
                        title: title,
                        text: 'Are you sure you want to do nothing?<div class="clearfix"></div><br><a class="btn btn-sm btn-white yes">Yes</a> <a class="btn btn-sm btn-danger no">No</a>',
                        image: "<i class='" + icon + "'></i>"
                    }, {
                        style: 'metro',
                        className: style,
                        globalPosition: position,
                        showAnimation: "show",
                        showDuration: 0,
                        hideDuration: 0,
                        autoHide: false,
                        clickToHide: false
                    });
                    //listen for click events from this style
                    $(document).off().on('click', '.notifyjs-metro-base .no', function() {
                        //programmatically trigger propogating hide event
                        $(this).trigger('notify-hide');
                    });
                    $(document).off().on('click', '.notifyjs-metro-base .yes', function() {
                        //show button text
                        alert($(this).text() + " clicked!");
                        //hide notification
                        $(this).trigger('notify-hide');
                    });
                },
                //init - examples
                Notification.prototype.init = function() {

                },
                //init
                $.Notification = new Notification, $.Notification.Constructor = Notification
        }
        //处理
        this.handler = function($this, options) {
            let _this = this;
            $this.off().on('click', function() {
                var op = options,
                    $this = $(this),
                    _type = $this.attr('data-type'),
                    _title = $this.attr('data-title'),
                    _text = $this.attr('data-text'),
                    type = _type ? _type : op.type,
                    position = op.position,
                    title = _title ? _title : op.title,
                    text = _text ? _text : op.text;
                $.Notification.notify(type, position, title, text);
            })
        }

        this.addStyle();
        this.buildSwNotify();

        ob.each(function() {
            let $this = $(this);
            $.extend(true, opt, $this.data(), options);
            _this.handler($this, opt);
        });
    }
    linkMap(container, el, options) {
        el = "[sw-map]";
        let ob = $(container ? container : "body").find(el);
        let opt = {};
        if (ob.length === 0) return false;
        ob.each(function() {
            let $this = $(this);
            sweetlinkMap.init($this);
        });
    }
}

//处理器
const sweetHandler = class sweetHandler extends plugins {
    init(container, el, options) {
        container = container ? container : "body";
        let arr = [
            "select2",
            "switchery",
            "select",
            "tagsinput",
            "notify",
            "linkMap",
            "touchspin",
            "tooltip",
            "textovf",
            "lazyImg",
            "demobox"
        ];
        this.initPlugins(arr, container, el, options);
    }
    initPlugins(array, container, el, options) {
        let _this = this;
        for (var i = 0; i < array.length; i++) {
            var name=array[i].split(":")[0],
                _el=array[i].split(":")[1];
            _this[array[i]](container,_el?_el:el, options);
        }
    }
    destroy(type){

    }
}

module.exports = new sweetHandler();