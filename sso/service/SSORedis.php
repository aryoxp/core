<?php

class SSORedis {

  private static function uuid() {
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
      mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
      mt_rand( 0, 0xffff ),
      mt_rand( 0, 0x0fff ) | 0x4000,
      mt_rand( 0, 0x3fff ) | 0x8000,
      mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
  }

  public static function setSession($data) {
    try {
      $r = new Redis();
      $r->connect('localhost', 6379);
      $r->select(1);
      $uuid = self::uuid();
      $r->set($uuid, json_encode($data));
      $r->expire($uuid, 600);
      return $uuid;
    } catch(Exception $e) {
      return false;
    }
  }

  public static function getSession($token) {
    $r = new Redis();
    $r->connect('localhost', 6379);
    $r->select(1);
    $data = $r->get($token);
    if($data) return json_decode($data);
    else return false;
  }
  
}