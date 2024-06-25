<?php

class KbAnalyzerController extends CoreModuleController {
  
  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin', 'core-runtime');
  }

  function index() {
    $this->menuId('kb-analyzer');
    $this->ui->usePlugin('kitbuild-logger', 'kitbuild-ui', 'kitbuild');
    // $this->ui->language('module/cmap/lang/cmap', CoreLanguage::LOCATION_APP_ROOT);
    $this->ui->useScript("cmap.js");
    $this->ui->useStyle("cmap.css");
    $this->ui->view("cmap.php", null, CoreModuleView::MODULE);
  }

  function static() {
    $this->menuId('kb-analyzer-static');
    // $sidebarcollapse = true; // to initially collapse the sidebar.
    // Core::lib(Core::CONFIG)->set('menu', 'analyzer-static', CoreConfig::CONFIG_TYPE_CLIENT);
    // Core::lib(Core::CONFIG)->set('sidebarcollapse', $sidebarcollapse, CoreConfig::CONFIG_TYPE_CLIENT);
    $this->ui->usePlugin('general-ui', 'kitbuild-ui', 'kitbuild', 'kitbuild-analyzer', 'sheetjs');
    $this->ui->useStyle("analyzer.css");
    $this->ui->useScript("analyzer.static.js");
    $this->ui->view("analyzer.static.php", array(
      "title" => "Static Analyzer"
    ), CoreModuleView::MODULE);
  }

  function dynamic() {
    $this->menuId('kb-analyzer-dynamic');
    // $sidebarcollapse = true;
    // Core::lib(Core::CONFIG)->set('menu', 'analyzer-dynamic', CoreConfig::CONFIG_TYPE_CLIENT);
    // Core::lib(Core::CONFIG)->set('sidebarcollapse', $sidebarcollapse, CoreConfig::CONFIG_TYPE_CLIENT);
    $this->ui->usePlugin('kitbuild-ui', 'kitbuild', 'kitbuild-analyzer', 'sheetjs', 'chartjs');
    $this->ui->useStyle("analyzer.css");
    $this->ui->useScript("analyzer.dynamic.js");
    $this->ui->view("analyzer.dynamic.php", array(
      "title" => "Dynamic Analyzer"
    ), CoreModuleView::MODULE);
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