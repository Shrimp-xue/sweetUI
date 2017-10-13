var sweetFullScreen = function(selector) {
    this.$body = $("body");
    this.$fullscreenBtn = $(selector);
};

//turn on full screen
// Thanks to http://davidwalsh.name/fullscreen
sweetFullScreen.prototype.launchFullscreen = function(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};
sweetFullScreen.prototype.exitFullscreen = function() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};
//toggle screen
sweetFullScreen.prototype.toggle_fullscreen = function() {
    var $this = this;
    var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
    if (fullscreenEnabled) {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $this.launchFullscreen(document.documentElement);
        } else {
            $this.exitFullscreen();
        }
    }
};
//init sidemenu
sweetFullScreen.prototype.init = function() {
    var $this = this;
    //bind
    $this.$fullscreenBtn.on('click', function() {
        $this.toggle_fullscreen();
    });
};

module.exports = sweetFullScreen;
