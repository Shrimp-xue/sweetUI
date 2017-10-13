const i18next = require('i18next');
const i18nextXHRBackend = require('i18nextXHRBackend');
const i18nextBrowserLanguageDetector = require('i18nextBrowserLanguageDetector');
const i18nextLocalStorageCache = require('i18nextLocalStorageCache');

const sweetI18n = function() {
    // if (window.sweetI18n) return window.sweetI18n;
    let options,callback;
    if(typeof arguments[0] === 'object'){
    	options = arguments[0];
    	callback = arguments[1];
    }else if (typeof arguments[0] === 'function'){
    	options = {};
    	callback = arguments[0];
    }
    //需要注意 赋值参数的时候选择拷贝而不是赋值，不选择赋值给一个空对象的话，会导致内存地址还是一致，导致多实例化时出现bug
    this.opts = $.extend(true,{},this.defaluts, options);
    // window.sweetI18n = this;
    return this.init(callback);
};

sweetI18n.prototype = {
    constructor: sweetI18n,
    defaluts: {
        detection:{
            order:['htmlTag']
        },  
        fallbackLng: 'zh-CN',
        debug: true,
        ns: ['common'],
        defaultNS: 'common',
        backend: {
            loadPath: appConfig.baseURL+'/locales/{{lng}}/{{ns}}.json',
            // crossDomain: true
        }
    },
    init: function(callback) {
        const that = this;
        //创建实例
        const createInstance=i18next.createInstance();
        that.promise = new Promise(function(resolve,reject){
            that.i18next = createInstance
            .use(i18nextXHRBackend)
            .use(i18nextBrowserLanguageDetector)
            .init(that.opts, function(err, t){
                if (err) return console.log('something went wrong loading', err);
                if(that.opts.renderDom) that.render(that.opts.renderDom);
                if (typeof callback === 'function') callback.call(that,err,t);
                //异步传递
                resolve(that);
            });
        })

        return this;

    },
    
    render: function(selector,type) {
        const that = this;
        let $selector = $(selector);

        //如果不开启渲染模式并且type为编译的话
        if(!that.opts.enable&&type!=='compile')return;
      
        if(typeof(selector) == 'object')$selector = selector;
        selector = selector ? selector : document;
        $selector.find('[data-i18n]').each(function(){
            const self = $(this);
            const [key, options] = [self.data('i18n'), self.data('i18n-options')];
            console.log(key);
            const val = that.i18next.t(key, options ? options : {});
            self.text(val);
        });


        $selector.find("[data-i18n-placeholder]").each(function(){
            const self = $(this);
            const [key, options] = [self.data('i18n-placeholder'), self.data('i18n-options-placeholder')];

            const val = that.i18next.t(key, options ? options : {});
            self.attr("placeholder", val);
        });

        if(type === 'compile')
        return selector;


        return this;

    },
    changeLanguage:function(lng, callback){
        var that=this;
        that.i18next.changeLanguage(lng,function(err,t){
            if (err) return console.log('something went wrong loading', err);
            if(that.opts.renderDom) that.render(that.opts.renderDom);
            if(typeof(callback)=="function")callback(err,t);
            sweetHandler.init(that.opts.renderDom);
        });
        
    },
    compile:function(html,callback,targetLang){
        var that=this;
            $newElement=$("<div>"+html+"</div>");
        that.promise.then(function(instance){
            if(!targetLang)targetLang=instance.i18next.language;
            instance.i18next.changeLanguage(targetLang,function(){
                var $html=instance.render($newElement,"compile");
                if($html&&typeof(callback)=="function")callback($html.html())
            }) 
        })
        // return $compile.html();    
    },
    t: function() {
        return this.i18next.t(arguments);
    }


};

module.exports = sweetI18n;