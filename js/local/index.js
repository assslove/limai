
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
		content += "<p class='text-right'>发布时间: 来源: 作者: </p>";
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
	sub_nav += "<li><a href='#'>" + $.cookies.get('submenu')[type] + "</a></li>";
	sub_nav += "</ol>";
	$('#sub_nav').html(sub_nav);
}

$(document).ready(function(){
	$.post("src/dispatcher.php", {
		"func" : "get_def_vals"
	}, function(data) {
		$.cookies.set("g_menu", data['menu']);	
		$.cookies.set("g_sub_menu", data['sub_menu']);	
		$.cookies.set("g_from_type", data['from_type']);	
		init();
	}, "json");

	get_menus(1);
});


