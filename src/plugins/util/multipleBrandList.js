var multipleBrandList = function (el, options, cb) {
	if (!(this instanceof multipleBrandList)) return new multipleBrandList(el, options, cb);

	var mbl = this,
	def = {
		level: 3,
		letterNav: true
	};
	// template = {
	// 	brandContainer: `
	// 		<div class="brand_bg">
	// 			<div class="brand_letters"></div>
	// 			<div class="brand_name_bg">
	// 				<div class="brand_name"></div>
	// 			</div>
	// 		</div>`,
	// 	brandLeftList: `<span data-char="{code} data-target="#brand_indexLetter{code}"><a href="javascript:;">{code}</a></span>`,
	// 	brandRightContainer: `<dl id="brand_indexLetter{code}"></dl>`,
	// 	brandRightList: `<dd><a data-brandId="{brandId}" href="javascript:;">{name}</a></dd>`,
	// 	seriesContainer: `<div class="series_bg" style="left:181px"></div>`,
	// 	seriesList: ``,
	// 	modelContainer: `<div class="model_bg" style="left:362px"></div>`,
	// 	modelList: ``
	// };
	
	mbl.allBrandDic = {};
	mbl.allSeriesDic = {};
	mbl.allModelDic = {};
	
	// 生成列表一层结构
	mbl.initBrandConatiner = function (res) {
		var brandBg = $("<div>").addClass("brand_bg"),
		leftArea, rightArea;
		if (options.letterNav) {
			leftArea = $("<div>").addClass("brand_letters"),
			rightArea = $("<div>").addClass("brand_name_bg").append($("<div>").addClass("brand_name"));
			brandBg.append(leftArea).append(rightArea);
			this.dealWithIndexData(res, brandBg, leftArea, rightArea);
		} else {
			leftArea = $("<div>").addClass("brand_name_only_bg").append($("<div>").addClass("brand_name_only"));
			brandBg.append(leftArea);
			this.dealWithIndexData(res, brandBg, leftArea);
		}
	}

	// 处理首页数据并放入列表
	mbl.dealWithIndexData = function(res, brandBg, leftArea, rightArea) {
		mbl.allBrandDic = res;
		if (options.letterNav) {
			$.each(res.data, function (key, value) {
				var leftCell = $("<span>").append($("<a>").html(key).attr("href", "javascript:;").attr("data-char", key).attr("data-target", "#brand_indexLetter" + key));
				leftArea.append(leftCell);
				rightArea.children(".brand_name").append($("<dl>").attr("id", "brand_indexLetter" + key));
				value.forEach(function (val, index) {
					var rightCell = $("<dd>").append(mbl.createIndexElementA(val.brandName, val.brandId));
					rightArea.children(".brand_name").children("#brand_indexLetter" + key).append(rightCell);
				})
			})
		} else {
            $.each(res.data, function (key, value) {
				leftArea.children(".brand_name_only").append($("<dl>").attr("id", "brand_indexLetter" + key));
				value.forEach(function (val, index) {
					var leftCell = $("<dd>").append(mbl.createIndexElementA(val.brandName, val.brandId));
					leftArea.children(".brand_name_only").children("#brand_indexLetter" + key).append(leftCell);
				})
			})
		}
		mbl.container.append(brandBg);
	}

	// 处理二级页面
	mbl.initSeriesContainer = function (res, cb) {
		mbl.allSeriesDic = res;
		var childContainer = $("<div>").addClass("series_bg").css("left", "181px");
		this.dealWithChildListData(res, childContainer, "series", cb);
	}

	// 处理三级页面
	mbl.initModelContainer = function (res, cb) {
		mbl.allModelDic = res;
		var childContainer = $("<div>").addClass("model_bg").css("left", "362px");
		this.dealWithChildListData(res, childContainer, "model", cb);
	}


	// 子级页面列表处理逻辑
	mbl.dealWithChildListData = function (res, childContainer, idType, cb) {
		var childArea = $("<div>").addClass("brand_name_bg").append($("<div>").addClass("brand_name"));
		childArea.children(".brand_name").append($("<dl>"));
		if (res.data.length) {
			res.data.forEach(function (value, index) {
				var childCell = $("<dd>").append(mbl.createChildElementA(value, idType, cb))
				childArea.find("dl").append(childCell);
			})
		} else {
			childArea.find("dl").append($("<dd>").append($("<p>").html("暂无更多车型")));
		}
		if (mbl.container.find("." + idType + "_bg").length) {
			mbl.container.find("." + idType + "_bg").html(childArea);
			return;
		}
		childContainer.append(childArea);
		mbl.container.append(childContainer);
	}

	mbl.createIndexElementA = function (name, id) {
		return $("<a>").html(name)
					.attr("data-brandId", id)
					.attr("href", "javascript:;")
					.on("click", function (e) {
						e.stopPropagation();
						$(".series_bg").css("display", "block");
						if ($(".brandBox").find(".model_bg").length) {
							$(".model_bg").css("display", "none");
						}
						$(this).parent().parent().parent().find(".current").removeClass("current");
						$(this).addClass("current");
						cb(mbl, e, $(this));// ajax request here...
						if (options.level === 1) {
							$(".brandBox").css("display", "none");
						}
					})
	}

	mbl.createChildElementA = function (value, idType, cb) {
		return $("<a>").html(value.modelName)
					.attr("data-" + idType + "Id", value[idType + "Id"])
					.attr("href", "javascript:;").attr("title", value[idType + "Name"])
					.html(value[idType + "Name"])
					.on("click", function (e) {
						if (idType === "model") {
							cb(mbl, e, $(this))
						} else {
							cb(mbl, e, $(this));
							if (options.level === 2) {
								$(".brandBox").css("display", "none");
								$(".series_bg").css("display", "none");
								return;
							}
							$(this).parent().parent().parent().find(".current").removeClass("current");
							$(this).addClass("current");
							$(".model_bg").css("display", "block");
						}
					})
	}

	// 初始化方法
	mbl.init = function() {
		$(el).append($("<div>").addClass("brandBox"));
		this.container = $(el).find(".brandBox");
		$(el).find("input").on("focus", function (e) {
			if (!$(".brandBox").children().length) {
				$.get(options.url, function (res) {
					mbl.initBrandConatiner(res);
					$(".brandBox").css("display", "block");
				})
			} else {
				$(".brandBox").css("display", "block");
			}
		})
		$(document).on("click", "a[data-target]", function (e) {
			$($(this).attr("data-target"))[0].scrollIntoView();
			$(this).parent().parent().find(".current").removeClass("current");
			$(this).addClass("current");
		})
		$(el).find("input").on("click", function (e) {
			e.stopPropagation();
		})
		$(document).on("click", function (e) {
			$(".brandBox").css("display", "none");
			$(".brandBox").children().not(".brand_bg").css("display", "none");
		})

		if ( typeof cb === "function" ) {
			$(document).on("click", ".brandBox", function (e) {
				e.stopPropagation();
			})
		}
	}

	// 如果列表已存在，则返回
	if ($(el).find(".brandBox").length > 0) return;
	// 若列表不存在，绑定获取焦点事件
	if ($(el).find(".brandBox").length === 0) {
		mbl.init();
	}

	return mbl;
}

multipleBrandList.prototype = {
	getAllBrand: function () {
		return this.allBrandDic;
	},

	getAllSeries: function () {
		return this.allSeriesDic;
	},

	getAllModel: function () {
		return this.allModelDic;
	},

	addSeriesBox: function (res, cb) {
		return this.initSeriesContainer(res, cb);
	},

	addModelBox: function (res, cb) {
		return this.initModelContainer(res, cb);
	}

}

module.exports = multipleBrandList;
