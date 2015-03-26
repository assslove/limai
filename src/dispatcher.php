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
	$type = $_POST['type'];
	$title = $_POST['title'];
	$content = $_POST['content'];

	$mc = new MysqlCli();
	$mc->connect();
	$sql = "insert into t_info(type,title,content,pub_time,author) values(".$type.",'".$title."', '".
		$content."',". time() . ", 'admin')";
	$result = $mc->exec_query($sql);
	if (!$result) {
		echo mysql_error();
	} else {
		echo "1";
	}
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
case '2':
	break;
default:
	echo "no controller";
}
?>
