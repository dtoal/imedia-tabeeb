<?php


  $word = $_GET['word'];

  mysql_connect('localhost', 'root', 'abc123') or die(mysql_error());

  mysql_select_db('tabeeb') or die(mysql_error());;

  // mysql_query("set names 'latin1'");

  // $data = mysql_query("select name from dictionary where name like '%" . $word . "%'");
  $data = mysql_query("select word from dictionary_list where word like '%" . $word . "%'");

  $rows = array();

  while ($info = mysql_fetch_assoc($data)) {
    $rows[] = $info;
  }

  header('Content-Type: application/json');

  print json_encode($rows);

?>

