<?php

class HomeController extends CoreController {
  public function index() {
    $this->ui->useCoreLib('core-ui');
    $this->ui->useStyle('css/style.css');
    $this->ui->view('home.php');
  }
  public function publication() {
    include('mgm/lib/bibtex/lib_bibtex.inc.php');
    $Site = array();
    $Site['bibtex'] = new Bibtex('mgm/file/references.bib');
    $bib = $Site['bibtex'];
    $bib->Select(array('author' => '/.*/i'));
    $bib->PrintBibliography();
    $this->ui->useCoreLib('core-ui');
    $this->ui->useStyle('css/style.css');
    $this->ui->view('publication.php', array('bib' => $bib->bibarr));
  }
  public function members() {
    $this->ui->useCoreLib('core-ui');
    $this->ui->useStyle('css/style.css');
    $this->ui->view('members.php');
  }
  public function research() {
    $this->ui->useCoreLib('core-ui');
    $this->ui->useStyle('css/style.css');
    $this->ui->view('research.php');
  }
}