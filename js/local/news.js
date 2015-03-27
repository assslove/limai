
function get_content(id)
{
	$.post("src/dispatcher.php", {
		"func" : "get_one", 
		"id" : id
	}, function(data) {
		var content = "<p><h1>" + data[1] + "</h1><br/>";
		content += "<h2>" + data[3]+ "</h2><hr/>";
		content += data[2] + "</p>";
		$('#submenu_title').html(content);
	}, "json");
}

function switch_submenu(type) 
{
	$.post("src/dispatcher.php", {
		"func" : "get_titles",
		"type" : type
	}, function(data) {
		var titles_str = "<div role='tabpanel' class='tab-pane active' id='submenu_" + 201 + "'><div class='list-group'>";
		for (var i in data) {
			titles_str += "<a href='#' class='list-group-item' onclick='get_content(" + data[i][0]+")'>" + 
				"<h4 class='list-group-item-heading'>" + data[i][1] + "</h4>" +
				"<p class='list-group-item-text'>" + data[i][2] + "</p></a>";
		}
		titles_str += "</div></div>";
		$('#submenu_title').html(titles_str);
	}, "json");
}

/* @brief 用户动态加载数据
*/
function load_data(type)
{
	alert('我会ajax加载' + type);
}

function load_info()
{
	$("#info").html('使用');
}

$(document).ready(function(){
	//初始化新闻
	/*$('#home').click(function() {*/
	/*alert("hello");*/
	/*});*/

	/*$('#home').click();*/
	//生成小菜单
	$.post("src/dispatcher.php", {
		"func" : "get_submenu",
		"index" : 2
	}, function(data) {
		var submenu_str = "<ul class='nav nav-pills nav-stacked' role='tablist'>";
		for (var key in data) {
			submenu_str += "<li role='presentation' id='submenu_li_" + key + "'><a href='#submenu_" + key + 
				"' aria-controls='home' role='tab' data-toggle='tab' onclick='switch_submenu(" + key +")'>" + data[key] + "</a></li>";
		}
		submenu_str += "</ul>";
		$('#submenus').html(submenu_str);
		$('#submenu_li_201').addClass("active");
	}, "json");

	//默认加载第一个小类别
	switch_submenu(201);
});

