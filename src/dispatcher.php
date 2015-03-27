<?php

require_once('mysql_cli.php');
require_once('define.php');
require_once('log.php');

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
			$html .="<input class='btn btn-primary' type='button' onclick='del_one(".$row['id'].")' value='删除'/> ";
			$html .="<input class='btn btn-primary' type='button' onclick='view_one(".$row['id'].")' value='预览'/>";
			$html .="</td></tr>";
		}
		mysql_free_result($result);
	}
	$html .="</tbody></table>";
	echo $html;
}

/* @brief 删除一项数据
 */
function del_one()
{
	$id = $_POST['id'];
	$mc = new MysqlCli();
	$mc->connect();
	$result = $mc->exec_query("delete from t_info where id=".$id);
	if (!$result) {
		echo "删除失败";
		return ;
	}

	return list_all();
}

function save()
{
	$id = $_POST['id'];
	$type = $_POST['type'];
	$title = $_POST['title'];
	$content = $_POST['content'];

	$mc = new MysqlCli();
	$mc->connect();
	$sql = "";
	if ($id != 0) {
		$sql = "update t_info set type=".$type.", title='".$title."',content='".$content."',pub_time="
			.time()." where id=".$id;
	} else {
		$sql = "insert into t_info(type,title,content,pub_time,author) values(".$type.",'".$title."', '".
			$content."',". time() . ", 'admin')";
	}
	$result = $mc->exec_query($sql);
	if (!$result) {
		echo mysql_error();
	} else {
		echo "1";
	}
}

function get_menu()
{
	global $menu;
	echo json_encode($menu, JSON_UNESCAPED_UNICODE);
}

function get_submenu()
{
	$index = $_POST['index'];
	global $sub_menu;
	echo json_encode($sub_menu[$index], JSON_UNESCAPED_UNICODE);
}

function get_one() 
{
	$id = $_POST['id'];
	$mc = new MysqlCli();
	$mc->connect();
	$result = $mc->exec_query("select * from t_info where id=".$id . " limit 1");
	if (!$result) {
		writelog("get info failed, id=". $id);
		return ;
	}

	$row = mysql_fetch_array($result);
	$ret = array();
	array_push($ret,$id);
	array_push($ret,$row['title']);
	array_push($ret,$row['content']);
	array_push($ret,$row['type']);
	mysql_free_result($result);

	echo json_encode($ret, JSON_UNESCAPED_UNICODE); 
}

function get_titles()
{
	$type = $_POST['type'];  
	$mc = new MysqlCli();
	$mc->connect();
	$sql = "select id, title, pub_time from t_info where type=".$type ." order by pub_time desc";
	$result = $mc->exec_query($sql);
	if (!$result) {
		writelog("get titles failed, type=". $type);
		return ;
	}

	$ret = array();
	while ($row = mysql_fetch_array($result)) {
		$item = array();
		array_push($item, $row['id'], $row['title'], date('Y-m-d H:i',$row['pub_time']));
		array_push($ret, $item);
	}

	mysql_free_result($result);
	echo json_encode($ret, JSON_UNESCAPED_UNICODE);
}

//协议处理器
$func = $_POST['func'];
switch ($func) {
case 'login':
	return login();
case 'list':
	return list_all();
case 'del_one':
	return del_one();
case 'save':
	return save();
case 'get_menu':
	return get_menu();
case 'get_submenu':
	return get_submenu();
case 'get_one':
	return get_one();
case 'get_titles':
	return get_titles();
case '2':
	break;
default:
	echo "no controller";
}
?>
