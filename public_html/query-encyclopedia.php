<?php


  $word = $_GET['word'];

  mysql_connect('localhost', 'root', 'abc123') or die(mysql_error());

  mysql_select_db('tabeeb_raw_data') or die(mysql_error());;

  // mysql_query("set names 'latin1'");

  $data = mysql_query("select name from encyclopedia where name like '%" . $word . "%'");

  $rows = array();

  while ($info = mysql_fetch_assoc($data)) {
    $rows[] = $info;
  }

  header('Content-Type: application/json');

  print json_encode($rows);

?>

