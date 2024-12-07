<?php

class WadmPegawaiController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function index() {
    $this->menuId('wadm-pegawai');
    $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
    $this->ui->useScript('js/pegawai.js');
    $this->ui->view('pegawai.php', null, CoreModuleView::MODULE);
  }

  public function register() {
    $this->menuId('wadm-pegawai-register');
    $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
    $this->ui->useScript('js/register.js');
    $this->ui->view('pegawai-register.php', null, CoreModuleView::MODULE);
  }

  public function editbio($nrm = null) {
    $service = new PegawaiService();
    $pegawai = $service->getPegawai($nrm);
    $this->menuId('wadm-pegawai');
    $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
    $this->ui->useScript('js/pegawai-edit.js');
    $this->ui->view('pegawai-edit.php', ['pegawai'=>$pegawai], CoreModuleView::MODULE);
  }

  public function test() {
    $this->ui->view('test.php', null, CoreModuleView::MODULE);
  }

}