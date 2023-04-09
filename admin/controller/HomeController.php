<?php

class HomeController extends CoreController {

  public function index() {
    $this->ui->useCoreLib('core-ui', 'admin');
    $this->ui->useScript('js/dashboard.js'); 
    $this->ui->view('index.php');
  }

  public function signIn() {
    $username = $this->postv('username');
    $password = $this->postv('password');
    $redirect = $this->postv('redirect');
    $remember = $this->postv('remember', false);
    $_SESSION['user'] = $username.$password;
    if($remember)
      setcookie('username', $username, time() + 30 * 24 * 60 * 60, "/");
    else setcookie('username', $username, time() - 1, "/");
    header('location: ' . $redirect ?? $this->ui->location());
    exit;
  }

  public function signOut() {
    session_destroy();
    header('location: ' . $this->ui->location());
    exit;
  }

}