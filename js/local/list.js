var PER_PAGE_CNT = 10; //每页显示个数

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

function prev_page(page)
{
	if (page <= 1) {
		return ;
	}

	var start = page - 5;
	list(start);
	$('#pager').html(get_page_html(start, $.cookies.get('info_total')));
	$('#page'+start).addClass('active');
}

function next_page(page)
{
	total = $.cookies.get('info_total');
	var max_page = Math.ceil(total / PER_PAGE_CNT);
	if (page + 5 >= max_page) {
		return ;
	}

	start = page + 5;
	list(start);
	$('#pager').html(get_page_html(start, total));
	$('#page'+start).addClass('active');
}

function switch_page(page)
{
	list(page);
	$("#pager li").removeClass('active');
	$('#page'+page).addClass('active');
}

function get_page_html(page, total)
{
	if (page % 5 != 1) return ; //翻页的时候才更改
	$start = (page - 1) * PER_PAGE_CNT + 1;
	var page_str = "<nav><ul class='pagination'><li><a href='#' aria-label='Previous' onclick='prev_page(" + page + ")'><span aria-hidden='true'>&laquo;</span></a></li>";
	var max_page = Math.ceil(total / PER_PAGE_CNT);

	for (var i = page, j = 0; i <= max_page && j < 5; ++i, ++j) {
		page_str += "<li id='page" + i + "'><a href='#' onclick='switch_page(" + i + ")'>" + i + "</a></li>";
	}

	page_str += "<li><a href='#' aria-label='Next' onclick='next_page(" + page + ")'><span aria-hidden='true'>&raquo;</span></a></li></ul></nav>";

	return page_str;
}

function list(page) 
{
	var start = (page - 1) * PER_PAGE_CNT + 1;
	$.post("src/dispatcher.php", {
		"func": "list_pager", 
		"start": start,
		"end" : PER_PAGE_CNT
	}, function(ret){
		if (start == 1) {
			var total = ret['total'];
			$.cookies.set("info_total", total);
		}
		var data = ret['data'];
		var menu = $.cookies.get('g_menu');
		var submenu = $.cookies.get('g_sub_menu');
		var list_html ="<table class='table table-hover table-condensed'><thead><tr><th>#</th><th>类型</th><th>来源</th><th>标题</th><th>时间</th><th>操作</th></tr></thead><tbody>";

		for (var key in data) {
			var type = menu[parseInt(data[key][1] / 100)][1] + "/" + submenu[parseInt(data[key][1] / 100)][data[key][1]];
			list_html += "<tr><th scope='row'>" + data[key][0] + "</th><td>" + type +"</td><td>" + $.cookies.get('from_type')[data[key][4]]+ "</td><td>" + data[key][2] + "</td><td>" + data[key][3] + "</td><td>";
			list_html +="<input class='btn btn-primary' type='button' onclick='modify_one(" + data[key][0] + ")' value='修改'/> ";
			list_html +="<input class='btn btn-primary' type='button' onclick='del_one(" + data[key][0] + ")' value='删除'/> ";
			list_html +="<input class='btn btn-primary' type='button' onclick='view_one("+ data[key][0] + ")' value='预览'/>";
		}
		list_html +="</tbody></table>";

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
		switch_page(1);
		//$('#list').html(data);
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
	var menu = $.cookies.get('g_menu');
	$.post("src/dispatcher.php", {
		"func" : "get_one", 
		"id" : id
	}, function(data) {
		$.cookies.set("view_id", id);
		$.cookies.set("view_type", data[3]);
		var menus = $.cookies.get("g_menu");
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
	var menu = $.cookies.get('g_menu');
	for (var key in menu) {
		$('#menu').append("<option value='"+ key +"'>" + menu[key][1] + "</option>");

		get_submenu(1);
		$('#add_li').click();
		$('#list_li').click();
	}

	var from_type = $.cookies.get('g_from_type');
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

		$('#search_div').hide();
	});

	$('#list_li').click(function() {
		$('#search_div').show();
		var page_html = get_page_html(1, $.cookies.get('info_total'));
		$('#pager').html(page_html);
		switch_page(1);

	});

	$('#menu').click(function() {
		get_submenu($('#menu').val());
	});

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
		$.cookies.set("g_menu", data['menu']);	
		$.cookies.set("g_sub_menu", data['sub_menu']);	
		$.cookies.set("g_from_type", data['from_type']);	
		init();
	}, "json");
});

