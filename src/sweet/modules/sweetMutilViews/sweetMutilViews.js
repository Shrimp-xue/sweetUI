/*
 * =====================================
 * name    : sweetMutilViews 多标签组件
 * version : v1.0.0
 * time    : 2017-08-22 17:23:12
 * auth    : huyingjun
 * e-mail  : yingjun.hu@geely.com
 * =====================================
 */

var swiper=require("swiper");

(function($){

	//全局变量
	var viewsPools=[];

	//获取默认参数项
	var getDefaults=function(){
		return {
			defaultPages:[{
				name:"首页",
				url:"/#/test1/2"
			}],
			samePages:4
		}
	}

	//设置页面高度
	var setHeight=function(){
		var viewHeight=$(window).height();
		return viewHeight;
	}

	//初始化
	var init=function(options){
		var $this=$(this),
				defaults=getDefaults(),
				$iframeBody=$this.find("body"),
				h = setHeight();
		viewsPools=[];
		$.extend(true,defaults,options);

		//存入参数项
		$this.data("sweetMutilViews.options",defaults);


		$iframeBody.css({
			height:h
		})

		//默认加载
		addTabs.call(this,defaults.defaultPages);

		//绑定时间
		eventsInit.call(this);	
	}

	var setSwiper=function(){
		var $this=$(this);
		var myswiper=new Swiper('.mutilView-iframe-container .swiper-container', {
					autoplay: false,//可选选项，自动滑动
					slidesPerView:"auto",
					simulateTouch:false,
					prevButton:'.arrow.pre',//后退按钮类名
					nextButton:'.arrow.next'//后退按钮类名
		})
		$this.data("sweetMutilViews.swiper",myswiper);
	}

	//获取iframe视图
	var getiFrame=function(object,ids){
		var results=new Array(),
			  viewsLen=viewsPools.length;
		if(!ids)ids=0;
		for(var i=0;i<object.length;i++)
		{
			 var item=object[i],
			 		 url=item.url,
			 		 str=appConfig.baseURL+"/";

			 item.url=url.replace(/^\//,str);

			 item.id=i+ids;
			 var html=template("mutilView-iframe-tpl",item);
			 var str={
			 		html:html,
					iframe:"#mutilViews-tab-"+item.id+" iframe"
			 }
			 results.push(str);
		}
		
		return results;
	}

	//获取导航栏视图
	var getNavs=function(object){
		var results=new Array();
		for(var i=0;i<object.length;i++)
		{
			var item=object[i];
			var html=template("navs-tpl",item);
			results.push(html);
		}
		
		return results;
	}

	//增加多个标签页
	var addTabs=function(object,bool){
	  var $this=$(this),
	  		$swiper=$this.data("sweetMutilViews.swiper"),
	  		ids=$this.data("sweetMutilViews.ids"),
	  		$navs=$this.find("#mutilView-nav"),
	  		$container=$this.find("#mutilView-content"),
	  		iframeHtmls=getiFrame(object,ids),
	  		navsHtmls=getNavs(object);

	  if(iframeHtmls.length!==navsHtmls.length)return;
	  setPools.call(this,object);
	  for(var i=0;i<iframeHtmls.length;i++)
	  {
	  	var navsHtml=navsHtmls[i],
	  			iframeHtml=iframeHtmls[i].html,
	  			activeiframe=iframeHtmls[i].iframe;

	  	$navs.append(navsHtml);
	  	$container.append(iframeHtml);

	  	eventInitByOne(activeiframe);

	  	console.log(viewsPools);
	  	
	  }

	  if(bool)
	  {
	  	activeLastOne.call(this);
	  }

	  //更新滚动
	  if($swiper)
	  $swiper.update(true);
		else
		setSwiper.call(this);

	}

	//根据id删除单个标签页
	var deleteTab=function(id){
		var $this=$(this),
				$swiper=$this.data("sweetMutilViews.swiper"),
				$nav=$this.find("#mutilViews-nav-"+id).parent(),
				$tab=$this.find("#mutilViews-tab-"+id);

		$nav.remove();
		$tab.remove();

		for(var i=0;i<viewsPools.length;i++)
		{
			var item=viewsPools[i],
					_id=item.id;
			if(_id===id)
			viewsPools.splice(i,1);
		}
		activeLastOne.call(this);

		//更新滚动
	  if($swiper)
	  $swiper.update(true);
	}

	//激活最后一个标签页
	var activeLastOne=function(){
		var $this=$(this),
				$swiper=$this.data("sweetMutilViews.swiper"),
	  		$navs=$this.find("#mutilView-nav"),
	  		len=$navs.find(".swiper-slide").length,
	  		index=parseInt(len);
	  if($swiper)
	  $swiper.slideTo(index+1,1000,false);

		$navs.find("a[role='tab']:last").trigger('click');
	}

	//存入缓存池
	var setPools=function(object){
		 var $this=$(this),
		 		 ids=$this.data("sweetMutilViews.ids");
		 if(!ids)ids=0;
		 ids=ids+object.length;
		 $this.data("sweetMutilViews.ids",ids);
		 if(object.length!=0)
		 {
		 	for(var i=0;i<object.length;i++)
		 	{
		 		var item=object[i];
		 		checkrepeat.call(this,item);
		 		viewsPools.push(item);
		 	}
		 }
		 
		 return viewsPools;
	}

	//检查url重复
	var checkUrl=function(url){
		var count=0;
		for(var i=0;i<viewsPools.length;i++)
		{
			var item=viewsPools[i],
					_url=item.url;
			if(_url===url)
			count++;
		}

		return count;
	}

	//检查重复
	var checkrepeat=function(object){
		 var _this=this,
		 		 bool=true,
		 		 $this=$(this),
		 		 options=$this.data("sweetMutilViews.options"),
		 		 url=object.url,
		 		 id=object.id;
		 for(var i=0;i<viewsPools.length;i++)
		 {
		  	var item=viewsPools[i];
		  	if(item.url === url)
		  	{	
		  		if(checkUrl(url) >= options.samePages)
		  		{
		  			if(typeof(options.checkSame)=="function")bool=options.checkSame({
		  				samePages:options.samePages,
		  				page:object
		  			});
		  			if(bool)
		  			{
		  				SWTOOL.layer.msg("最多可打开"+options.samePages+"个相同链接的标签页");
		  				deleteTab.call(_this,item.id);
		  			}
		  		}
		  		return false;
		  	}
		  	
		 }
	}

	//根据单个标签页进行绑定
	var eventInitByOne=function(activeiframe){
		var $activeiframe=$(activeiframe),
				iframewindow=$activeiframe[0].contentWindow;
		$activeiframe.load(function(){
			 console.log(SweetMenus)
		})
	}

	//全局事件绑定
	var eventsInit=function(){
			var _this=this;

			$(this).on('click','.deletetab',function(){
				var $this=$(this),
						active=$this.parents("a[role=tab]").hasClass("active"),
						id=$this.data("id");
				deleteTab.call(_this,id);

				if(active)
				activeLastOne.call(_this);
				return false;
			})
	}

	//方法集
	var methods={
			open:function(object){
				addTabs.call(this,object,true)
			}
	}

	//绑定元素
	$.fn.mutilViews=function(options){

		//区分1个参数还是2个参数
		var args=arguments.length;
		//初始化渲染
		if(args===1&&typeof(options)=="object")
		{
			 var data=new Object();
			 data.skin=options.skin;
			 var html=require("./tpl.html");
			 $(this).html(html(data));
			 init.call(this,options);
		}
		else if(typeof(options)=="string"&&args===2)
		{
			 var eventName=arguments[0],
			 		 options=arguments[1];

			 methods[eventName].call(this,options);
		}
	}

})(jQuery)