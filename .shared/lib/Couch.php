<?php 
class Couch {
  public static function get($command, $data = null) {
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, "http://admin:password@localhost:5984/$command");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      "Content-Type: application/json",
      "Accept: application/json",
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
    if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $output = curl_exec($ch); 
    curl_close($ch);
    return json_decode($output);
  }
  public static function post($command, $data = null) {
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, "http://admin:password@localhost:5984/$command");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      "Content-Type: application/json",
      "Accept: application/json",
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $output = curl_exec($ch); 
    curl_close($ch);
    return json_decode($output);
  }
}