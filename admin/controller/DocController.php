<?php

class DocController extends CoreController {
  public function index() {
    
    $configLib = Core::lib(Core::CONFIG);
    $configLib->set('menuid', 'doc-framework', CoreConfig::CONFIG_TYPE_APP);
    
    $this->ui->useCoreLib('core-ui', 'admin'); 
    $this->ui->view('doc.php');
  }

  public function manual() {
    
    $configLib = Core::lib(Core::CONFIG);
    $configLib->set('menuid', 'user-manual', CoreConfig::CONFIG_TYPE_APP);
    
    $this->ui->useCoreLib('core-ui', 'admin'); 
    $this->ui->view('manual.php');
  }
}