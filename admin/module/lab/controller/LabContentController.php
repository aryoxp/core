<?php

class LabContentController extends AdminController {

  public function index() {
    $this->menuId('content');
    $this->ui->usePlugin('bootstrap-datepicker','simplemde', 'code-input');
    $this->ui->useScript('js/content.js');
    $this->ui->useStyle('css/content.css');
    $this->ui->view('content.php', ['title' => 'Content Management'], CoreModuleView::MODULE);
  }

}