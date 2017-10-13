var webupload = require('webupload')
var cropper = require('cropper')
var temp = require("./template.tpl");
var editHeadAction = {
    init: function(options) {
        this.uploadInit(options)
    },
    getWindowsTemplate: function() {
        return temp();
    },
    uploadInit: function(options) {
        var _this = this,
            html = _this.getWindowsTemplate(),
            title = options.title,
            area = options.area;
        $(options.el?options.el:".sweetUploaderCroper").on('click', function() {
            layer.open({
                title: title,
                area: area?area:["700px","500px"],
                content: html,
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    _this.cropper.saveAvatar(options);
                    layer.close(index)
                },
                btn2: function() {

                }
            })
            _this.configUploader(options)

        })
    },
    configUploader: function(options) {
        var _this = this
        var uploader = webupload.create({
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id: '#sw-uploader-croper #picker',
                multiple: false
            },
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/jpg,image/jpeg,image/png'
            },
            fileNumLimit: 1
        });
        _this.uploader = uploader
        uploader.on('fileQueued', function(file) {
            uploader.makeThumb(file, function(error, ret) {
                if (error) {
                    SWTOOL.layer.msg("预览错误")
                } else {
                    $('.container').append('<img alt="" src="' + ret + '" />');
                    _this.cropper.init(options);
                }
            }, 1, 1);
        });
    },
    cropper: {
        init: function(options) {
            var that = this;
            that.config(options)
        },
        getCroperImg:function(options){
            var _this = this;
            $('#sw-uploader-croper .container > img').cropper('getCroppedCanvas').toBlob(function(blob){
                _this.avatarBlob = blob;
                var url = URL.createObjectURL(blob);
                $('#sw-uploader-croper #cropperImg').attr('src', url).show();
            })
        },
        config: function(options) {
            var _this = this;
            $('#sw-uploader-croper .container > img').cropper({
                cropBoxResizable:false,
                aspectRatio: 1 / 1,
                ready:function(){
                     _this.getCroperImg(options)
                },
                cropend: function() {
                    _this.getCroperImg(options)
                }
            })
        },
        saveAvatar: function(options) {
            var that = this,
                formData = new FormData(),
            		url = URL.createObjectURL(that.avatarBlob);
            formData.append("file", that.avatarBlob);
            if (typeof(options.getCoperImage) != "undefined") {
                options.getCoperImage({
                	url:url,
                	blob:that.avatarBlob,
                	formData:formData
                });
            }
        }
    }
};
module.exports = editHeadAction;
