<?php

class HomeController extends CoreController {
  
  function index($mapid = null) {
    $this->ui->useCoreLib('core-ui');
    $this->ui->usePlugin('core-runtime');
    $this->ui->usePlugin('kitbuild-ui', 'kitbuild', 'kitbuild-logger');
    $this->ui->useScript("compose.js");
    $this->ui->useStyle("compose.css");    
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->view("compose.php", array());
    $this->ui->viewPlugin("general-ui");
    $this->ui->view('foot.php', null, CoreView::CORE);
  }

}
