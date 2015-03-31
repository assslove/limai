<?php

function writelog($msg){
	$logFile = date('Y-m-d').'.txt';
	$msg = date('Y-m-d H:i:s').' >>> '.$msg."\r\n";
	file_put_contents("log/".$logFile, $msg, FILE_APPEND);
}

?>
