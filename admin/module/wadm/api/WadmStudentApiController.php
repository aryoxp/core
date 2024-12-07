<?php

class WadmStudentApiController extends CoreApi {

  public function search($page = 1, $perpage=100, $sort='asc') {
    try {
      $mahasiswaService = new MahasiswaService();
      $keyword = $this->postv('keyword');
      $result = $mahasiswaService->search($keyword, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function searchProdiAngkatan($page = 1, $perpage=100, $sort='asc') {
    try {
      $mahasiswaService = new MahasiswaService();
      $prodi = $this->postv('prodi');
      $angkatan = $this->postv('angkatan');
      $keyword = $this->postv('keyword');
      $result = $mahasiswaService->searchProdiAngkatan($prodi, $angkatan, $keyword, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function searchProdiAngkatanPA($page = 1, $perpage=100, $sort='asc') {
    try {
      $mahasiswaService = new MahasiswaService();
      $prodi = $this->postv('prodi');
      $angkatan = $this->postv('angkatan');
      $keyword = $this->postv('keyword');
      $result = $mahasiswaService->searchProdiAngkatanPA($prodi, $angkatan, $keyword, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function register() {
    try {
      $mahasiswaService = new MahasiswaService();
      $prodi = $this->postv('prodi');
      $group = $this->postv('group');
      $gelombang = $this->postv('gelombang');
      $status = $this->postv('status');
      $nama = $this->postv('nama');
      $tplahir = $this->postv('tplahir');
      $tglahir = $this->postv('tglahir');
      $nikpaspor = $this->postv('nikp  aspor');
      $result = $mahasiswaService->register($prodi, $group, $gelombang, 
        $status, $nama, $tplahir, $tglahir, $nikpaspor);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getMahasiswa($nrm) {
    try {
      $mahasiswaService = new MahasiswaService();
      $result = $mahasiswaService->getMahasiswa($nrm);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteMahasiswa() {
    try {
      $nrm = $this->postv('nrm');
      $mahasiswaService = new MahasiswaService();
      $result = $mahasiswaService->deleteMahasiswa($nrm);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateProgram() {
    try {
      $nrm = $this->postv('nrm');
      $prodi = $this->postv('prodi');
      $gelombang = $this->postv('gelombang');
      $status = $this->postv('status');
      $mahasiswaService = new MahasiswaService();
      $result = $mahasiswaService->updateProgram($nrm, $prodi, $gelombang, $status);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateIdentitasDiri() {
    try {
      $nrm = $this->postv('nrm');
      $nama = $this->postv('nama');
      $tplahir = $this->postv('tplahir');
      $tglahir = $this->postv('tglahir');
      $goldarah = $this->postv('goldarah');
      $kdagama = $this->postv('kdagama');
      $statnikah = $this->postv('statnikah');
      $nikpaspor = $this->postv('nikpaspor');
      $telp = $this->postv('telp');
      $mahasiswaService = new MahasiswaService();
      $result = $mahasiswaService->updateIdentitasDiri($nrm, $nama, $tplahir, 
        $tglahir, $goldarah, $kdagama, $statnikah, $nikpaspor, $telp);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateAlamat() {
    try {
      $nrm = $this->postv('nrm');
      $alamatasal = $this->postv('alamatasal');
      $propasal = $this->postv('propasal');
      $kotaasal = $this->postv('kotaasal');
      $alamat = $this->postv('alamat');
      $prop = $this->postv('prop');
      $kota = $this->postv('kota');
      $mahasiswaService = new MahasiswaService();
      $result = $mahasiswaService->updateAlamat($nrm, $alamatasal, 
        $propasal, $kotaasal, $alamat, $prop, $kota);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateSekolahAsal() {
    try {
      $nrm = $this->postv('nrm');
      $propsekolah = $this->postv('propsekolah');
      $kotasekolah = $this->postv('kotasekolah');
      $asalsekolah = $this->postv('asalsekolah');
      $jurusan = $this->postv('jurusan');
      $thlulus = $this->postv('thlulus');
      $mahasiswaService = new MahasiswaService();
      $result = $mahasiswaService->updateSekolahAsal($nrm, $propsekolah, 
        $kotasekolah, $asalsekolah, $jurusan, $thlulus);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateOrtu() {
    try {
      $nrm = $this->postv('nrm');
      $namaortu = $this->postv('namaortu');
      $pekerjaanortu = $this->postv('pekerjaanortu');
      $telportu = $this->postv('telportu');
      $alamatortu = $this->postv('alamatortu');
      $mahasiswaService = new MahasiswaService();
      $result = $mahasiswaService->updateOrtu($nrm, $namaortu, 
        $pekerjaanortu, $telportu, $alamatortu);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

}