<?php

class HomeController extends CoreController {
  public function index() {
    $this->ui->useCoreLib('core-ui');
    $this->ui->useStyle('css/style.css');
    $this->ui->view('home.php');
  }
}