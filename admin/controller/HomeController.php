<?php

class HomeController extends CoreController {

  public function index() {
    $this->ui->useCoreLib('core-ui', 'admin');
    $this->ui->useScript('js/dashboard.js'); 
    if (UAC::isSignedIn()) {
      $this->ui->view('index.php');
      return;
    } else {
      $token = $this->getv('token');
      if ($token) {
        $error = null;
        $result = SSO::verify($token, $error);
        if ($result !== false) {
          $rbac = new RBACService();
          $_SESSION['user'] = $result;
          $_SESSION['authmenu'] = $rbac->getAuthorizedMenus($result->username);
          $this->ui->view('index.php');
        } else
          $this->ui->view('index.php', array('error' => 'SSO authentication failed. ' . $error));
      } else $this->ui->view('index.php');
    }
  }

  public function signOut() {
    session_destroy();
    header('location: ' . $this->ui->location());
    exit;
  }

}