<?php

defined('CORE') or (header($_SERVER["SERVER_PROTOCOL"] . " 403 Forbidden") and die('403.14 - Access denied.'));

class CoreSessionController extends CoreApi {

  /** 
   * Set single session variable or a collection of variables 
   * @param key if POST data is set then set a single variable
   * otherwise all sent variables and their values 
   * will be treated as key-value pairs.
   * @return String Success or error message.
   */
  function set() {
    $key = self::postv('key');
    $data = self::postv('data');
    // var_dump($_POST);
    try {
      if ($key) $_SESSION[$key] = $data;
      else foreach ($_POST as $k => $v) $_SESSION[$k] = $v;
      CoreResult::instance(true)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  function get() {
    $key = self::postv('key');
    $data = $key !== null ? (isset($_SESSION[$key]) ? $_SESSION[$key] : null) : $_SESSION;
    CoreResult::instance($data)->json();
  }

  function unset() {
    $key = self::postv('key');
    if ($key !== null) unset($_SESSION[$key]);
    CoreResult::instance(true)->show();
  }

  function destroy() {
    session_destroy();
    CoreResult::instance(true)->show();
  }

  function dump() {
    header('Content-Type:text/plain');
    print_r($_SESSION);
    echo session_id();
  }

  function regenerateid() {
    if(session_regenerate_id()) CoreResult::instance(session_id())->show();
    else CoreResult::instance(false)->show(); 
  }

  function getid() {
    CoreResult::instance(session_id())->show();
  }

  function setCookie() {
    $key = $this->postv('key');
    $data = $this->postv('data'); 
    $expire = $this->postv('expire', 30 * 24 * 60 * 60); 
    $path = $this->postv('path', "/");
    setcookie($key, $data, time() + $expire, $path);
    CoreResult::instance(true)->show();
  }

  function getCookie() {
    $key = self::postv('key');
    $data = $key !== null ? (isset($_COOKIE[$key]) ? $_COOKIE[$key] : null) : $_COOKIE;
    CoreResult::instance($data)->show();
  }

  function unsetCookie() {
    $key = self::postv('key');
    setcookie($key, null, time() - 60);
    CoreResult::instance(true)->show();
  }

  function destroyCookie() {
    foreach($_COOKIE as $name => $v) {
      setcookie($name, '', time()-1000);
      setcookie($name, '', time()-1000, '/');
    }
    CoreResult::instance(true)->show();
  }

  function dumpCookie() {
    header('Content-Type:text/plain');
    print_r($_COOKIE);
  }

}
