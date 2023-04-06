<?php

class LabInventarisController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function index() {
    $this->menuId('lab-inventaris');
    $this->ui->useScript('js/lab.js');
    $this->ui->useStyle('css/lab.css');
    $this->ui->view('inventaris.php', null, CoreModuleView::MODULE);
  }

  public function setup() {
    $this->menuId('lab-setup');
    $this->ui->useScript('js/setup.js');
    $this->ui->view('inventaris.php', null, CoreModuleView::MODULE);
  }
}