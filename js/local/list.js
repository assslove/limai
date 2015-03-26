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
	$('.click2edit').destroy();

	$.post("src/dispatcher.php",{
		"func":"save",
		"type" : $('#submenu').val(), 
		"title": $('#title').val(),
		"content" : aHTML
	},
	function(data){
		if (data == 1) {
			$('#list').click();
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

}

function view_one(id)
{
}

$(document).ready(function() {
	$('#myTab a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});

	$('#add').click(function() {
		$('.click2edit').summernote({
			height: "500px",
			focus: false,
			onImageUpload : function(files, editor, welEditable) {
				send_file(files[0], editor, welEditable);
			}
		});
	});

	$('#list').click(function() {
		list();
	});

});

