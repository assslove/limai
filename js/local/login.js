function login() {
	$.post("src/dispatcher.php",{
		"func":"login",		
		"name": $("#name").val(), 
		"password": $("#password").val()
	},
	function(data){
		if (data == 1) {
			location.href = "list.html";
		} else {
			alert("用户身份验证出错");
		}
	},"text");	
}

function remeber() {
	$.cookies.set('name', $("#name").val());
	$.cookies.set('password', $("#password").val());
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

$(document).ready(function() {
	if ($.cookies.set('name') != null) {
		$("#name").val($.cookies.get('name'));
	}

	if ($.cookies.set('password') != null) {
		$("#password").val($.cookies.get('password'));
	}
});
