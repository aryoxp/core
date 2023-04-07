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

}