/*
 * =====================================
 * name    : sweetDemoBox
 * version : v1.0.0 es6
 * time    : 2017-09-04 14:53:14
 * auth    : huyingjun、wangjianchao
 * e-mail  : yingjun.hu@geely.com
 * =====================================
 * update  : 解决多次初始化导致布局混乱问题
 * time    : 2017-09-05 10:41:59
 * auth    : huyingjun
 * e-mail  : yingjun.hu@geely.com
 * =====================================
 */
(function() {
    //提供外部方法集合
    class sweetDemoBoxMethods{
        test($this){
            console.log($this.find('.topContainer').html());
        }
    }

    //文档盒子组件 
    class sweetDemoBox extends sweetDemoBoxMethods{
        //默认构造函数
        constructor(options,methodOptions){
            // super方法必须被调用, 否则编译不通过
            // 如果super在赋值属性this.xx = xx,后边调用,会报错'this' is not allowed before super()
            super(options,methodOptions);
            var that=this;
            this.methodOptions = methodOptions;
            this.options = {
                toggleElement:'',
                hide:true,
                time:200
            }
            //如果是对象则渲染实例化
            if(typeof(options)!="string")
            {
                that.options = $.extend(true, that.options, options);
                that.method = 'render';
            }
            //如果是字符串则执行方法
            else that.method = options;
        }
        replaceHtml($this){
            var options=this.options;
            const setTime = options.time;
            const isHide = options.hide;
            let isCollapase = isHide ? isHide : false;

            var repHtml = $this.find(options.toggleElement).html();
            var icon = isCollapase ? 'icon-sanjiao_xia_shixin' : 'icon-sanjiao_shang_shixin';
            var html = '<div class="code-box-contain sw-collapse">' +
                repHtml +
                '</div>' +
                '<div class="code-box-button">' +
                    '<a class="collapaseBtn">' +
                        '<span style="display:inline-block" class="arrows"><i class=" iconfont ' + icon + '"></i></span>' +
                        '<span class="text show-text">显示代码</span>' +
                        '<span class="text hide-text">隐藏代码</span>' +
                    '</a>' +
                '</div>';
            $this.find(options.toggleElement).html(html);
            $this.attr("data-id","demoBoxIds-"+(new Date().getTime()));
            //增加回调
            if(typeof(options.success)=="function")options.success($this);


            //绑定事件
            this.events($this);
        }
        events($this){
            let deg = 0;
            const that = this,
                  setTime = that.options.time;

            $this.off().on("click",".code-box-button",function(){
                $(this).prev().slideToggle(setTime);
                $(this).toggleClass('open');
                // deg += 180
                // $(this).find('.arrows').css('transform', 'rotate(' + deg + 'deg)');
            })
        }
        isHide($this){
            const that = this,
                  isHide = that.options.hide;
            if (isHide) {
                $this.find(".sw-collapse").css('display', 'none');
            }
        }
        render($this){
            const object = $this.data("sweetDemoBox");
            if(object)return;
            this.replaceHtml($this);
            this.isHide($this);
            $this.data("sweetDemoBox",this);
        }
        init($this){
            var that = this;
            if(typeof(that[that.method])=="function")
            {
                that[that.method]($this);
            }
        }
    }

    //绑定器
    $.fn.sweetDemoBox = function(){
        var $this = $(this),
            _arguments = arguments;

        $this.each(function(){
            var $this = $(this);
            var demobox = new sweetDemoBox(_arguments[0],_arguments[1]);
            demobox.init($this);  
        })
    }
})(jQuery)