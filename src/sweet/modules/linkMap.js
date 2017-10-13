var action = {
    init: function($selector) {
        if(!SweetMenus.length)return;
        this.buildDOM($selector)
    },
    checkMenus:function(){
        var result=0;
        for(var i=0;i<window.modules.length;i++)
        {
            var item=window.modules[i];
            if(item.ctrl.el==="#frameBox"||item.ctrl.el==="#frameBox-pageMenu")
            {
                result++;
            }
        }
        return result;
    },
    getMenusData:function(){
        var menus=new Array();
        for(var i=0;i<SweetMenus.length;i++)
        {
            var menuData=SweetMenus[i].menuData,
                menuUrlList=SweetMenus[i].menuUrlList;
            var current=menuUrlList[window.currentUrl],maproute=new Array();
            if(!current)
            {
                var obj=this.getMapRoute(window.currentUrl,menuData,menuUrlList);
                if(obj)
                {
                    maproute=obj.maproute;
                }
                
            }
            else
            var maproute=this.getWfromView(window.currentUrl,menuData);
            
            menus[i]={
                menuData:menuData,
                menuUrlList:menuUrlList,
                maproute:maproute,
                current:current
            }
        }
        return menus;
    },
    getMapRoute:function(url,menuData,menuUrlList){
        var _this=this;
        var urlArr = url.replace('#/', '').split('/'),
            newUrlArr=[];
        if(urlArr.length==1&&!urlArr[0])return;
        for (var i = 0; i < urlArr.length; i++) {
            if(urlArr[i]) newUrlArr.push(urlArr[i]);
        }
        var newUrl = '#/' + newUrlArr.splice(0, newUrlArr.length - 1).join('/');
        var current=menuUrlList[newUrl];
        
        if(!current)
        return _this.getMapRoute(newUrl,menuData,menuUrlList);
        else
        {
            var maproutes=_this.getWfromView(newUrl,menuData);
            maproutes.push(current);
            return {
                maproute:maproutes
            }
        }
        
    },
    getWfromView: function(url,menu) {
        var parent = new Array(),
            iswork = 1,
            map = new Array(),
            result = false;

        //记录视图所在路径路线,待优化
        var arreach = function(array, current, parent) {
            $.each(array, function(i, item) {

                var len = array.length;
                if (iswork) {
                    if (current == item.url) {
                        iswork = 0;
                        result = true;
                    } else if (item.children) {

                        if (arreach(item.children, current, parent)) {
                            parent.push(item);
                            map.push(i);
                        }
                    }
                }
            })
            return result;
        }



        arreach(menu, url, parent)

        return parent.reverse();

    },
    buildDOM:function($selector){
        var mapbox = $selector,
            text=$selector.data("text")?$selector.data("text"):null,current="",
            //设置分隔符
            delimit = $selector.data("limit")?$selector.data("limit"):"/",
            //设置移除
            exclude = $selector.data("exclude"),
            //移除的方向，b:backward f:forward
            direction = exclude?exclude.split("-")[0]:null,
            //移除的数量
            excludeCount = exclude?exclude.split("-")[1]:null,
            //类型 reset表示动态载入当前节点
            type = $selector.data("type"),
            //追加内容
            additional=$selector.data("add")?$selector.data("add").split(","):null;
        mapbox.html("");
        mapbox.addClass('linkmap');
        var menus=this.getMenusData();
        for(var i=0;i<menus.length;i++)
        {
            var menuItem=menus[i];
            var len=menuItem.maproute.length;
            if(menuItem.current)current=menuItem.current;
            menuItem.maproute.forEach(function(item,index) {
                var a,router=item.url?item.url.replace("#",""):"",title=(function(){
                    if(item.nameField)
                    return item.nameField;
                    else
                    return item.groupField;
                })(item)
                if (title) {

                    if (item.url) {
                        var link = 'href="#' + router + '"';
                        a = '<li><a ' + link + '>' + title + '</a></li>';
                    } else {
                        a = '<li>' + title + '</li>';
                    }
                }
                if(i==(menus.length-1))
                {
                    if(index!=(len-excludeCount))
                    {
                        mapbox.append(a);
                    }
                }
                else
                mapbox.append(a);
                
            });
        }
        // mapbox.append('<li><a sw-router="' + index + '">' + title + '</a></li>');
        current=current?current:text;
        if(current&&typeof(current)=="object")
        text=current.nameField

        if((!additional||additional.length==0||!additional[0])&&text)
        mapbox.append('<li class="current">' + text + '</li>');
        else if(additional&&additional[0]&&additional.length>0)
        {
            var len=additional.length;
            for(var i=0;i<len;i++)
            {
                var isCurrent=(i==len-1)
                var item=additional[i];
                var obj={
                    name:item.split("::")[0],
                    url:item.split("::")[1],
                }
                if(obj.url)
                {
                    var link = 'href="'+obj.url+'"';
                        a = '<li '+(isCurrent?'class="current"':'')+'><a ' + link + '>' + obj.name + '</a></li>';
                    mapbox.append(a);
                }
                else
                mapbox.append('<li '+(isCurrent?'class="current"':'')+'>' + obj.name + '</li>');
            }
        }
    }
};
module.exports = action;
