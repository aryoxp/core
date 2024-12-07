<?php

class WmonLaporanController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function pembayaranmahasiswa() {
    $this->menuId('wmon-laporan-pembayaran-mahasiswa');
    $this->ui->usePlugin('general-ui','bootstrap-datepicker');
    $this->ui->useScript('js/laporan-pembayaran-mahasiswa.js');
    $this->ui->view('laporan-pembayaran-mahasiswa.php', null, CoreModuleView::MODULE);
  }

  public function pengeluaranrt() {
    $this->menuId('wmon-laporan-pengeluaran-kerumahtanggaan');
    $this->ui->usePlugin('general-ui','bootstrap-datepicker');
    $this->ui->useScript('js/laporan-pengeluaran-kerumahtanggaan.js');
    $this->ui->view('laporan-pengeluaran-kerumahtanggaan.php', null, CoreModuleView::MODULE);
  }

  public function pengeluaranakademi() {
    $this->menuId('wmon-laporan-pengeluaran-akademi');
    $this->ui->usePlugin('general-ui','bootstrap-datepicker');
    $this->ui->useScript('js/laporan-pengeluaran-akademi.js');
    $this->ui->view('laporan-pengeluaran-akademi.php', null, CoreModuleView::MODULE);
  }

  public function jurnalkaskecil() {
    $this->menuId('wmon-jurnal-kas-kecil');
    $this->ui->usePlugin('general-ui','datatables');
    $this->ui->useScript('js/jurnal-kas-kecil.js');
    $this->ui->view('jurnal-kas-kecil.php', null, CoreModuleView::MODULE);
  }

  public function bukubesar() {
    $this->menuId('wmon-buku-besar');
    $this->ui->usePlugin('general-ui', 'datatables', 'bootstrap-datepicker');
    $this->ui->useScript('js/buku-besar.js');
    $this->ui->view('buku-besar.php', null, CoreModuleView::MODULE);
  }

  public function ikhtisar() {
    $this->menuId('wmon-ikhtisar');
    $this->ui->usePlugin('general-ui', 'datatables', 'bootstrap-datepicker');
    $this->ui->useScript('js/ikhtisar.js');
    $this->ui->view('ikhtisar.php', null, CoreModuleView::MODULE);
  }

}