<?php

class UAC {
  public static function isSignedIn() {
    return (isset($_SESSION['user'])); 
  }
  public static function isAdmin() {
    $config = Core::lib(Core::CONFIG)->load('config.ini');
    $user = $_SESSION['user'] ?? null;
    // var_dump($user, $config['admin_username']);
    if (!$user) return false;
    if (!$user->username) return false;
    return $config['admin_username'] == $user->username;
  }
}