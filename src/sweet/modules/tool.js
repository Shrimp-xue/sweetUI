var prism = require("prism");

var sweetTools = {
    GETCOOKIESBYOBJECT: function(key) {
        var _this = this,
            results = "",
            info=JSON.parse(localStorage.loginInfo)

        results = info[key]

        return results;
    },
    BUILDOBJECT: function(arr) {
        var results = {},
            that = this;
        for (var i = 0; i < arr.length; i++) {
            results[arr[i]] = that.GETCOOKIESBYOBJECT(arr[i]);
        }
        return results;
    },
    replaceValueByArray:function(object,arr){
        var result=$.extend(true,[],arr);
        var watch=function(arr,key){
            var str="{"+key+"}";
            for(var i=0;i<arr.length;i++)
            {
                var item=arr[i];
                if(item.url)
                item.url=item.url.indexOf(str)>=0?item.url.replace(str,object[key]):item.url;
                if(item.children)
                {
                    watch(item.children,key)
                }
            }
        }
        for(var key in object)
        {
            watch(result,key);
        }
        console.log(result)
        return result;
    },
    getXmlDoc:function(retXml){
        if (retXml == "false") {
            //can not get the customer info 
            // alert(retXml);
            return false;
        } else {

            //get the xml data 
            var xmlDoc;
            if (window.ActiveXObject) {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = true;
                xmlDoc.loadXML(retXml);
            }
            // code for Mozilla, Firefox, Opera, etc. 
            else if (document.implementation && document.implementation.createDocument) {
                var oParser = new DOMParser();
                xmlDoc = oParser.parseFromString(retXml, "text/xml");

            } else {
                alert('你的浏览器不支持这个脚本！');
                return false;
            }
        }
        return xmlDoc;
    },
    formartFormData: function(selector) {
        var el = typeof selector == "string" ? $(selector) : $(selector[0], selector[1]);
        var formData = el.serializeArray(),
            formDataJson = {};
        $.each(formData, function(index, val) {
            if (val.value) formDataJson[val.name] = val.value;
        });

        return formDataJson;
    },
    mergeArray: function(arr1, arr2, key) {
        var results = new Array(),
            json = {};
        var arr = arr1.concat(arr2);
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i][key]]) {
                results.push(arr[i]);
                json[arr[i][key]] = arr[i];
            }
        }

        return results;
    },
    ajaxFormDownload: function(url, params) {
        var _this = this;
        var form = $("<form>"); //定义一个form表单
        form.attr("style", "display:none");
        form.attr("target", "");
        form.attr("method", "get");
        form.attr("action", url);
        $("body").append(form); //将表单放置在web中

        var urlfollow = ["session_id"],
            _params = _this.BUILDOBJECT(urlfollow);

        $.extend(true, params, _params);

        for (var key in params) {
            var input = $("<input></input>");
            input.attr("name", key);
            input.val(params[key]);
            form.append(input);
        }

        form.submit().remove(); //表单提交 
    },
    keydownFn: function(e) {
        if (e.which === 13) {
            e.preventDefault();
        }
    },
    closeNavSwitch:function(){
        var bool=$("#sweetRoot").hasClass("sw-close-menu");
        if(!bool)
        $(".nav-switch").trigger('click');
    },
    go: function(url,data,options) {
        // var baseUrl = appConfig.baseUrl ? appConfig.baseUrl : '';
        window.location.href = url;
        if(options){
            if(typeof options.callback ==='function') {
                options.callback();
            }
        }
        window.sweetNowParams=data;
    },
    cookies: {
        getByObject: function(cookieName, key) {
            var _this = this;
            var results = "",
                cookies = _this.getCookie(cookieName);
            results = JSON.parse(unescape(cookies));
            if (results) {
                results = results[key];
            } else {
                results = "";
            }
            return results;
        },
        getsec: function(str) {
            var str1 = str.substring(1, str.length) * 1;
            var str2 = str.substring(0, 1);
            if (str2 == "s") {
                return str1 * 1000;
            } else if (str2 == "h") {
                return str1 * 60 * 60 * 1000;
            } else if (str2 == "d") {
                return str1 * 24 * 60 * 60 * 1000;
            }
        },
        setCookie: function(name, value, time) {
            var _this = this,
                expires = '';
            if (time) {
                var strsec = _this.getsec(time);
                var exp = new Date();
                exp.setTime(exp.getTime() + strsec);
                expires = "expires=" + exp.toGMTString();
            }
            document.cookie = name + "=" + escape(value) + ";" + expires;
        },
        getCookie: function(name) {
            var _this = this;
            var arr, 
                reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

            if (arr == document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        },
        delCookie: function(name) {
            var _this = this;
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = _this.getCookie(name);
            if (cval !== null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },
    getUuid: function(l) {
        var len = l || 32; //32长度
        var radix = 16; //16进制
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++)
                uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 32; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
    layer: {
        msg: function(text, callback, time) {
            var defaulticon = "<i class='ion-information-circled m-r-5'></i>"
            layer.msg(defaulticon + text, {
                skin: "layer-sw-ui layer-sw-ui-msg",
                offset: 't',
                anim: 6,
                time: time
            }, callback)
        },
        error:function(text, callback, time){
            var defaulticon = "<i class='ion-close-circled m-r-5'></i>"
            layer.msg(defaulticon + text, {
                skin: "layer-sw-ui layer-sw-ui-error",
                offset: 't',
                anim: 6,
                time: time
            }, callback)
        },
        success: function(text, callback, time) {
            var defaulticon = "<i class='ion-checkmark-circled m-r-5'></i>"
            layer.msg(defaulticon + text, {
                skin: "layer-sw-ui layer-sw-ui-success",
                offset: 't',
                time: time
            }, callback)
        },
        confirm:function(option, yes, no){
            var icon="<i class='iconfont icon-tishi_shixin'></i>";
            layer.open({
                move:false,
                closeBtn: false,
                skin: "layer-sw-ui layer-sw-ui-confirm",
                title: icon+option.title,
                content: option.content,
                btn: ["确认", "取消"],
                yes: yes,
                no: no
            })
        },
        delete: function(option, yes, no) {
            layer.open({
                move:false,
                closeBtn: false,
                skin: "layer-sw-ui layer-sw-ui-confirm",
                title: option.title,
                content: option.content,
                btn: ["确认", "取消"],
                yes: yes,
                no: no
            })
        },
        alert:function(option,callback){
            // success error message warning
            var istitle=option.title?option.title:false;
            var str=istitle?"":"noTitle"
            var defaults={
                closeBtn: true,
                offset:"t",
                shade:false,
                anim:option.type=="error"?6:5,
                isOutAnim:false,
                skin: str+" layer-sw-ui layer-sw-ui-alert layer-alert-"+(option.type?option.type:"message"),
                title: istitle,
                content: option.content
            }
            layer.open(defaults)
        }
    },
    windowScroller:{
        getScrollHeight:function(){
            var scrollHeight = 0,
                bodyScrollHeight = 0,
                documentScrollHeight = 0;
            if (document.body) {
                bodyScrollHeight = document.body.scrollHeight;
            }
            if (document.documentElement) {
                documentScrollHeight = document.documentElement.scrollHeight;
            }
            scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
            return scrollHeight;
        },
        getWindowHeight:function(){
            var windowHeight = 0;　　
            if (document.compatMode == "CSS1Compat") {　　　　
                windowHeight = document.documentElement.clientHeight;　　
            } else {　　　　
                windowHeight = document.body.clientHeight;　　
            }　　
            return windowHeight;
        },
        getScrollTop:function(){
            var scrollTop = 0,
                bodyScrollTop = 0,
                documentScrollTop = 0;　　
            if (document.body) {　　　　
                bodyScrollTop = document.body.scrollTop;　　
            }　　
            if (document.documentElement) {　　　　
                documentScrollTop = document.documentElement.scrollTop;　　
            }　　
            scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;　　
            return scrollTop;
        },
        scrollerFixed:function(){
            var _this=sweetTools.windowScroller,
                windowHeight=parseInt($(window).height());
            return {
                fixed:function(){
                    _this.top=_this.getScrollTop();
                    if(_this.top)
                    {
                        $("html").css({
                            "margin-top":"-"+_this.top+"px"
                        })
                    }
                    $("body").addClass("fixed");
                },
                cancelfixed:function(){
                    $("html").removeAttr("style");
                    $("body").removeClass("fixed");
                    $(window).scrollTop(_this.top);
                }
            }
        }
    },
    setLinkMap: function(text) {
        $("[sui-map]").html(text);
        linkMap.init(menuConfig.index, menuConfig.title, frameAction.views.map, frameAction.views.current)
    },
    getParam: function(o) {
        var reg = new RegExp(
            "(^|\\?|&|#)" + o + "=([^&#]*)(&|\x24|#)",
            "");
        url = location.href,
            match = url.match(reg);
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    },
    dynamicLoad:function(array,success,error){
        var _doc=document.getElementsByTagName('head')[0],
            _docs=_doc.children,
            scripts=new Array(),
            len=array.length,
            start=0;
        console.log(_docs);
        var check=function(url){
            var result=false;
            for(var i=0;i<_docs.length;i++)
            {
                if(_docs[i].type==="text/javascript")
                {
                    var src=_docs[i].src;
                    if(src.indexOf(url)>=0)
                    {
                        result=true;
                        break;
                    }
                    
                }
            }
            return result;
        }
        var creatScript=function(url){
            var script=document.createElement('script')
            script.setAttribute('type','text/javascript');
            script.setAttribute('src',url);
            _doc.appendChild(script);
            return {
                currentUrl:url,
                script:script
            };
        }
        var loadScript=function(i){
            var ishave=check(array[i])?1:0;
            if(i<len&&!ishave)
            {
                if(!scripts[i]||scripts.length==0)
                {
                    scripts[i]=creatScript(array[i]);
                }
                scripts[i].nextUrl=array[i+1];
                scripts[i].script.index=i;
                scripts[i].script.onload=scripts[i].script.onreadystatechange=function(){
                    var i=this.index;
                    if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                        if(!i)console.group('%c动态加载javascript消息提示', 'font-size:14px;color:#296ab4;');
                        console.log("%c加载"+scripts[i].currentUrl+"成功!!!!",'color:#999')
                        if(scripts[i].nextUrl)
                        {
                            loadScript(i+1)
                        }
                        if(len==(i+1))
                        {
                            if(typeof(success)=="function")
                            {
                                console.groupEnd();
                                success();
                            }
                        }
                        
                    }
                    scripts[i].script.onload=scripts[i].script.onreadystatechange=null;
                }
                scripts[i].script.onerror=function(err){
                    sweetTools.layer.msg("动态加载js:"+array[i]+"失败！");
                    if(typeof(error)=="function")
                    {
                        error(err);
                    }
                }
            }
            else if(ishave)
            {
                if(typeof(success)=="function")
                {
                    success();
                }
            }
        }
        
        loadScript(start);
        
    },
    demoUtil:{
        init:function(){
            this.setCode();
            this.preCode();
        },
        preCode:function(){
            $(".html-code").each(function() {
                var self = $(this),
                    content = self.html().replace(/(^\s*)|(\s*$)|(^[\r\n]*)|([\r\n]*$)/g, "");
                self.prev('pre').find('code').text(content);
                prism.highlightAll();
            });
        },
        setCode:function(){
            $('.tab-pane-code').each(function(){
                var self=$(this),
                    current=self.prev(),
                    content=self.html();
                current.html(content);
            })
        }
    }
};
window.SWTOOL = sweetTools;
module.exports = sweetTools;
