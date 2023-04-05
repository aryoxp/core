<?php

class HomeController extends CoreController {

  public function index() {
    $this->ui->useCoreLib('core-ui', 'admin'); 
    $this->ui->view('index.php');
  }
}