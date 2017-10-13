var peity = require('peity');

var action = {
    init: function() {
        $('[sw-plugin^="peity"]').each(function() {
            var $this = $(this),
                type = $this.attr('sw-plugin').split('-')[1],
                width = $this.attr('data-width'),
                height = $this.attr('data-height'),
                colors = $this.attr('data-colors'),
                fill = $this.attr('data-fill'),
                stroke = $this.attr('data-stroke'),
                option = $this.attr('data-peity'),
                isupdate = $this.attr('data-update'),
                timer=$this.attr('data-diameter');

            option = option ? option : {
                height: height,
                width: width,
                fill: colors ? colors.split(',') : fill,
                stroke: stroke
            }
            $this.peity(type, option);

            if (isupdate) {
                setInterval(function() {
                    var random = Math.round(Math.random() * 10)
                    var values = $this.text().split(",")
                    values.shift()
                    values.push(random)

                    $this
                        .text(values.join(","))
                        .change()
                },timer)
            }
        })
    }
}
module.exports = action;
