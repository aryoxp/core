<?php

class WmonAkunApiController extends CoreApi {

  public function search($page = 1, $perpage=100, $sort='asc') {
    try {
      $akunService = new AkunService();
      $keyword = $this->postv('keyword');
      $result = $akunService->search($keyword, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAkun($kode) {
    try {
      $akunService = new AkunService();
      $result = $akunService->get($kode);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAkunKategori($kategori) {
    try {
      $akunService = new AkunService();
      $result = $akunService->getAkunKategori($kategori);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function createAkun() {
    try {
      $akunService = new AkunService();
      $kode = $this->postv('kode');
      $nama = $this->postv('nama');
      $kategori = $this->postv('kategori');
      $keterangan = $this->postv('keterangan');
      $result = $akunService->insert($kode, $nama, $kategori, $keterangan);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteAkun() {
    try {
      $akunService = new AkunService();
      $kode = $this->postv('kode');
      $result = $akunService->delete($kode);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateAkun() {
    try {
      $akunService = new AkunService();
      $id = $this->postv('id');
      $kode = $this->postv('kode');
      $nama = $this->postv('nama');
      $kategori = $this->postv('kategori');
      $keterangan = $this->postv('keterangan');
      $result = $akunService->update($id, $kode, $nama, $kategori, $keterangan);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

}