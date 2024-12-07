<?php

class WmonLaporanApiController extends CoreApi {

  public function getLaporanPembayaranMahasiswa($page = 1, $perpage = 10, $order = 'ASC') {
    try {
      $tanggal = $this->postv('tanggal');
      $laporanService = new LaporanService();
      $result = $laporanService->getLaporanPembayaranMahasiswa($tanggal, $page, $perpage, $order);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getLaporanPengeluaranKerumahtanggaan($page = 1, $perpage = 10, $order = 'ASC') {
    try {
      $tanggal = $this->postv('tanggal');
      $laporanService = new LaporanService();
      $result = $laporanService->getLaporanPengeluaranKerumahtanggaan($tanggal, $page, $perpage, $order);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getLaporanPengeluaranAkademi($page = 1, $perpage = 10, $order = 'ASC') {
    try {
      $tanggal = $this->postv('tanggal');
      $laporanService = new LaporanService();
      $result = $laporanService->getLaporanPengeluaranAkademi($tanggal, $page, $perpage, $order);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getJurnalKasKecil($page = 1, $perpage = 10, $order = 'ASC') {
    try {
      $bulan = $this->postv('bulan');
      $tahun = $this->postv('tahun');
      $laporanService = new LaporanService();
      $result = $laporanService->getJurnalKasKecil($bulan, $tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function bukubesar() {
    try {
      $kode = $this->postv('kode');
      $tgmulai = $this->postv('tgmulai');
      $tgsampai = $this->postv('tgsampai');
      $laporanService = new LaporanService();
      $result = $laporanService->bukubesar($kode, $tgmulai, $tgsampai);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function ikhtisarkas() {
    try {
      $tahun = $this->postv('tahun');
      $service = new LaporanService();
      $result = $service->ikhtisarkas($tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function ikhtisarpendapatan() {
    try {
      $tahun = $this->postv('tahun');
      $service = new LaporanService();
      $result = $service->ikhtisarpendapatan($tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function ikhtisarbiaya() {
    try {
      $tahun = $this->postv('tahun');
      $service = new LaporanService();
      $result = $service->ikhtisarbiaya($tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  
}