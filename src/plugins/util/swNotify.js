var notify = require("notify");

var action = {
    el:"[sw-plugin='notify']",
    option:{
        type:"info",
        position:"right top",
        title:"消息提醒",
        text:"消息提醒"
    },
    init: function() {
        var _this = this;
        _this.addStyle();
        _this.buildSwNotify();
        _this.handler();
    },
    addStyle: function() {
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
    },
    buildSwNotify: function() {
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
                $(document).on('click', '.notifyjs-metro-base .no', function() {
                    //programmatically trigger propogating hide event
                    $(this).trigger('notify-hide');
                });
                $(document).on('click', '.notifyjs-metro-base .yes', function() {
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
    },
    handler:function(){
        var _this=this;
        $(_this.el).on('click',function(){
            var op=_this.option,
                $this=$(this),
                _type=$this.attr('data-type'),
                _title=$this.attr('data-title'),
                _text=$this.attr('data-text'),
                type=_type?_type:op.type,
                position=op.position,
                title=_title?_title:op.title,
                text=_text?_text:op.text;
            $.Notification.notify(type,position,title,text);
        })
    }
}


module.exports = action;
