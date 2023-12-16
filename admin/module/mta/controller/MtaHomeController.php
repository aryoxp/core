<?php

class MtaHomeController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function index() {
    $this->menuId('mta-line');
    $this->ui->useScript('js/line.js');
    $this->ui->view('line.php', null, CoreModuleView::MODULE);
  }

  public function stop() {
    $this->menuId('mta-stop');
    $this->ui->useScript('js/stop.js');
    $this->ui->view('stop.php', null, CoreModuleView::MODULE);
  }

  public function interchange() {
    $this->menuId('mta-interchange');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/interchange.js');
    $this->ui->view('interchange.php', null, CoreModuleView::MODULE);
  }

  public function navigation() {
    $this->menuId('mta-navigation');
    $this->ui->useScript('js/navigation.js');
    $this->ui->view('navigation.php', null, CoreModuleView::MODULE);
  }

  public function network() {
    $this->menuId('mta-network');
    $this->ui->useScript('js/network.js');
    $this->ui->view('network.php', null, CoreModuleView::MODULE);
  }

  public function import() {
    $this->menuId('mta-line-import');
    $this->ui->useScript('js/import.js');
    $this->ui->view('import.php', null, CoreModuleView::MODULE);
  }

}