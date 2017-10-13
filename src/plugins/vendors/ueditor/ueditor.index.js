require("./ueditor.all.js")
require("./zh-cn.js");
var sweetUeditor={
		config:{
			UEDITOR_HOME_URL:"/thirdsources/ueditor.assets/", //资源路径
			serverUrl:""

		},
		init:function(element,options){
			var _this=this;
			$.extend(true,_this.config,options);
			//先销毁后初始化，解决二次初始化bug
			if(UE.delEditor&&typeof(UE.delEditor)=="function") UE.delEditor(element);
			var ue = UE.getEditor(element,_this.config);
			return ue;
		}
}
module.exports=sweetUeditor;