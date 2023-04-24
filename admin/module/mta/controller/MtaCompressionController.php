<?php

class MtaCompressionController extends CoreModuleController {
  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function index() {
    Core::lib(Core::CONFIG)->loadDatabaseConfig();
    $this->ui->useScript('js/compression.js');
    $this->menuId('mta-compression');
    $this->ui->view('compression.php', null, CoreModuleView::MODULE);
  }

}