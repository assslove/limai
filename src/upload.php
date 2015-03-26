<?php

function upload() 
{
	if ($_FILES['file']['name']) {
		if (!$_FILES['file']['error']) {
			$name = md5(rand(100, 200));
			$ext = explode('.', $_FILES['file']['name']);
			$filename = $name . '.' . $ext[1];
			$destination = '../img/upload/' . $filename; 
			$location = $_FILES["file"]["tmp_name"];
			if (move_uploaded_file($location, $destination)) {
				echo 'img/upload/' . $filename;
			} else {
				echo "移动到指定目录出错";
			}
		} else {
			echo  $message = '上传出错:  '.$_FILES['file']['error'];
		}
	}
}


upload();

?>
