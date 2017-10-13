/**
 * SweetFrameBox 0.1.0
 * Sweet框架组件
 * Released on: 2017/04/07
 * Licensed under MIT
 * 
 * By: Mcqun
 *
 */

var SweetFrameBox = function(element, params) {
    var s = this;

    var options = $.extend(s.defaults, params || {});

    s.options = options;
    s.element = $(element);

    if (s.element.length === 0) return;


    s.init.apply(s, arguments);
    return s;
};

SweetFrameBox.prototype = {
    v: '0.1.0',
    constructor: SweetFrameBox,
    defaults: {
        groupMode:true
    },
    init: function() {
        
    },
    renderer:function(){
        
    }
};

module.exports = window.SweetFrameBox;
