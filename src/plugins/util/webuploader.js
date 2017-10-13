var WebUploader = require("webupload");
var webUploaderCtl = {
    init: function(option) {
    	var _this=this;
    	return _this.webuploder.init(option);
    },
    webuploder: {
        init: function(option) {
            var _this = this;
            return _this.handler(option);
        },
        handler: function(option) {
            var _this = this;
            var uploder = _this._uploaderInit(option);
            console.log(uploder)
            return uploader;
        },
        _uploaderInit: function(option) {
            var webupload = WebUploader.create(option);

            return webupload;
        }
    }
}
module.exports = webUploaderCtl;
