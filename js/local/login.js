function login() {
	$.post("src/dispatcher.php",{
		"func":"login",		
		"name": $("#name").val(), 
		"password": $("#password").val()
	},
	function(data){
		if (data == 1) {
			location.href = "edit.html";
		} else {
			alert("用户身份验证出错");
		}
	},"text");	
}


function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

$(document).ready(function() {
});
