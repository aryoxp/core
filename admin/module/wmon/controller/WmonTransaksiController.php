<?php

class WmonTransaksiController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function mutasikas() {
    $this->menuId('wmon-mutasi-kas');
    $this->ui->usePlugin('general-ui','bootstrap-datepicker');
    $this->ui->useScript('js/mutasi-kas.js');
    $this->ui->view('mutasi-kas.php', null, CoreModuleView::MODULE);
  }

  public function out() {
    $this->menuId('wmon-transaksi-out');
    $this->ui->view('line.php', null, CoreModuleView::MODULE);
  }

  public function jenistransaksi() {
    $this->menuId('wmon-jenis-transaksi-index');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/jenis-transaksi.js');
    $this->ui->view('jenis-transaksi.php', null, CoreModuleView::MODULE);
  }

  public function pembayaranmahasiswa() {
    $this->menuId('wmon-pembayaran-mahasiswa');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/pembayaran-mahasiswa.js');
    $this->ui->view('pembayaran-mahasiswa.php', null, CoreModuleView::MODULE);
  }

  public function hutang() {
    $this->menuId('wmon-hutang');
    $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
    $this->ui->useScript('js/hutang.js');
    $this->ui->view('hutang.php', null, CoreModuleView::MODULE);
  }

  public function pengeluaranrt() {
    $this->menuId('wmon-pengeluaran-kerumahtanggaan');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/pengeluaran-kerumahtanggaan.js');
    $this->ui->view('pengeluaran-kerumahtanggaan.php', null, CoreModuleView::MODULE);
  }

  public function pengeluaranakademi() {
    $this->menuId('wmon-pengeluaran-akademi');
    $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
    $this->ui->useScript('js/pengeluaran-akademi.js');
    $this->ui->view('pengeluaran-akademi.php', null, CoreModuleView::MODULE);
  }

}