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

$(document).ready(function() {
	$('#myTab a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});

	$('.click2edit').summernote({
		height: "500px",
		focus: true,
		onImageUpload : function(files, editor, welEditable) {
			send_file(files[0], editor, welEditable);
		}
	});

});

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
	alert(aHTML);
	$('.click2edit').destroy();

}
