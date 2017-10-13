class SweetScroller {
	  switch(){
	  	if(!this.iswork&&this.iswork!=0)
	  	this.iswork=1;

	  	return this.iswork;
	  }

		init(currentPageSelector,success,error){
			let _this=this;
			_this.iswork=1;
			_this.isworking=0;
			$(window).off("scroll").on("scroll", function() {
				if($(currentPageSelector).length!=0)
				{
					 var scrollTop = SWTOOL.windowScroller.getScrollTop(),
               windowHeight = SWTOOL.windowScroller.getWindowHeight(),
               scrollHeight = SWTOOL.windowScroller.getScrollHeight(),
               iswork = _this.switch();
           console.log(scrollTop+","+windowHeight+","+scrollHeight+","+iswork)
          if (scrollTop + windowHeight == scrollHeight) {
             if(typeof(success)=="function" && iswork && !_this.isworking)
						 {
								success.call(_this);
						 }
						 else if(typeof(error)=="function" && !iswork)
						 error.call(_this);
          }
				}
			})
			return this;
		}

		refresh()
		{
			this.iswork=1;
			this.isworking=0;
		}
}
var sweetscroller=new SweetScroller();
module.exports=sweetscroller;