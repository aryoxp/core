<?php

class AdminController extends CoreModuleController {
  
  public function preamble() {
    $this->requireSignIn('/admin');
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  protected function requireSignIn($url, $redirect = null) {
    if($user = UAC::isSignedIn()) return $user;
    header("location:" . SSO::authUrl($url, $redirect ?? $_SERVER['REQUEST_URI']));
    exit;
  }

}