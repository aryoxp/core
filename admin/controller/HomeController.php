<?php

class HomeController extends CoreController {
  public function index() {
    $this->ui->useCoreLib('core-ui', 'admin'); 
    $this->ui->view('index.php');
    $modules = CoreModule::getAvailableModules();
    // foreach($modules as $module)
      // var_dump(new CoreModule($module));
  }
}