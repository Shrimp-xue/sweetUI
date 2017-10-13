/**
 * evaluate.js
 * @Author: huyingjun
 * @Date:   2017-01-06 15:55:49
 * @Last Modified by:   huyingjun
 * @Last Modified time: 2017-01-06 16:18:12
 */





var action = {
    el: "[sui-evaluate]",
    li: function(a) {
        var tag = '';
        if (a == 1) {
            tag = 'fa-star'
        } else if (a == 0) {
            tag = 'fa-star-o'
        } else {
            tag = 'fa-star-half-o';
        }
        var li = "<li><a class='fa " + tag + "'></a></li>";
        return li;
    },
    xround: function(x, num) {
        return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
    },
    init: function() {
        var _this = this;
        _this.run();
    },
    handler: function() {
        var $this = $(this),
            num = $this.attr("sui-evaluate") / 20,
            num1 = action.xround(num, 2).toString(),
            num2 = parseFloat(num1.split(".")[0]),
            num3 = parseFloat("0." + num1.split(".")[1]);
        console.log(num2 + num3);
        var ul = '<ul class="evaluate list-inline"></ul>';
        $this.append(ul);

        for (var i = 1; i <= 5; i++) {
            if (num2 >= i || num == 5) {
                var li = action.li(1);
            } else if (num3 >= 0.5) {
                var li = action.li(2);
                num3=0;
            } else {
                var li = action.li(0);
            }
            $this.children('.evaluate').append(li)
        }

    },
    run: function() {
        var _this = this;
        $(_this.el).each(_this.handler)
    }
}

module.exports = action;
