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

    // TODO: Check Username and Password
    // TODO: Redirect to login page if failed

    $userdata = new stdClass;
    $userdata->username = $username;

    $uuids = Couch::get("_uuids");
    $uuid = $uuids->uuids[0];
    $userdata->id = $uuid;
    $userdata->expire = time() + 24 * 60 * 60;
    
    $result = Couch::post('sso', $userdata);
    $id = $result->id;

    if($remember)
      setcookie('username', $username, time() + 30 * 24 * 60 * 60, "/");
    else setcookie('username', $username, time() - 1, "/");

    $location = ((isset($redirect) && $redirect) 
      ? $redirect . "?token=$id" 
      : $this->ui->location("/admin/home/index?token=" . $id, CoreView::APP));

    header('location: ' . $location);
    exit;
  }

  public function verify() {
    $token = $this->postv('token');
    
    $selector = new stdClass;
    $selector->_id = $token;
    $query = new stdClass;
    $query->selector = $selector;

    $result = Couch::post('sso/_find', $query);
    // var_dump($query, $result); exit;
    if (count($result->docs)) {
      CoreResult::instance($result->docs[0])->show();
    } else CoreError::instance("SSO session not found.")->show();
  }

  public function signOut() {
    session_destroy();
    header('location: ' . $this->ui->location());
    exit;
  }
}