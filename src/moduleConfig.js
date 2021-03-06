var moduleConfig = {
    root: '', //配置项目存放的文件夹，如果在servers根目录下不填即可，修改完需要重新编译
    alias: { //配置需要引入的JS模块

        appConfig                      : "appConfig.js",

        // Sweet模块
        SWEET                          : "sweet/sweet.core.js",
        sweetController                : "sweet/sweet.controller.js",
        sweetRouter                    : "sweet/modules/router.js",
        sweetHandler                   : "sweet/modules/handler.js",
        // sweetValid                  : "sweet/modules/valid.js",
        sweetFrameMenu                 : "sweet/modules/frameMenu.js",
        sweetNotify                    : "sweet/modules/notify.js",
        sweetCheckLogin                : "sweet/modules/checkLogin.js",
        sweetXhr                       : "sweet/modules/xhr.js",
        sweetTool                      : "sweet/modules/tool.js",
        sweetFullScreen                : "sweet/modules/fullScreen.js",
        sweetlinkMap                   : "sweet/modules/linkMap.js",
        sweetScroller                  : "sweet/modules/sweetScroller/sweetScroller.js",
        sweetAudio                     : "sweet/modules/sweetAudio/sweetAudio.js",
        sweetValid                     : "sweet/modules/sweetValid/validform.js",
        sweetAsider                    : "sweet/modules/sweetAsider/asider.js", //侧边栏
        sweetMutilViews                : "sweet/modules/sweetMutilViews/sweetMutilViews.js",
        sweetAuth                      : "sweet/modules/sweetAuth/sweetAuth.js",
        sweetDiff                      : "sweet/modules/sweetDiff/sweetDiff.js",
        sweetI18n                      : "sweet/modules/sweetI18n/sweetI18n.js",
        swZtree                        : "sweet/modules/sweetZtree/sweetZtree.js", //自定义树形结构
        swSelect                       : "sweet/modules/sweetSelect/sweetSelect.js",
        sweetDrop                      : "sweet/modules/drop/drop.js",
        sweetDemoBox                   : "sweet/modules/sweetDemo/demoBox/demoBox.js",
        sweetUploaderCroper            : "sweet/modules/sweetUploaderCroper/sweetUploaderCroper.js",
       
        jquery                         : "plugins/vendors/jquery.min.js",
        xhrover                        : "plugins/vendors/xhrover.js",
        jqueryValidform                : "plugins/vendors/jquery-validform.js",
        jquertSelect2                  : "plugins/vendors/select2.js",
        jquerymagnific                 : "plugins/vendors/jquery.magnific-popup.js",
        swiper                         : "plugins/vendors/swiper.min.js",
        pace                           : "plugins/vendors/pace.js",
        notify                         : "plugins/vendors/notify.js",
        ztree                          : "plugins/vendors/jquery.ztree.all.js", //树结构
        selectZh                       : "plugins/vendors/select2-zh-CN.js",
        tagsInput                      : "plugins/vendors/bootstrap/bootstrap-tagsinput.js",
        switchery                      : "plugins/vendors/switchery.js",
        peity                          : "plugins/vendors/jquery.peity.js",
        echarts                        : "plugins/vendors/echarts.js",
        bmap                           : "plugins/vendors/bmap/bmap.js",  //百度地图
        director                       : "plugins/vendors/director.js",
        layer                          : "plugins/vendors/layer.js",
        template                       : "plugins/vendors/template-web.js",
        scrollBar                      : "plugins/vendors/jquery.mCustomScrollbar.js",
        mousewheel                     : "plugins/vendors/jquery.mousewheel.js",
        prism                          : "plugins/vendors/prism.js",
        moment                         : "plugins/vendors/moment/moment.js",
        bootstrapDatePick              : "plugins/vendors/bootstrap/bootstrap-datepicker.js",
        bootstrapTimePick              : "plugins/vendors/bootstrap/bootstrap-timepicker.js",
        bootstrapDateTimePick          : "plugins/vendors/bootstrap/bootstrap-dateTimePicker/bootstrap-datetimepicker.js",
        bootstrapColorPick             : "plugins/vendors/bootstrap/bootstrap-colorpicker.js",
        bootstrapDateRangePick         : "plugins/vendors/bootstrap/daterangepicker.js",
        bootstrapClockPick             : "plugins/vendors/bootstrap/bootstrap-clockpicker.js",
        bootstrapTable                 : "plugins/vendors/bootstrapTable/bootstrap-table.js",
        bootstrapTableEdit             : "plugins/vendors/bootstrapTable/extensions/editable/bootstrap-table-editable.js",
        bootstrapTableEditUi           : "plugins/vendors/bootstrapTable/extensions/editable/bootstrap-table-editable-ui.js",
        bootstrapTableLang             : "plugins/vendors/bootstrapTable/locale/bootstrap-table-zh-CN.js",
        bootstrapSelect                : "plugins/vendors/bootstrap-select/bootstrap-select.js",
        jqueryValidate                 : "plugins/vendors/jquery-validation/jquery.validate.js",
        jquerySteps                    : "plugins/vendors/jquery.steps/jquery.steps.js",
        jqueryWizard                   : "plugins/vendors/jquery-validation/jquery.wizard-init.js",
        velocity                       : "plugins/vendors/velocity.js",
        hammer                         : "plugins/vendors/hammer.js",
        dropdown                       : "plugins/vendors/bootstrap/dropdown.js",
        tooltip                        : "plugins/vendors/bootstrap/tooltip.js",
        button                         : "plugins/vendors/bootstrap/button.js",
        popover                        : "plugins/vendors/bootstrap/popover.js",
        collapse                       : "plugins/vendors/bootstrap/collapse.js",
        transition                     : "plugins/vendors/bootstrap/transition.js",
        tabs                           : "plugins/vendors/bootstrap/tabs.js",
        waves                          : "plugins/vendors/waves.js",
        webupload                      : "plugins/vendors/webuploader.js",
        ZeroClipboard                  : "plugins/vendors/ZeroClipboard.js",
        cityPicker                     : "plugins/vendors/city-picker/city-picker.js",
        ChineseDistricts               : "plugins/vendors/city-picker/city-picker.data.js",
        PCAS                           : "plugins/vendors/PCASClass.js",
        multiSelect                    : "plugins/vendors/jquery.multi-select.js",
        quicksearch                    : "plugins/vendors/jquery.quicksearch.js",
        bootstrapEditable              : "plugins/vendors/bootstrap-editable.js",
        touchspin                      : "plugins/vendors/bootstrap-touchspin/jquery.bootstrap-touchspin.js",
        cropper                        : "plugins/vendors/cropper.js",
        ueditor                        : "plugins/vendors/ueditor/ueditor.index.js",
        sortable                       : "plugins/vendors/Sortable.js",
        lazyload                       : "plugins/vendors/jquery.lazyload.js",
        pagination                     : "plugins/vendors/jquery.pagination.js",
        typeahead                      : "plugins/vendors/typeahead/typeahead.js",
        i18next                        : "plugins/vendors/i18next/i18next.js",
        i18nextXHRBackend              : "plugins/vendors/i18next/i18nextXHRBackend.js",
        i18nextBrowserLanguageDetector : "plugins/vendors/i18next/i18nextBrowserLanguageDetector.js",
        i18nextLocalStorageCache       : "plugins/vendors/i18next/i18nextLocalStorageCache.js",
        mermaid                        : "plugins/vendors/mermaid/mermaid.js",
        
        //自定义插件
        multipleBrandList              : "plugins/util/multipleBrandList.js",
        stree                          : "plugins/util/stree.js",
        sSelect                        : "plugins/util/sSelect.js",
        evaluate                       : "plugins/util/evaluate.js",
        Validform                      : "plugins/util/validform.js",
        suiPeity                       : "plugins/util/peity.js",
        swEcharts                      : "plugins/util/swecharts.js",
        sw_editbox                     : "plugins/util/sw_editbox.js",
        commonTableOption              : "plugins/util/commonTableOption.js",

    },
    global: { //定义引入模块的全局对象，方便不需要require 直接使用
        $               : 'jquery',
        jQuery          : 'jquery',
        "window.jQuery" : 'jquery',
        Sweet           : 'SWEET',
        sweetHandler    : 'sweetHandler',
        appConfig       : 'appConfig',
        layer           : 'layer',
        template        : 'template',
        Switchery       : "switchery",
        Select2         : "sSelect",
        bootstrapSelect : "bootstrapSelect",
        SWXHR           : "sweetXhr",
        SWTOOL          : "sweetTool",
        SWCheckLogin    : 'sweetCheckLogin',
        xhrover         : "xhrover"
    }
};


module.exports = moduleConfig;
