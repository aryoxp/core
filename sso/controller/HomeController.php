<?php

class HomeController extends CoreController {

  public function index() {
    $this->ui->useCoreLib('core-ui');
    $this->ui->useScript('js/sso.js');
    $this->ui->useStyle('css/portal.css'); 
    $this->ui->view('login.php');
  }

  public function signIn() {
    $username = $this->postv('username');
    $password = $this->postv('password');
    $redirect = $this->postv('redirect');
    $remember = $this->postv('remember', false);

    if($remember)
      setcookie('username', $username, time() + 30 * 24 * 60 * 60, "/");
    else setcookie('username', $username, time() - 1, "/");

    // TODO: Check Username and Password
    // TODO: Redirect to login page if failed
    $auth = true;

    if($auth) {
      $sso = new SSOMySQL();
      $userdata = new stdClass;
      $userdata->username = $username;
      $uuid = $sso->setSession($userdata);
      if($uuid === false) {
        header('location: ' . $this->location() . '?e=2&redirect=' . urlencode($redirect));
      } else {
        $location = ((isset($redirect) && $redirect) 
          ? $redirect . "?token=$uuid" 
          : $this->ui->location("/admin/home/index?token=" . $uuid, CoreView::APP));
        header('location: ' . $location);
      }
    } else
      header('location: ' . $this->location() . '?e=1&redirect=' . urlencode($redirect));
    exit;
  }

  public function verify() {
    $token = $this->postv('token');
    $sso = new SSOMySQL();
    $userdata = $sso->getSession($token);
    if ($userdata) {
      $userdata->uuid = $token;
      CoreResult::instance($userdata)->show();
    } else CoreError::instance("Unable to verify SSO session or SSO session expired.")->show();
  }

  public function signOut() {
    session_destroy();
    header('location: ' . $this->ui->location());
    exit;
  }
}