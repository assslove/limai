<?php

$users = array (
	array("admin", "admin"),
	array("test", "test"),
);

function login() 
{
	session_start();
	global $users;

	$is_valid = 0;
	$size = count($users);
	for ($i = 0; $i < $size ; ++$i) {
		if ($users[$i][0] == $_POST["name"] && $users[$i][1] == $_POST["password"]) {
			$is_valid = 1;
			$_SESSION["name"] = $_POST["name"];
			break;
		}
	}

	echo $is_valid;
}

//协议处理器
$func = $_POST['func'];
switch ($func) {
case 'login':
	return login();
case '2':
	break;
}
?>
