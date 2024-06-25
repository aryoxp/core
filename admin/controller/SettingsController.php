<?php

class SettingsController extends CoreController {
  public function index() {
    $apps = CoreModule::getModules();
    $this->ui->useCoreLib('core-ui', 'admin');
    $this->ui->useScript('js/settings.js');
    $this->ui->view('settings.php', [
      'apps' => $apps
    ]);
  }
}