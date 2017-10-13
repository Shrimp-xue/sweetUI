var validForm = require("Validform");

var sw_editbox = {
    el: "[sw-edit]",
    group: ".sw_ed_editor",
    activeEle: ".editbox-element",
    class: "editing",
    form: "sw-ed-form",
    elements: {},
    validFormOption: {
        ajaxPost: true,
        tiptype: function(msg, o, cssctl) {
            console.log(o);
            if (o.type === 3) {
                o.obj.parent().addClass('has-error');
                o.obj.next('.form-inline-error-msg').remove();
                o.obj.after('<span class="form-inline-error-msg">' + msg + '</span>');
            } else {
                o.obj.parent().removeClass('has-error');
                o.obj.next('.form-inline-error-msg').remove();
            }
        },
        beforeSubmit: function(curform) {
            console.log(curform);
            return false;
        },
        datatype: {
            "phone": function(gets, obj, curform, regxp) {
                var reg1 = regxp.m,
                    reg2 = /^([0-9]{3,4}-)?[0-9]{7,8}$/;

                if (reg1.test(gets)) {
                    return true;
                }
                if (reg2.test(gets)) {
                    return true;
                }

                return false;
            }
        }
    },
    init: function(option,el) {
        var _this = this;
        _this.option = option;
        if(el)_this.el=el;
        _this.handler.init();
    },
    handler: {
        init: function() {
            var _this = this,
                __this = sw_editbox,
                option = __this.option;
            var html = _this._buildBTN(option.btn);
            _this.run(html);
        },
        _buildEvents: function() {
            var _this = this,
                __this = sw_editbox,
                option = __this.option;
            var results = [];
            for (var i = 0; i < option.btn.length; i++) {
                var eventName = option.btn[i].split(":")[1];
                results.push(eventName);
            }
            return results;
        },
        _buildBTN: function(arr) {
            var htmlarr = [];
            for (var i = 0; i < arr.length; i++) {
                var text = arr[i].split(":")[0],
                    event = arr[i].split(":")[1],
                    tag_a = "<a href='javascript:void(0);' sui-event='" + event + "'>" + text + "</a>";
                htmlarr.push(tag_a);
            }
            return htmlarr.join(" ");
        },
        _buildForm: function($this) {
            var _this = this,
                __this = sw_editbox;
            var type = $this.attr("changeType"),
                name = $this.attr("name"),
                datatype=$this.attr("dataType"),
                nullmsg=$this.attr("nullmsg"),
                errormsg=$this.attr("errormsg"),
                value = '',
                area = {};
            switch (type.split(".")[0]) {
                case 'select':
                    value = $this.attr("value");
                    break;
                case 'area':
                    area = {
                        province: $this.data("province"),
                        city: $this.data("city"),
                        district: $this.data("district"),
                        address: $this.data("address")
                    };

                    break;
                default:
                    value = $this.text();
            }
            var thisclone = $this.parents(__this.group).find(".media-body").clone().html();

            __this.elements[name] = {
                name: name,
                selector: thisclone
            };
            var opts = {
                value: value,
                name: name,
                type: type,
                datatype:datatype,
                nullmsg:nullmsg,
                errormsg:errormsg
            };
            if (type === 'area') $.extend(opts, area);
            var formhtml = _this._formTemplate(opts);
            __this.activeForm=formhtml;
            $this.parents(".media-body").html(formhtml);
            if (__this.option.selectOption && type == "select") _this._buildSelect({
                name: name,
                value: value
            });

            if (typeof sw_editbox.option.afterRender === 'function') sw_editbox.option.afterRender.call(this);

            $("." + __this.form).find("[name]").on("keydown", _this._listenKeyOn);

            __this.activeValidForm=formhtml.Validform(__this.validFormOption);
        },
        _buildSelect: function(obj) {
            var _this = this,
                __this = sw_editbox,
                name = obj.name,
                value = obj.value;
            var this_selectdata = __this.option.selectOption[name],
                result;
            console.log(this_selectdata);
            for (var i = 0; i < this_selectdata.length; i++) {
                var str = '';
                if (value == this_selectdata[i].value) str = "selected='selected'";
                var op = "<option " + str + " value='" + this_selectdata[i].value + "'>" + this_selectdata[i].name + "</option>";
                $("[name='" + name + "']").append(op);
            }
        },
        _formTemplate: function(obj) {
            var __this = sw_editbox;
            var value = obj.value,
                name = obj.name,
                type = obj.type,
                datatype=obj.datatype?"datatype="+obj.datatype:"",
                nullmsg=obj.nullmsg?"nullmsg="+obj.nullmsg:"",
                errormsg=obj.errormsg?"errormsg="+obj.errormsg:"",
                str = '';

            switch (type) {
                case 'input':
                    str = '<input '+datatype+' '+nullmsg+' '+errormsg+' name=' + name + ' type="text" class="form-control editbox-element" value="' + value + '">';
                    break;
                case 'textarea':
                    str = '<textarea '+datatype+' '+nullmsg+' '+errormsg+' name=' + name + ' type="text" class="form-control editbox-element">' + value + '</textarea>';
                    break;
                case 'area':
                    str = '<div class="position-relative editbox-element" name=' + name + '>' +
                        '<input readonly type="text" class="form-control area-piker" data-province=' + obj.province + ' data-city=' + obj.city + ' data-district=' + obj.district + '></div>' +
                        '<div class="m-t-10 m-b-10 area-piker-inputs">' +
                        '<input type="hidden" name="province" value=' + obj.province + '>' +
                        '<input type="hidden" name="city" value=' + obj.city + '>' +
                        '<input type="hidden" name="district" value=' + obj.district + '>' +
                        '<textarea datatype="s0-50" errormsg="具体地址应该在50字符以内！" type="text" class="form-control" placeholder="请输入详细地址" name="address">' + obj.address + '</textarea>'
                        '</div>';
                    break;
                case 'select':
                    str = '<select name=' + name + ' sui-select class="form-control show-tick editbox-element"></select>';
                    break;
                default:
                    // statements_def
                    break;
            }

            return $('<form class="' + __this.form + '" style="width:556px;">' +
                '<div class="form-group">' +
                str +
                '</div>' +
                '<div class="form-group">' +
                '<a role="button" class="btn btn-default btn-primary waves-effect sw-ed-save m-r-10">保存</a>' +
                '<a role="button" class="btn btn-default btn-default waves-effect sw-ed-cancel">取消</a>' +
                '</div>' +
                '</form>');
        },
        _eventInit: function() {
            var _this = this,
                __this = sw_editbox,
                option = __this.option,
                group = __this.group,
                obj = _this._buildEvents();
            $(__this.el).unbind('click');
            $(__this.el).on('click', function(e) {
                var $this = $(e.target);
                var method = $this.attr('sui-event');
                if (method) {
                    if (method.indexOf("this.") >= 0) {
                        method = method.replace("this.", "");
                        if (typeof(option.methods[method]) == "function") {

                            $parent = $this.parents(group);
                            option.methods[method]($parent);
                        }
                    } else
                        _this.methods[method]($this);
                }
                if ($this.hasClass('sw-ed-cancel')) {
                    _this._cancelEDIT($this);
                } else if ($this.hasClass('sw-ed-save')) {
                    _this._saveEDIT($this);
                }
            });
        },
        _listenKeyOn: function(e) {


            var _this = sw_editbox.handler,
                $this = $(this);
            if (event.keyCode == "13") {
                //回车执行查询
                e.preventDefault();
                _this._saveEDIT($this);
            }
        },
        _showEDIT: function($this) {
            var _this = this,
                __this = sw_editbox,
                group = sw_editbox.group;
            var $parent = $this.parents(group),
                text = $parent.find('[name]').text();
            $(__this.el).addClass(__this.class);
            _this._buildForm($parent.find('[name]'));
        },
        _saveEDIT: function($this) {
            var __this=sw_editbox;
            var bool=__this.activeValidForm.check();
            var $ed_editor = $this.parents('.sw_ed_editor');
            var _this = this,
                __this = sw_editbox,
                group = sw_editbox.group;
            var url = $ed_editor.data("url"),
                dataType = $ed_editor.data("type"),
                params = $ed_editor.attr("params"),
                name = $ed_editor.find("[name]").attr("name"),
                value = $ed_editor.find("[name]").val(),
                contentType = $ed_editor.data('contenttype');

            if (params) params = JSON.parse(params);
            params = params ? params : {};

            $ed_editor.find("[name]").each(function() {
                var self = $(this);
                params[self.attr('name')] = self.val();
            });
            if(bool)
            {
                if(typeof(sw_editbox.option.formatter)=="function")
                params=sw_editbox.option.formatter(params);
                SWXHR[dataType](url, params, "JSON", contentType)
                .done(function(data){
                    __this.option.success(data,$ed_editor)
                });
            }
            
        },
        _cancelEDIT: function($this) {
            var _this = this,
                __this = sw_editbox,
                group = sw_editbox.group,
                activeEle = sw_editbox.activeEle,
                $parent = $this.parents(group),
                body = $this.parents(".media-body"),
                name = $parent.find(activeEle).attr("name"),
                oldele = __this.elements[name].selector;
            body.html("");
            body.append(oldele);
            $(__this.el).removeClass(__this.class);
            $parent.find(".sw_edit_tool").remove();
        },
        methods: {
            showEdit: function($this) {
                var _this = this,
                    __this = sw_editbox,
                    option = __this.option;
                __this.handler._showEDIT($this);
            }
        },
        run: function(html) {
            console.log(html);
            var _this = this,
                __this = sw_editbox,
                $editor = $(__this.el),
                group = __this.group;
            var $html = $("<div class='sw_edit_tool'></div>");
            $html.html(html);
            _this._eventInit();
            $(__this.el).each(function() {
                var $this = $(this);
                $this.children(group).hover(function() {
                    if (!$editor.hasClass(__this.class) && $(this).find("[name]").html() && $(this).find("[sui-event]").length === 0)
                        $(this).find(".media-body").append($html);
                }, function() {
                    $(this).find(".sw_edit_tool").remove();
                });
            });
        }
    }
};
module.exports = sw_editbox;
