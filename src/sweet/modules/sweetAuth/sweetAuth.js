/*
 * =====================================
 * name    : sweetAuth 权限控制
 * version : v1.0.0
 * time    : 2017-08-25 09:59:47
 * auth    : huyingjun
 * e-mail  : yingjun.hu@geely.com
 * =====================================
 */

(function($){
	var sweetDiff=require("sweetDiff");
	var dd=new sweetDiff();

	var SweetAuth=function(options,$controls){
			var _this=this;
			this.options=options;
			this.$controls=$controls;

			var methods={
					hide:function(){
						var $this=$(this);
						$this.hide();
					},
					disable:function(){
						var $this=$(this);
						$this.attr("disabled","disabled");
					},
					show:function(){
						var $this=$(this);
						$this.show();
					}
			}

			var eachControl=function(){
					var options=this.options;
					this.$controls.each(function(index){
						var formatter=options.formatter;
						var $this=$(this),
								code=$this.data("code");
						if(typeof(formatter)=="function")
						{
								formatter(code,$this);
						}
						else if(typeof(formatter)=="object")
						{
								var type = macthformatter(code,formatter);
								methods[type].call(this);
						}
					})
			}

			var macthformatter=function(code,formatter){

					for(var key in formatter)
					{
						var item=formatter[key],
								//首先判断key是多个还是单个
								ismutil=key.split(",").length>1?true:false;

						if(key.indexOf(code)>=0)
						{
							if(typeof(item)=="function")
							{
								return item();
							}
							else
							{
								return item;
							}
						}	
					}
			}

			this.authing=function(){
					eachControl.call(this);
			}
	}


	var checkAuth=function(targetCode,codes){
			var $this=$(this),
					options=$this.data("sweetAuth.options"),
					limit=options
					codes = codes.split(",");

	}

	$.fn.sweetAuth=function(options){
		var $this=$(this),
				limit=options.limit,
				code=options.code,
				formatter=options.formatter,
				$controls=$this.find("[sw-plugin=sweet-auth]");

		if(!code)return;
		var swa=new SweetAuth(options,$controls);
		// $("#sweetRoot")[0].addEventListener("DOMSubtreeModified",function(event){
		// 	//每次变化都去对比 -- 性能？
		// 	//每次变化
		// })
		swa.authing();
	}
})(jQuery)