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
	var sub_nav = "<ol class='breadcrumb'><li><a href='index.html'>首页</a><li><a href='#'>美食</a></li>";
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
	sub_nav += "<li><a href='#'>" + $.cookies.get('g_sub_menu')[parseInt(type/100)][type] + "</a></li>";
	sub_nav += "</ol>";
	$('#sub_nav').html(sub_nav);
}

function show_submenu(view_type, data)
{
	var sub_nav = "<ol class='breadcrumb'><li><a href='index.html'>首页</a><li><a href='#'>美食</a></li>";
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
	switch_submenu(view_type);
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
		view_type = 501;
	}

	get_menus(5);
	get_submenu(view_type);
});
