<?php

class KbCmapController extends CoreModuleController {
  
  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin', 'core-runtime');
  }

  function index() {
    $this->redirect('m/x/kb/cmap/compose');
  }

  function compose() {
    $this->menuId('kb-cmap');
    $this->ui->usePlugin('kitbuild-logger', 'kitbuild-ui', 'kitbuild', 'pdfjs');
    // $this->ui->language('module/cmap/lang/cmap', CoreLanguage::LOCATION_APP_ROOT);
    $this->ui->useScript("cmap.js");
    $this->ui->useStyle("cmap.css");
    $this->ui->view("cmap.php", null, CoreModuleView::MODULE);
  }

  // function kit() {
  //   Core::lib(Core::CONFIG)->set('menu', 'compose-kit', CoreConfig::CONFIG_TYPE_CLIENT);
  //   $this->ui->usePlugin('kitbuild-ui', 'kitbuild', 'sortable', 'showdown');
  //   $this->ui->language('module/cmap/lang/kitbuild', CoreLanguage::LOCATION_APP_ROOT);
  //   $this->useScript("makekit.js");
  //   $this->useStyle("cmap.css");
  //   $this->render($this->view("makekit.php"));
  // }

  // function settings() {
  //   $this->ui->usePlugin('core-runtime');
  //   $this->useScript("settings.compose.js");
  //   $this->render($this->view("settings.compose.php"));
  // }

  

}