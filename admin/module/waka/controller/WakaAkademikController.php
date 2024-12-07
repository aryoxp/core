<?php

class WakaAkademikController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function penerimaan() {
    $this->menuId('waka-penerimaan');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/penerimaan-mahasiswa.js');
    $this->ui->view('penerimaan-mahasiswa.php', null, CoreModuleView::MODULE);
  }
  
  public function pa() {
    $this->menuId('waka-pa');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/pa.js');
    $this->ui->view('pa.php', null, CoreModuleView::MODULE);
  }

  public function kurikulum() {
    $this->menuId('waka-kurikulum');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/kurikulum.js');
    $this->ui->view('kurikulum.php', null, CoreModuleView::MODULE);
  }

  public function matakuliah() {
    $this->menuId('waka-matakuliah');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/matakuliah.js');
    $this->ui->view('matakuliah.php', null, CoreModuleView::MODULE);
  }

  public function penawaranmk() {
    $this->menuId('waka-penawaran-matakuliah');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/penawaran-matakuliah.js');
    $this->ui->view('penawaran-matakuliah.php', null, CoreModuleView::MODULE);
  }

  public function krs() {
    $this->menuId('waka-krs');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/krs.js');
    $this->ui->view('krs.php', null, CoreModuleView::MODULE);
  }

  public function kelas() {
    $this->menuId('waka-kelas');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/kelas.js');
    $this->ui->view('kelas.php', null, CoreModuleView::MODULE);
  }

  public function nilai() {
    $this->menuId('waka-nilai');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/nilai.js');
    $this->ui->view('nilai.php', null, CoreModuleView::MODULE);
  }

  public function khs() {
    $this->menuId('waka-khs');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/khs.js');
    $this->ui->view('khs.php', null, CoreModuleView::MODULE);
  }

  public function transkrip() {
    $this->menuId('waka-transkrip');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/transkrip.js');
    $this->ui->view('transkrip.php', null, CoreModuleView::MODULE);
  }

  public function kelulusan() {
    $this->menuId('waka-kelulusan');
    $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
    $this->ui->useScript('js/kelulusan.js');
    $this->ui->view('kelulusan.php', null, CoreModuleView::MODULE);
  }

  public function laporankhs() {
    $this->menuId('waka-laporan-khs');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/laporan-khs.js');
    $this->ui->view('laporan-khs.php', null, CoreModuleView::MODULE);
  }

  // public function register() {
  //   $this->menuId('wadm-student-register');
  //   $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
  //   $this->ui->useScript('js/register.js');
  //   $this->ui->view('student-register.php', null, CoreModuleView::MODULE);
  // }

  // public function editbio($nrm = null) {
  //   $service = new MahasiswaService();
  //   $mahasiswa = $service->getMahasiswa($nrm);
  //   $this->menuId('wadm-mahasiswa');
  //   $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
  //   $this->ui->useScript('js/student-edit.js');
  //   $this->ui->view('student-edit.php', ['mahasiswa'=>$mahasiswa], CoreModuleView::MODULE);
  // }

  // public function test() {
  //   $this->ui->view('test.php', null, CoreModuleView::MODULE);
  // }

}