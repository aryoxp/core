<?php

class KbDecodeController extends CoreModuleController {
  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin', 'core-runtime');
  }
  function index() {
    $this->menuId('kb-encode-decode');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('encode-decode.js');
    $this->ui->view("encode-decode.php", null, CoreModuleView::MODULE);
  }
}