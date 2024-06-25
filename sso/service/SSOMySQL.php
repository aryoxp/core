<?php

class SSOMySQL extends CoreService {

  public static function setSession($data) {
    $db = self::instance('sso');
    try {
      $db->begin();
      $uuid = $db->getVar('SELECT UUID()');
      $insert = [];
      $insert['uuid']   = $uuid;
      $insert['data']   = json_encode($data);
      $insert['expire'] = time() + 60;
      $db = self::instance('sso');
      $qb = QB::instance('session')
        ->insert($insert);
      $db->query($qb->get());
      $db->commit();
      return $uuid;
    } catch(Exception $e) {
      return false;
    }
  }

  public static function getSession($token) {
    $db = self::instance('sso');
    $qb = QB::instance('session')
      ->select('data')
      ->where('uuid', QB::esc($token));
    $data = $db->getVar($qb->get());
    self::removeExpiredSession(time());
    if ($data) return json_decode($data);
    else return false;
  }

  private static function removeExpiredSession($maxTimestamp) {
    $db = self::instance('sso');
    $qb = QB::instance('session')
      ->delete()
      ->where('expire', QB::LT, QB::esc($maxTimestamp));
    return $db->query($qb->get());
  }

  public static function signIn($username, $password) {
    $db = self::instance('sso');
    $qb = QB::instance('user')
      ->select()
      ->where('username', QB::esc($username))
      ->where('password', QB::raw('MD5(\''.QB::esc($password).'\')'));
    $user = $db->getRow($qb->get());
    return $user;
  }

}