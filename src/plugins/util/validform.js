var validform = require("jqueryValidform");
var tooltip = require("tooltip");
var popover = require("popover");


var vaildFormAction = {
    init: function(option) {
        var _this = this;
        _this.run(option);
    },
    element: {
        popover: {
            html: function(msg, id) {
                var ele = $("[data-valid='" + id + "']");
                if (!ele[0]) {

                function checkjson (json){
                    try{
                        $.parseJSON(json)
                        return $.parseJSON(json);
                    }
                    catch(e){
                        return false;
                    }
                }
                var objs=checkjson(msg),
                    tmp='';
                console.log(msg)
                if(objs)
                {
                    tmp="title='"+objs.title+"' data-content='"+objs.msg+"'";
                }else
                {
                    tmp="data-content='"+msg+"'";
                }


                    var str = "<span data-valid='" + id + "' data-toggle='popover' "+tmp+" data-placement='right' class='validform-popover'></span>";
                    console.log(str)
                    $('body').append(str);
                    ele = $('[data-valid="' + id + '"]');
                }
                return ele;
            }
        },
        downtext:{
            html:function(msg,id){

            }
        }
    },
    objs: {
        tiptype: function(msg, o, cssctl) {
            // console.log('=====分割线=====')
            // console.log(msg);
            // console.log(o.type)
            // console.log(cssctl);
            // console.log('=====分割线=====')

            var $this = o.obj,
                $curform=o.curform,
                id = $curform.attr('sui-valid')+$this.attr('name'),
                validtype=$this.attr("validtype")?$this.attr("validtype"):"popover",
                oktype=$this.attr('ok'),
                errmsg = $this.attr('errmsg'),
                typeElement = vaildFormAction.element[validtype],
                handler = vaildFormAction.handlers['valid_'+validtype];

            errmsg = errmsg ? errmsg : "验证不通过";

           

            var events = handler.init($this, typeElement.html(errmsg, id));

            switch (o.type) {
                // 正在检测/提交数据
                case 1:
                    //..
                    break;
                    // 通过验证
                case 2:
                    events.yes(oktype)
                    break;
                    // 验证失败
                case 3:
                    events.no()
                    break;
                    //提示ignore状态
                case 4:
                    break;
            }
        },
        datatype: {
            
        }
    },
    handlers: {
        "valid_popover": {
            markEle: {
                yes: '<span class="ion ion-checkmark-round form-control-feedback"></span>',
                no: '<span class="ion ion-close-round form-control-feedback"></span>'
            },
            init: function($this, popover) {
                var _this = this;
                _this.ele = $this;
                _this.offset = $this.offset();
                _this.height = $this.innerHeight();
                _this.width = $this.innerWidth();
                _this.box = $this.parent();
                _this.mark = $this.siblings(".form-control-feedback");
                _this.haserror = $this.hasClass('Validform_error');

                _this.popoverEle = popover;
                _this.setElement();

                return {
                    yes: _this.yes,
                    no: _this.no
                };
            },
            setElement: function() {
                var _this = this,
                    top = _this.offset.top + (_this.height / 2),
                    left = _this.offset.left + _this.width + 10;
                _this.popoverEle.css({
                    "top": top,
                    "left": left
                })
            },
            //验证通过
            yes: function(oktype) {
                var _this = vaildFormAction.handlers.valid_popover;

                _this.popoverEle.popover("destroy")
                _this.box.removeClass("has-error");
                if(oktype){
                    _this.box.addClass("has-success");
                    _this.ele.after(_this.markEle.yes);
                }
                _this.mark.remove();
            },
            //验证不通过
            no: function() {
                var _this = vaildFormAction.handlers.valid_popover;

                if (!_this.haserror) {
                    _this.ele.after(_this.markEle.no);
                    _this.popoverEle.popover("show")
                    _this.box.removeClass("has-success");
                    _this.box.addClass("has-error");
                    _this.mark.remove();
                }

            }

        },
        "valid_textdown":{
            init: function($this,html) {
                console.log(html)
            }
        }
    },
    extend:function(objs,option){
        objs.beforeSubmit=function(curform){

            var data=curform.serialize().split("&"),
                result=new Array();

            data.forEach(function(item,index,arr){
                var tmp=new Object();
                var name=item.split("=")[0];
                result[name]=item.split("=")[1];
            })

            option.beforeSubmit(curform,result);

            console.log("===封装了return false")

            return false;
        }
        objs.beforeCheck=function(curform){
            option.beforeCheck(curform);
        }
    },
    run: function(option) {
        var _this = this,
            $this = $('[sui-valid]');
        if (option.tiptype) option.tiptype = null;

        $.extend(true, _this.objs, option);

        _this.extend(_this.objs,option);

        $this.Validform(_this.objs)
    },
    runByElement:function(el,option){
        var _this = this,
            $this = $(el);
        if (option.tiptype) option.tiptype = null;

        $.extend(true, _this.objs, option);

        _this.extend(_this.objs,option);

        return $this.Validform(_this.objs);
    }
}
module.exports = vaildFormAction;
