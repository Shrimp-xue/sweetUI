var apiUrl = appConfig.baseURL;

var SWXHR = {
    GETCOOKIESBYOBJECT: function(key) {
        var _this = this,
            results = "",
            login = appConfig.checklogin;

        if (login) {
            results = SWTOOL.cookies.getByObject(login.cookieName, key);

        }

        return results;
    },
    BUILDSTR: function(arr) {
        var results = "",
            that = this;
        for (var i = 0; i < arr.length; i++) {
            if (i === 0) results = "?";
            results = results + arr[i] + "=" + that.GETCOOKIESBYOBJECT(arr[i]);
        }
        return results;
    },
    AJAX: function(method, url, params,dataType, contentType, statusCode) {
        var that = this,
            urlfollow = "",
            httpInterceptors=appConfig.httpInterceptors;

        var ajaxoption=false;
        ajaxoption = dataType=="ajaxoption"?true:false;
        params = params ? params : {};


        // var checklogin = appConfig.checklogin;
        /*if (checklogin) {
            urlfollow = checklogin.urlfollow;
            urlfollow = that.BUILDSTR(urlfollow);
        }*/

        // 获取url，并判断url中是否包含冒号，以确定是否使用自定义url
        url = url.slice(0, 1) === ":" ? url.slice(1) : apiUrl + url;

        if(!ajaxoption)
        ajaxoption=httpInterceptors.modelType=="ajaxoption"?httpInterceptors.modelType:false;

        //开启ajax配置模式
        if(ajaxoption)
        {
            // 获取自定义捕获状态码方法
            var ajaxStatusCode = params.statusCode ? that.statusCode(params.statusCode) : that.statusCode();

            var ajaxParams=$.extend(true,params,{
                url: url + urlfollow,
                dataType: params.dataType ? params.dataType : "JSON",
                type: method ? method : 'GET',
                contentType: params.contentType,
                traditional: true,
                statusCode: ajaxStatusCode,
            })
        } 
        //简易模式
        else {
            // 获取自定义捕获状态码方法
            var ajaxStatusCode = statusCode ? that.statusCode(statusCode) : that.statusCode();

            var ajaxParams=$.extend(true,{},{
                url: url + urlfollow,
                dataType: dataType ? dataType : "JSON",
                type: method ? method : 'GET',
                contentType: contentType,
                traditional: true,
                statusCode: ajaxStatusCode,
                data:params
            })
        }
        if(httpInterceptors&&typeof(httpInterceptors.request)=="function")
        {
            ajaxParams=httpInterceptors.request(ajaxParams,{
                SWTOOL:SWTOOL
            });
        } 
        var def = $.ajax(ajaxParams)
            .done(function(data) {
                
            })
            .fail(function(xhr, statusCode, statusText) {
                console.log('%c code:' + xhr.status + ' || url=' + url + ' || ' + statusText, 'color:red;font-weight:bold;');
            })
            .always(function(data, statusCode, xhr) {
                if(xhr.status === 200){
                    if(httpInterceptors&&typeof(httpInterceptors.response)=="function")
                    {
                        var status=httpInterceptors.response(data);
                    }
                    if(!status)
                    SWTOOL.go('#/login',null,{callback:function(){
                        app.clearStorage();
                    }});
                }
            });

        return def;

    },
    POST: function(url, params, dataType, contentType, statusCode) {
        return this.AJAX('POST', url, params,dataType, contentType, statusCode);
    },
    GET: function(url, params, dataType, contentType, statusCode) {
        return this.AJAX('GET', url, params,dataType, contentType, statusCode);
    },
    PUT: function(url, params, dataType, contentType, statusCode) {
        return this.AJAX('PUT', url, params,dataType, contentType, statusCode);
    },
    DELETE: function(url, params, dataType, contentType, statusCode) {
        return this.AJAX('DELETE', url, params,dataType, contentType, statusCode);
    },
    // 捕获http状态
    statusCode: function(customStatusCode) {
        var defaults = {
            400: {
                text: "<p>错误编码：400</p>"
            },
            401: {
                text: "对不起，您没有权限，请重新登录后再打开。<p>错误编码：401</p>",
                fn: function(callback) {
                    // 关闭弹出窗后执行的方法
                }
            },
            403: {
                text: "<p>错误编码：403</p>"
            },
            404: {
                text: "<p>对不起，没有找到页面或者数据</p><p>错误编码：404</p>"
            },
            409: {
                text: "对不起，资源冲突<p>错误编码：409</p>"
            },
            500: {
                text: "<p>错误编码：500</p>"
            },
            503: {
                text: "<p>错误编码：503</p>"
            }
        };

        var status = {};

        $.each(defaults, function(code, val) {
            status[code] = function() {

                layer.alert(defaults[code].text, function(idx) {
                    if (typeof defaults[code].fn === 'function') {

                        defaults[code].fn.call(this);
                    }
                    layer.close(idx);
                });


            };
        });

        $.extend(true, status, customStatusCode);
        return status;

    }
};

window.SWXHR = SWXHR;

module.exports = SWXHR;
