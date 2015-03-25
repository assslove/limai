$(document).ready(function() {
	$('#myTab a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});

	$('.click2edit').summernote({
		height: "500px",
		focus: true
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
