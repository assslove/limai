<?php
//服务器配置
$data = array (
	array("serv" => "简体1区", "host"=> "172.21.174.215", "user" => "binhou", "passwd" => "binhou", "sshport" => "22", "upload" => "/home/binhou/server/game-server/config/hotdata/", "gate" => "172.21.174.90", "gateport" => "3014"), 
	array("serv" => "简体2区", "host"=> "172.21.174.215", "user" => "binhou", "passwd" => "binhou", "sshport" => "22", "upload" => "/home/binhou/server/game-server/config/hotdata/", "gate" => "172.21.174.90", "gateport" => "3014"),
	array("serv" => "简体3区", "host"=> "172.21.174.215", "user" => "binhou", "passwd" => "binhou", "sshport" => "22", "upload" => "/home/binhou/test/", "gate" => "172.21.174.90", "gateport" => "3014")
);

$files = array ("reward.csv", "test.csv", "login_reward.csv");
$filenames = array ("奖励表", "测试文件", "登陆奖励");

$users = array (
	array("ck", "ck"),
	array("admin", "admin"),
	array("test", "test"),
);
//$total_serv = count($data);
//$total_files = count($files);

//for ($i = 0; $i < $total_serv; ++$i) {
	//foreach ($data[$i] as $key => $value) {
		//echo $key." ".$value."\n";
	//}
//}

//for ($i = 0 ; $i < $total_files ; ++$i) {
	//echo $files[$i]."\n";
//}

$func = $_POST["func"];

/* @brief 单词拷贝一个文件，
 */
function do_dispatch_file() {
	global $data;
	global $files;
	global $filenames;

	$total_serv = count($data);
	$total_files = count($files);

	$sid = $_POST["sid"];
	$fid = $_POST["fid"];
	ini_set('display_errors', 1);
	//通过ssh2进行传输
	$connection = ssh2_connect($data[$sid]["host"], 22);
	ssh2_auth_password($connection, $data[$sid]["user"], $data[$sid]["passwd"]);
	$src = "/var/www/html/uploads/".$files[$fid];
	$dest = $data[$sid]["upload"]."".$files[$fid];
	$status = ssh2_scp_send($connection, $src, $dest, 0644);
	
	if ($status) {
		echo "上传[".$filenames[$fid]."]到[".$data[$sid]["serv"]."]成功!<br/>";
	} else {
		echo "上传[".$filenames[$fid]."]到[".$data[$sid]["serv"]."]失败!<br/>";
	}

	return 0;
}

function init()
{
	global $data;
	global $files;
	global $filenames;
	$result = array($data, $files, $filenames);

	echo json_encode($result);
	return 0;
}

function chgnames($names){
	return $names;
	$arr = explode(".", $names);
	return $arr[0]."-".time().".".$arr[1];
}

function down() {
	global $data;
	global $files;
	global $filenames;

	$total_serv = count($data);
	$total_files = count($files);

	$sid = $_POST["sid"];
	$fid = $_POST["fid"];
	ini_set('display_errors', 1);
	//通过ssh2进行传输
	$connection = ssh2_connect($data[$sid]["host"], 22);
	ssh2_auth_password($connection, $data[$sid]["user"], $data[$sid]["passwd"]);
	$src = "/var/www/html/uploads/".chgnames($files[$fid]);
	$dest = $data[$sid]["upload"]."".$files[$fid];
	$status = ssh2_scp_recv($connection, $dest, $src);
	
	if ($status) {
		echo $src;
	} else {
		echo "";
	}
}


function login() {
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

function check() {
	session_start();
	if (isset($_SESSION["name"])) {
		echo $_SESSION["name"]; 
	} else {
		echo "";
	}
}

function leave() {
	session_start();
	unset($_SESSION["name"]);
}

switch ($func) {
case 'dispatch_file':
	return do_dispatch_file();
case 'init':
	return init();
case 'down':
	return down();
case 'login':
	return login();
case 'check':
	return check();
case 'leave':
	return leave();

	break;
}
?>
