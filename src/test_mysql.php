<?php

require_once('mysql_cli.php');

$mc = new MysqlCli();
$mc->connect();
$result = $mc->exec_query("select * from t_info");
while ($row = mysql_fetch_array($result)) {
	echo $row['id'];
}
?>
