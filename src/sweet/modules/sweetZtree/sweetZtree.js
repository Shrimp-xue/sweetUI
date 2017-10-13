var ztree = require("ztree");

var sweetZtreeAction = {
    bufferPool: [],
    getDefaultOption: function(option_data) {
        var _this=this;
        return {
            view: {
                showIcon: false,
                autoCancelSelected: true,
                dblClickExpand: false,
                showLine: false,
                selectedMulti: false,
                addDiyDom: function(treeId, treeNode) {
                    var option_li="";
                    if(!option_data.swdata)return;
                    if(treeNode.esoption_li)
                    option_li=treeNode.esoption_li;
                    else if(typeof(option_data.swdata.option_li)=="function")
                    option_li=option_data.swdata.option_li(treeId, treeNode);
                    else
                    option_li=option_data.swdata.option_li
                    var aObj = $("#" + treeNode.tId + "_a");
                    var isSelect = aObj.parent().hasClass("selectNode");
                    if (!isSelect) {
                        var editStr = $('<div class="sw_ed_hover dropdown" id="' + treeNode.tId + '_hoverbox">\
                                <a class="dropdown-toggle" role="button" id="' + treeNode.tId + '_hover_a" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                                    <i class="ion-arrow-down-b sw_ed_hover_icon"></i>\
                               </a>\
                               <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="' + treeNode.tId + '_hover_a">\
                               ' + option_li + '\
                               </ul>\
                            </div>');

                        editStr.data("treeNodeData", treeNode);
                        aObj.append(editStr);
                    }

                    aObj.hover(function() {
                        var $this = $(this);
                        $(".sw_ed_hover").removeClass("open");
                        $this.addClass("hovering");
                    }, function() {
                        var $this = $(this);
                        $this.removeClass("open-drop");
                        $this.removeClass("hovering");
                    });

                    //展开下拉菜单时 更改层级
                    $("#" + treeNode.tId + "_hoverbox").on('show.bs.dropdown', function() {
                            aObj.addClass("open-drop");
                        });
                        //隐藏下拉菜单时 更改层级
                    $("#" + treeNode.tId + "_hoverbox").on('hide.bs.dropdown', function() {
                        aObj.removeClass("open-drop");
                    });

                }
            },
            callback: {
                onClick: function(e, treeId, treeNode) {
                    var $target = $(e.target);
                    if ($target.parents(".sw_ed_hover").length === 0 && !$target.hasClass("sw_ed_hover")) {
                        _this.checkswData(option_data.swdata.callback,'onClick',treeNode);
                        $("#" + treeId).find(".selectNode").removeClass("selectNode");
                        $('#' + treeNode.tId).addClass('selectNode');

                    }
                    return true;

                }
            }

        }
    },
    init: function(data, targerId, option_data) {
        var _this = this,
            option = _this._buildOption(option_data),
            $treeSelector = $(targerId),
            zTree;
        if(data)
            zTree = $.fn.zTree.init($treeSelector, option, data);
        else
            zTree = $.fn.zTree.init($treeSelector, option);
        // _this.bufferPool.push(zTree);
        return zTree;
    },
    _buildOption: function(option_data) {
        var _this = this;
        return $.extend(true, _this.getDefaultOption(option_data), option_data);
    },
    checkswData:function(){
        var args = Array.prototype.slice.call(arguments),
            data = args[0],
            methods = args[1];
        args.splice(0,2);
        var params=args;   
       
        if(!data||!data[methods])
        return;
        else if(typeof(data[methods])=="function")
        data[methods](...params);

    }
};
module.exports = sweetZtreeAction;
