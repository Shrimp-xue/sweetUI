//sui-select



var jquertSelect2 = require("jquertSelect2");
var zh = require("selectZh");
var action = {
    init: function($this, options) {
        var color = $this.attr('data-style') ? $this.attr('data-style') : "default",
            showTick = $this.hasClass('show-tick') ? "show-tick" : "",
            theme = color + " " + showTick,
            showSearch = $this.attr('data-search'),
            placeholder = $this.attr("placeholder") ? $this.attr("placeholder") : "",
            ismultiple = $this.attr("multiple"),
            maximumSelectionLength = $this.attr("mulnum"),
            option = {
                language: "zh",
                theme: theme,
                minimumInputLength: 0 //至少输入几个字符才显示
            };
        if (!showSearch) option["minimumResultsForSearch"] = Infinity;
        if (placeholder) option["placeholder"] = "请选择";
        if (maximumSelectionLength) option["maximumSelectionLength"] = maximumSelectionLength;

        // console.log(option);

        $.extend(true, option, options);


        $this.select2(option);
    },
    run: function(option) {

    }
}
module.exports = action;
