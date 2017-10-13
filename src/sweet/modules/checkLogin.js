/**
 * SweetCheckLogin 0.1.0
 * Sweet 登录校验组件
 * Released on: 2017/04/07
 * Licensed under MIT
 * 
 * By: 马超群
 *
 */


var SweetCheckLogin = function(params) {
    var s = this;

    var options = $.extend(s.defaults, params || {});

    s.options = options;
    return s;
};


SweetCheckLogin.prototype = {
	// 版本号
    v: '0.1.0',
    // 默认参数
    defaults:{
        itemName:'loginInfo',
    	// 是否使用ajax
    	isAjax:false,
    	// 超时时间
    	expireTime:604800000,
    	// jQuery Ajax 参数
    	ajax:{}
    },
    // 校验
    check: function() {
        var that = this,
        	options = that.options;
        if (options.isAjax) {
            return that.checkAjax(params.ajax);
        } else {
            return that.checkStorage();
        }
    },
    // 通过Storage校验
    checkStorage: function() {
        var itemName = this.options.itemName;
        var timestamp = localStorage.getItem("logintime"),
            nowTime = new Date().getTime(),
            timeDiff = nowTime - timestamp,
            isLogin = false;
        if (timeDiff > 604800000) {
            return false;
        } else {
            return true;
        }
    },
    // 通过ajax校验
    checkAjax: function(params) {
        return SWXHR.GET(params.url, params.params);
    }
};

window.SweetCheckLogin = SweetCheckLogin;

module.exports = window.SweetCheckLogin;
