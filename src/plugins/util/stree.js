//引入依赖
var ztree = require("ztree");


var sTree = {
    el:null,
    option: {
        view: {
            showIcon: false,
            autoCancelSelected: false,
            dblClickExpand: false,
            showLine: false
        },
        callback: {
            onClick: function(e, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(sTree.el);
                zTree.expandNode(treeNode);
                return false;

            },
            onNodeCreated: function(event, treeId, treeNode) {
                console.log(treeNode);
                var haschild = treeNode.children,
                    $this = $('#' + treeNode.tId + '_a');
                if (!haschild) {
                    console.log($this);
                    $this.addClass('nochildNode');
                    $this.prev().remove();
                }

            }
        }

    },
    init: function(obj, option, datanode) {
        var _this = this;
        _this.el=obj.attr('id');
        _this.run(obj, option, datanode);
    },
    run: function(obj, option, datanode) {
        var _this = this;
        $.extend(true, _this.option, option);
        console.log(_this.option);
        $.fn.zTree.init(obj, _this.option, datanode);

    }
}
module.exports = sTree;
