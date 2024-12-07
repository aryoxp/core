<?php

class WmonAkunController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function index() {
    $this->menuId('wmon-akun-index');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/akun-index.js');
    $this->ui->view('akun-index.php', null, CoreModuleView::MODULE);
  }

}