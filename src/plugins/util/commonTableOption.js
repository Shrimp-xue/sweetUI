var commonTbOption = function(opts) {
    var defaults = {
        height: 600,
        paginationLoop: false,
        toolbar: "#toolbar",
        sortable: true,
        pagination: true,
        pageList: [10],
        showRefresh: false,
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        iconsPrefix: "ion",
        sidePagination: "server",
        contentType: "application/x-www-form-urlencoded",
        method: "get",
        pageNumber: 1,
        pageSize: 10,
        responseHandler: function(res) {
            if (res.code == "NOT_LOGIN") {
                window.location.href = "#/login";
            } else {
                console.log(res);
                var newRes = {
                    "total": res.data.total,
                    "rows": res.data.items
                };
                return newRes;
            }
        },
        queryParams: function(queryParams) {
            var newParams = {
                pageNum: queryParams.pageNumber,
                pageSize: queryParams.pageSize
            };
            return newParams;
        },
        queryParamsType: "",
        icons: {
            refresh: 'ion-android-refresh'
        },
        onLoadSuccess: function() {
            console.log('success');
        },
        onLoadError: function() {
            console.log('error');
        },
        onPostBody: function(row) {
            console.log('onPostBody');
        },
        rowStyle: function(row, index) {
            if (!row.status) {
                return {
                    classes: "unline"
                };
            } else {
                return {
                    classes: "online"
                };
            }
        }
    };

    var newOpt = $.extend(defaults,opts);
    return newOpt;

};


module.exports = commonTbOption;
