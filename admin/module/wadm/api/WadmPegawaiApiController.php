<?php

class WadmPegawaiApiController extends CoreApi {

  public function search($page = 1, $perpage=100, $sort='asc') {
    try {
      $pegawaiService = new PegawaiService();
      $keyword = $this->postv('keyword');
      $result = $pegawaiService->search($keyword, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function searchProdiAngkatan($page = 1, $perpage=100, $sort='asc') {
    try {
      $pegawaiService = new PegawaiService();
      $prodi = $this->postv('prodi');
      $angkatan = $this->postv('angkatan');
      $keyword = $this->postv('keyword');
      $result = $pegawaiService->searchProdiAngkatan($prodi, $angkatan, $keyword, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function register() {
    try {
      $pegawaiService = new PegawaiService();
      $prodi = $this->postv('prodi');
      $group = $this->postv('group');
      $gelombang = $this->postv('gelombang');
      $status = $this->postv('status');
      $nama = $this->postv('nama');
      $tp_lahir = $this->postv('tp_lahir');
      $tg_lahir = $this->postv('tg_lahir');
      $alamat = $this->postv('alamat');
      $result = $pegawaiService->register($prodi, $group, $gelombang, 
        $status, $nama, $tp_lahir, $tg_lahir, $alamat);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getPegawai($nip) {
    try {
      $pegawaiService = new PegawaiService();
      $result = $pegawaiService->getPegawai($nip);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deletePegawai() {
    try {
      $nip = $this->postv('nip');
      $pegawaiService = new PegawaiService();
      $result = $pegawaiService->deletePegawai($nip);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateIdentitasDiri() {
    try {
      $nip = $this->postv('nip');
      $nama = $this->postv('nama');
      $j_kelamin = $this->postv('j_kelamin');
      $tp_lahir = $this->postv('tp_lahir');
      $tg_lahir = $this->postv('tg_lahir');
      $kdagama = $this->postv('kdagama');
      $status = $this->postv('status');
      $alamat = $this->postv('alamat');
      $telp1 = $this->postv('telp1');
      $telp2 = $this->postv('telp2');
      $jabatan = $this->postv('jabatan');
      $nidn = $this->postv('nidn');
      $pegawaiService = new PegawaiService();
      $result = $pegawaiService->updateIdentitasDiri($nip, $nama, $j_kelamin, $tp_lahir, 
        $tg_lahir, $kdagama, $status, $alamat, $telp1, $telp2, $jabatan, $nidn);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function setDosen() {
    try {
      $nip = $this->postv('nip');
      $pegawaiService = new PegawaiService();
      $result = $pegawaiService->setDosen($nip);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function unsetDosen() {
    try {
      $nip = $this->postv('nip');
      $pegawaiService = new PegawaiService();
      $result = $pegawaiService->unsetDosen($nip);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

}