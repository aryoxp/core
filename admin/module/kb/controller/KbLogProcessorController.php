<?php

class KbLogProcessorController extends CoreModuleController {
  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin', 'core-runtime');
  }
  function index() {
    $this->menuId('kb-log-processor');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('encode-decode.js');
    $this->ui->view("encode-decode.php", null, CoreModuleView::MODULE);
  }
}