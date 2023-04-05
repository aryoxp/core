<?php

class SettingsController extends CoreController {
  public function index() {
    $this->ui->useCoreLib('core-ui', 'admin'); 
    $this->ui->view('settings.php');
  }
}