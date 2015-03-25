<?php

require_once('mysql_cli.php');

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

/* @brief 列出所有项
 */
function list_all() 
{
	$html="<table class='table table-hover table-condensed'><thead><tr><th>#</th><th>类型</th><th>标题</th><th>时间</th><th>操作</th></tr></thead><tbody>";
	$mc = new MysqlCli();
	$mc->connect();
	$result = $mc->exec_query("select id, type, title, pub_time from t_info order by pub_time desc");
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			$html .= "<tr><th scope='row'>".$row['id']."</th><td>".$row['type']."</td><td>".$row['title']."</td><td>".date('Y-m-d H:i',$row['pub_time'])."</td><td>";
			$html .="<input class='btn btn-primary' type='button' onclick='modify_one(".$row['id'].")' value='修改'/> ";
			$html .="<input class='btn btn-primary' type='button' onclick='del_one(".$row['id'].")' value='删除'/>";
			$html .="</td></tr>";
		}
		mysql_free_result($result);
	}
	$html .="</tbody></table>";
	echo $html;
}

//协议处理器
$func = $_POST['func'];
switch ($func) {
case 'login':
	return login();
case 'list':
	return list_all();
case '2':
	break;
}
?>
