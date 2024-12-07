<?php

class SettingsController extends CoreController {
  public function index() {
    if (!UAC::isAdmin()) {
      $this->ui->usePlugin('bootstrap');
      $this->ui->view('denied.php');  
      return;
    }
    $apps = CoreModule::getModules();
    $this->ui->useCoreLib('core-ui', 'admin');
    $this->ui->useScript('js/settings.js');
    $this->ui->view('settings.php', [
      'apps' => $apps
    ]);
  }
}