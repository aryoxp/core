<?php

class LabBookController extends AdminController {

  public function index() {
    $this->menuId('book');
    $this->ui->useScript('js/book.js');
    $this->ui->useStyle('css/lab.css');
    $this->ui->view('book.php', ['title' => 'Digital Books and References'], CoreModuleView::MODULE);
  }
  public function view($book = null) {

    $book = urldecode(base64_decode($book));
    $configLib = Core::lib(Core::CONFIG);
    $configLib->set('book', $book, CoreConfig::CONFIG_TYPE_CLIENT);

    $this->menuId('book');
    $this->ui->usePlugin('pdfjs4');
    $this->ui->useScript('js/book-view.js');
    $this->ui->useStyle('pdfjs/viewer.css');
    $this->ui->useModuleScript('pdfjs/viewer.mjs');
    $this->ui->view('book-view.php', ['title' => 'Digital Books and References'], CoreModuleView::MODULE);
  }

}
