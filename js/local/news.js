
$(document).ready(function(){
	$('#home').click(function() {
		alert("hello");
	});

	$('#home').click();
});

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
