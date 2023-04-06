<?php

class LabSetupController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function index() {

    $data = [];
    try {
      $setupService = new SetupService();
      $setupService->check();
    } catch (Exception $e) {
      $data['error'] = $e->getMessage();
    }

    $this->menuId('lab-setup');
    $this->ui->useScript('js/setup.js');
    $this->ui->view('setup.php', $data, CoreModuleView::MODULE);
    
  }

  public function check() {
    $setupService = new SetupService();
    $setupService->check();
  }
}