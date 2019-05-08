<?php
$data = array();
$data["total"] = 100;


$row = array();
for($i = 0;$i<10;$i++){
	$row[$i]["id"] = $i+1;
	$row[$i]["name"] = "繁华";
	$row[$i]["price"] = "200.00";
	$row[$i]["image"] = "https://www.baidu.com/img/baidu_jgylogo3.gif";
}
$data["rows"] = $row;

echo json_encode($data);

?>