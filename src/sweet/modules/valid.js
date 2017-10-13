var validform = require("jqueryValidform");


var SweetValid = function(container, params) {
    if (!(this instanceof SweetValid)) return new SweetValid(container, params);
    var v = this;

    // 默认配置
    var defaults = {
        validType: 'newLine',
        msgIcon: 'ion-alert-circled',
        msgHtml: function(msg) {
            var ico = defaults.msgIcon ? '<i class="' + defaults.msgIcon + '"></i>' : "";
            return '<div class="sw-valid-msg">' + ico + ' <span class="msg-txt">' + msg + '</span></div>';
        },
        successHtml: function(msg) {
            return;
        },
        tiptype: function(msg, o, cssctl) {

            switch (o.type) {
                case 1:
                    // 正在检测/提交数据
                    break;
                case 2:
                    // 通过验证
                    v.validState.success(msg, o, cssctl);
                    break;
                case 3:
                    // 验证失败
                    v.validState.fail(msg, o, cssctl);
                    break;
                case 4:
                    //提示ignore状态
                    break;
            }
        }
    };

    var options = $.extend(defaults, params || {});
    v.options = options;
    v.container = $(container);

    if (v.container.length === 0) return;
    if (v.container.length > 1) {
        var SweetValids = [];
        v.container.each(function() {
            var container = this;
            SweetValids.push(new SweetValid(this, params));
        });
        return SweetValids;
    }

    // 渲染结构
    v.renderer = function() {
        v.container.find('[validtype]').each(function(index, el) {
            var self = $(this),
                mode = self.data('mode'),
                displayCls = mode ? mode : '';
            self.wrap('<div class="sw-validbox ' + displayCls + '"><div class="sw-valid-input"></div></div>');
        });

    };

    // 校验消息提示类型
    /*v.validType = {
        newLine: {
            
        }
    };*/

    // 校验状态处理
    v.validState = {
        success: function(msg, o, cssctl) {
            var inputBox = o.obj.parents('.sw-validbox');
            inputBox.removeClass('has-error').addClass('has-success').find('.sw-valid-msg').remove();
        },
        fail: function(msg, o, cssctl) {
            var inputBox = o.obj.parents('.sw-validbox');
            inputBox.removeClass('has-success').addClass('has-error');
            var msgBox = inputBox.find('.sw-valid-msg');
            if (msgBox.length > 0) {
                msgBox.find('.msg-txt').text(msg);
            } else {
                inputBox.append(options.msgHtml(msg));
            }

        }
    };

    // 初始化
    v.init = function() {
        v.renderer();
        v.Validform = v.container.Validform(options);
    };

    v.init();

    return v;
};

SweetValid.prototype = {
    
    check: function(bool,selector) {
        return this.Validform.check(bool,selector) && this.container.find('.Validform_error').length === 0;
    }
};

module.exports = SweetValid;
