function show_menus(data, type)
{
	var menus = "<ul class='nav navbar-nav'>";
	for (var key in data) {
		menus += "<li id='navbar_" + key + "'><a href='" + data[key][0]+ "'>" + data[key][1] + "</a></li>";
		$('#navbar').html(menus);
	}
	menus +="</ul>";
	$('#navbar_' + type).addClass('active');
}

function get_menus(type) 
{
	var data = $.cookies.get('g_menu');
	if (data != null) {
		return show_menus(data, type);
	}

	$.post("src/dispatcher.php", {
		"func" : "get_menu",
	}, function(data) {
		$.cookies.set('g_menu', data);
		show_menus(data, type);
	}, "json");
}

function get_content(id)
{
	$.post("src/dispatcher.php", {
		"func" : "get_one", 
	"id" : id
	}, function(data) {
		var content = "<center><h3>" + data[1] + "</h3></center>";
		var from_type = ["原创", "转载"];
		content += "<p class='text-right'>发布时间: " + data[5]  + "     来源:" + from_type[data[4]] + "</p>";
		content += "<hr/>";
		content += data[2];
		$('#submenu_title').html(content);
	}, "json");
}

function switch_submenu(type) 
{
	var sub_nav = "<ol class='breadcrumb'><li><a href='index.html'>首页</a><li><a href='#'>新闻</a></li>";
	$.post("src/dispatcher.php", {
		"func" : "get_titles",
		"type" : type
	}, function(data) {
		var titles_str = "<div role='tabpanel' class='tab-pane active' id='submenu_" + 501 + "'><div class='list-group'>";
		for (var i in data) {
			titles_str += "<a href='#' class='list-group-item' id='content_" + data[i][0] + "' onclick='get_content(" + data[i][0]+")'>" + 
		"<h4 class='list-group-item-heading'>" + data[i][1] + "</h4>" +
		"<p class='list-group-item-text'>发布时间:" + data[i][2] + "</p></a>";
		}
		titles_str += "</div>";
		$('#submenu_title').html(titles_str);
	}, "json");
	//设置子导航
	sub_nav += "<li><a href='#'>" + $.cookies.get('g_sub_menu')[parseInt(type/100)][type] + "</a></li>";
	sub_nav += "</ol>";
	$('#sub_nav').html(sub_nav);
}

function show_submenu(view_type, data)
{
	var sub_nav = "<ol class='breadcrumb'><li><a href='index.html'>首页</a><li><a href='#'>新闻</a></li>";
	var type = parseInt(view_type / 100);

	var submenu_str = "<ul class='nav nav-pills nav-stacked' role='tablist'>";
	var submenus = data[type];
	for (var key in submenus) {
		submenu_str += "<li role='presentation' id='submenu_li_" + key + "'><a href='#submenu_" + key + 
			"' aria-controls='home' role='tab' data-toggle='tab' onclick='switch_submenu(" + key +")'>" + submenus[key] + "</a></li>";
	}
	submenu_str += "</ul>";
	$('#submenus').html(submenu_str);
	$('#submenu_li_' + view_type).addClass("active");
	var view_id = $.cookies.get('view_id');
	if (view_id != null && view_id != 0) {
		get_content(view_id);
		$.cookies.set('view_id', 0);
	} else {
		switch_submenu(view_type);
	}
	$.cookies.set('view_type', 0);

	//设置子导航
	sub_nav += "<li><a href='#'>" + submenus[view_type] + "</a></li>";
	sub_nav += "</ol>";
	$('#sub_nav').html(sub_nav);

}

function get_submenu(view_type) 
{
	var data = $.cookies.get('g_sub_menu');
	if (data != null) {
		show_submenu(view_type, data);
	} else {
		//first request
		$.post("src/dispatcher.php", {
			"func" : "get_def_vals"
		}, function(data) {
			$.cookies.set("g_menu", data['menu']);	
			$.cookies.set("g_sub_menu", data['sub_menu']);	
			$.cookies.set("g_from_type", data['from_type']);	
		}, "json");
		show_submenu(view_type, data['sub_menu']);
	}
}

$(document).ready(function(){
	var view_type = $.cookies.get('view_type');
	if (view_type == null || view_type == 0) {
		view_type = 201;
	}

	get_menus(2);
	get_submenu(view_type);
});

