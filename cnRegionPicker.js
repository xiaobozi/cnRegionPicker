(function($) {
	$.fn.cnRegionPicker = function(options) {
		// 获取配置
		var settings = $.extend({
			'url' : '',
			'method' : 'post',
			'init' : false,
			'province' : null,
			'city' : null,
			'county' : null
		}, options);

		// 配置ajax连接
		$.ajaxSetup({
			url : settings.url,
			global : false,
			type : settings.method,
			dataType : 'json',
			error : function() {
				alert("获取json数据失败！");
			}
		});

		// 生成option函数
		function parse(select, regionArray) {
			$.each(regionArray, function(k, v) {
				var option = $("<option value='" + v.id + "'>" + v.name + "</option>");
				select.append(option);
			});
		}

		// 程序入口
		return this.each(function() {
			select_province = $(this).find("select:eq(0)");
			select_province.html("");
			select_province.append($("<option value='0'>请选择</option>"));
			select_city = $(this).find("select:eq(1)");
			select_county = $(this).find("select:eq(2)");

			$("document").ready(function() {
				// 初始化省份
				$.ajax({
					data : {
						parentid : 1
					},
					success : function(data) {
						parse(select_province, data);
						select_province.find("option[value='" + settings.province + "']").attr('selected', 'selected');
					}
				});

				// 初始化市
				if (settings.city) {
					$.ajax({
						data : {
							parentid : settings.province
						},
						success : function(data) {
							parse(select_city, data);
							select_city.find("option[value='" + settings.city + "']").attr('selected', 'selected');
						}
					});
				}

				// 初始化县
				if (settings.county) {
					$.ajax({
						data : {
							parentid : settings.city
						},
						success : function(data) {
							parse(select_county, data);
							select_county.find("option[value='" + settings.county + "']").attr('selected', 'selected');
						}
					});
				}
			});

			// 省份改变事件
			select_province.change(function() {
				select_city.html("");
				select_city.append($("<option value='0'>请选择</option>"));
				select_county.html("");
				var parentid = $(this).val();
				if (parentid <= 0)
					return;
				$.ajax({
					data : {
						parentid : parentid
					},
					success : function(data) {
						parse(select_city, data);
					}
				});
			});

			// 市改变事件
			select_city.change(function() {
				select_county.html("");
				select_county.append($("<option value='0'>请选择</option>"));
				var parentid = $(this).val();
				if (parentid <= 0)
					return;
				$.ajax({
					data : {
						parentid : parentid
					},
					success : function(data) {
						parse(select_county, data);
					}
				});
			});
		});
	};
})(jQuery);
