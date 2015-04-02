var PER_PAGE_CNT = 20; //每页显示个数

function send_file(file, editor, welEditable) {
	data = new FormData();
	data.append("file", file);
	$.ajax({
		data: data,
		type: "POST",
		url: "src/upload.php",
		cache: false,
		contentType: false,
		processData: false,
		success: function(url) {
			editor.insertImage(welEditable, url);
		}
	});
}

function get_page_html(page, total)
{
	$start = (page - 1) * PER_PAGE_CNT + 1;
	return "";
}

function list(page) 
{
	var start = (page - 1) * PER_PAGE_CNT + 1;
	var end = start + PER_PAGE_CNT;
	$.post("src/dispatcher.php", {
		"func": "list_pager", 
		"start": start,
		"end" : end
	}, function(ret){
		if (start == 1) {
			var total = ret['total'];
			$.cookies.set("info_total", total);
		}
		var data = ret['data'];
		var menu = $.cookies.get('menu');
		var submenu = $.cookies.get('sub_menu');
		var list_html ="<table class='table table-hover table-condensed'><thead><tr><th>#</th><th>类型</th><th>来源</th><th>标题</th><th>时间</th><th>操作</th></tr></thead><tbody>";

		for (var key in data) {
			var type = menu[parseInt(data[key][1] / 100)][1] + "/" + submenu[parseInt(data[key][1] / 100)][data[key][1]];
			list_html += "<tr><th scope='row'>" + data[key][0] + "</th><td>" + type +"</td><td>" + $.cookies.get('from_type')[data[key][4]]+ "</td><td>" + data[key][2] + "</td><td>" + data[key][3] + "</td><td>";
			list_html +="<input class='btn btn-primary' type='button' onclick='modify_one(" + data[key][0] + ")' value='修改'/> ";
			list_html +="<input class='btn btn-primary' type='button' onclick='del_one(" + data[key][0] + ")' value='删除'/> ";
			list_html +="<input class='btn btn-primary' type='button' onclick='view_one("+ data[key][0] + ")' value='预览'/>";
		}
		list_html +="</tbody></table>";

		var page_html = get_page_html(page, $.cookies.get('info_total'));
		list_html += page_html;
		$('#list').html(list_html);
	},"json");	
}

function save() 
{
	var aHTML = $('.click2edit').code();

	$.post("src/dispatcher.php",{
		"func":"save",
		"type" : $('#submenu').val(), 
		"title": $('#title').val(),
		"from_type": $('#from_type').val(),
		"content" : aHTML,
		"id" : $("#id").val()
	},
	function(data){
		if (data == 1) {
			$('#list_li').click();
			$.cookies.set("new", 0);
			$('.click2edit').destroy();
		} else {
			alert("保存不成功");
		}
	},"text");	

}

function del_one(id) 
{
	$.post("src/dispatcher.php",{
		"func":"del_one",
	"id" : id
	},
	function(data){
		$('#list').html(data);
	},"text");	
}

function modify_one(id) 
{
	$.cookies.set("new", 1);
	$("#add_li").click();

	$.post("src/dispatcher.php", {
		"func" : "get_one", 
		"id" : id
	}, function(data) {
		$("#id").val(data[0]);
		$("#title").val(data[1]);
		$("#from_type").val(data[4]);
		//content
		$('.click2edit').code(data[2]);
		//select
		$("#menu").val(parseInt(data[3]/100));
		$("#menu").click();
		$.cookies.set("list_submenu", parseInt(data[3]));
	}, "json");
}

function view_one(id)
{
	var menu = $.cookies.get('menu');
	$.post("src/dispatcher.php", {
		"func" : "get_one", 
		"id" : id
	}, function(data) {
		$.cookies.set("view_id", id);
		$.cookies.set("view_type", data[3]);
		var menus = $.cookies.get("global_menu");
		var link = menu[parseInt(data[3]/100)][0];
		location.href = link;
	}, "json");
}

function get_submenu(index) 
{
	var data = $.cookies.get('sub_menu')[index];
	$('#submenu').empty();
	for (var key in data) {
		$('#submenu').append("<option value='"+ key +"'>" + data[key] + "</option>");
	}
}

/* @brief 初始化
*/
function init() 
{
	var menu = $.cookies.get('menu');
	for (var key in menu) {
		$('#menu').append("<option value='"+ key +"'>" + menu[key][1] + "</option>");

		get_submenu(1);
		$('#add_li').click();
		$('#list_li').click();
	}

	var from_type = $.cookies.get('from_type');
	for (var key in from_type) {
		$('#from_type').append("<option value='"+ key +"'>" + from_type[key] + "</option>");
	}
}

$(document).ready(function() {
	$('#myTab a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	$('#add_li').click(function() {
		$('.click2edit').summernote({
			height: "500px",
			focus: false,
			onImageUpload : function(files, editor, welEditable) {
				send_file(files[0], editor, welEditable);
			}
		});

		if (!$.cookies.get("new")) {
			$('#id').val(0);
			$('#title').val("");
			$('.click2edit').code("请输入文字");
			$('#menu').val(1);
			$('#submenu').val(101);
		}
	});

	$('#list_li').click(function() {
		list(1);
	});

	$('#menu').click(function() {
		get_submenu($('#menu').val());
	});

	/*$.post("src/dispatcher.php",{*/
	/*"func":"get_menu"*/
	/*},*/
	/*function(data){*/
	/*for (var key in data) {*/
	/*$('#menu').append("<option value='"+ key +"'>" + data[key][1] + "</option>");*/
	/*$.cookies.set('global_menu', data);*/
	/*}*/
	/*},"json");	*/


	$("#search").click(function() {
		$.post("src/dispatcher.php", {
			"func" : "search",
			"search_title" : $('#search_title').val()
		}, function(data) {
			$("#list").html(data);
		}, "text");
	});
	//first request
	$.post("src/dispatcher.php", {
		"func" : "get_def_vals"
	}, function(data) {
		$.cookies.set("menu", data['menu']);	
		$.cookies.set("sub_menu", data['sub_menu']);	
		$.cookies.set("from_type", data['from_type']);	
		init();
	}, "json");
});

