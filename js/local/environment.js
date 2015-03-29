function get_menus() 
{
	$.post("src/dispatcher.php", {
		"func" : "get_menu",
	}, function(data) {
		var menus = "<ul class='nav navbar-nav'>";
		for (var key in data) {
			menus += "<li id='navbar_" + key + "'><a href='" + data[key][0]+ "'>" + data[key][1] + "</a></li>";
			$('#navbar').html(menus);
		}
		menus +="</ul>";
		$('#navbar_6').addClass('active');
	}, "json");
}

function get_content(id)
{
	$.post("src/dispatcher.php", {
		"func" : "get_one", 
		"id" : id
	}, function(data) {
		var content = "<center><h3>" + data[1] + "</h3></center>";
		content += "<p class='text-right'>发布时间: 来源: 作者: </p>";
		content += "<hr/>";
		content += data[2];
		$('#submenu_title').html(content);
	}, "json");
}

function switch_submenu(type) 
{
	var sub_nav = "<ol class='breadcrumb'><li><a href='index.html'>首页</a><li><a href='#'>种植</a></li>";
	$.post("src/dispatcher.php", {
		"func" : "get_all_content",
		"type" : type
	}, function(data) {
		var titles_str = "<div class='row'>";
		for (var i in data) {
			var img_name = $($(data[i][3])).find('img').attr('src');
			titles_str += "<div class='col-xs-6 col-md-3'><a href='#' class='thumbnail'><img src='" + img_name + "' alt='' style='height:150px;'>";
			titles_str += "<div class='caption'><center>" + data[i][1] + "</center></div></a></div>";
		}

		titles_str += "</div></div>";
		$('#submenu_title').html(titles_str);
	}, "json");
	//设置子导航
	sub_nav += "<li><a href='#'>" + $.cookies.get('submenu')[type] + "</a></li>";
	sub_nav += "</ol>";
	$('#sub_nav').html(sub_nav);
}

$(document).ready(function(){
	var view_type = $.cookies.get('view_type');
	if (view_type == null || view_type == 0) {
		view_type = 601;
	}

	var sub_nav = "<ol class='breadcrumb'><li><a href='index.html'>首页</a><li><a href='#'>种植</a></li>";
	var type = parseInt(view_type / 100);
	//generator navbar
	get_menus();
	//生成小菜单
	$.post("src/dispatcher.php", {
		"func" : "get_submenu",
		"index" : type
	}, function(data) {
		$.cookies.set("submenu", data);
		var submenu_str = "<ul class='nav nav-pills nav-stacked' role='tablist'>";
		for (var key in data) {
			submenu_str += "<li role='presentation' id='submenu_li_" + key + "'><a href='#submenu_" + key + 
		"' aria-controls='home' role='tab' data-toggle='tab' onclick='switch_submenu(" + key +")'>" + data[key] + "</a></li>";
		}
		submenu_str += "</ul>";
		$('#submenus').html(submenu_str);
		$('#submenu_li_' + view_type).addClass("active");
		/*var view_id = $.cookies.get('view_id');*/
		/*if (view_id != null && view_id != 0) {*/
		/*get_content(view_id);*/
		/*$.cookies.set('view_id', 0);*/
		/*} else {*/
			switch_submenu(view_type);
			/*}*/
		$.cookies.set('view_type', 0);

		//设置子导航
		sub_nav += "<li><a href='#'>" + $.cookies.get('submenu')[view_type] + "</a></li>";
		sub_nav += "</ol>";
		$('#sub_nav').html(sub_nav);
	}, "json");

	//默认加载第一个小类别
	/*switch_submenu(view_type);*/
});

