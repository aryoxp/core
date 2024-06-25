<?php

class KbKitController extends CoreModuleController {
  
  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin', 'core-runtime');
  }

  function index() {
    $this->menuId('kb-kit');
    $this->ui->usePlugin('kitbuild-ui', 'kitbuild', 'sortable', 'showdown', 'general-ui');
    // $this->ui->language('module/cmap/lang/kitbuild', CoreLanguage::LOCATION_APP_ROOT);
    $this->ui->useScript("makekit.js");
    $this->ui->useStyle("cmap.css");
    $this->ui->view("makekit.php", null, CoreModuleView::MODULE);
  }

  // function compose() {
  //   $this->menuId('kb-cmap');
  //   $this->ui->usePlugin('kitbuild-logger', 'kitbuild-ui', 'kitbuild');
  //   // $this->ui->language('module/cmap/lang/cmap', CoreLanguage::LOCATION_APP_ROOT);
  //   $this->ui->useScript("cmap.js");
  //   $this->ui->useStyle("cmap.css");
  //   $this->ui->view("cmap.php", null, CoreModuleView::MODULE);
  // }

  // function settings() {
  //   $this->ui->usePlugin('core-runtime');
  //   $this->useScript("settings.compose.js");
  //   $this->render($this->view("settings.compose.php"));
  // }

  

}