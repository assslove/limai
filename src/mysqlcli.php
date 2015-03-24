<?php
	$HOST = "localhost";
	$USERNAME = "root";
	$PASSWD	= "8459328";
	$conn = mysql_connect($HOST, $USERNAME, $PASSWD);
	if (!$conn) {
		die('could not connect:'.mysql_error());
	}
	mysql_select_db("limai", $conn);
	mysql_query("set names utf8");
	$sql = "select * from t_info where type = 1";
	$result = mysql_query($sql, $conn);
	while ($row = mysql_fetch_array($result)) {
		echo $row['id']. "  " . $row['title'];
	}
	mysql_close($conn);

?>
