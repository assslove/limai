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

function list() 
{
	$.post("src/dispatcher.php",{
		"func":"list"
	},
	function(data){
		$('#list').html(data);
	},"text");	
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
	$.post("src/dispatcher.php", {
		"func" : "get_one", 
		"id" : id
	}, function(data) {
		$.cookies.set("view_id", id);
		$.cookies.set("view_type", data[3]);
		var menus = $.cookies.get("global_menu");
		var link = menus[parseInt(data[3]/100)][0];
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
		/*$('#add_li').click();*/
		/*$('#list_li').click();*/
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
		list();
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

