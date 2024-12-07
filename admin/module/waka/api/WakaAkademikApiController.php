<?php

class WakaAkademikApiController extends CoreApi {

  public function getTahunAngkatanList($prodi) {
    try {
      $service = new MahasiswaService();
      $result = $service->getTahunAngkatanList($prodi);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAllKurikulum() {
    try {
      $service = new MatakuliahService();
      $result = $service->getAllKurikulum();
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getTahunPenawaranList() {
    try {
      $service = new AkademikService();
      $result = $service->getTahunPenawaranList();
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getMatakuliahDitawarkan($page = 1, $perpage = 10) {
    try {
      $prodi = $this->postv('prodi');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $service = new AkademikService();
      $result = $service->getMatakuliahDitawarkan($prodi, $tahun, $semester, $page, $perpage);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getMatakuliahTidakDitawarkan($page = 1, $perpage = 10) {
    try {
      $prodi = $this->postv('prodi');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kurikulum = $this->postv('kurikulum');
      $service = new AkademikService();
      $result = $service->getMatakuliahTidakDitawarkan($kurikulum, $prodi, $tahun, $semester, $page, $perpage);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function tawarkanMatakuliah() {
    try {
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $prodi = $this->postv('prodi');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $service = new AkademikService();
      $result = $service->tawarkanMatakuliah($kdmk, $kurikulum, $prodi, $tahun, $semester);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function turunkanPenawaranMatakuliah() {
    try {
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $prodi = $this->postv('prodi');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $service = new AkademikService();
      $result = $service->turunkanPenawaranMatakuliah($kdmk, $kurikulum, $prodi, $tahun, $semester);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getDaftarKRSMahasiswa() {
    try {
      $nrm = $this->postv('nrm');
      $service = new AkademikService();
      $result = $service->getDaftarKRSMahasiswa($nrm);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getListMatakuliahKRS() {
    try {
      $nrm = $this->postv('nrm');
      $semester = $this->postv('semester');
      $semesterke = $this->postv('semesterke');
      $service = new AkademikService();
      $result = $service->getListMatakuliahKRS($nrm, $semester, $semesterke);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function buatKRS() {
    try {
      $nrm = $this->postv('nrm');
      $semesterke = $this->postv('semesterke');
      $semester = $this->postv('semester');
      $tahun = $this->postv('tahun');
      $service = new AkademikService();
      $result = $service->buatKRS($nrm, $semesterke, $semester, $tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteKRS() {
    try {
      $nrm = $this->postv('nrm');
      $semesterke = $this->postv('semesterke');
      $semester = $this->postv('semester');
      $tahun = $this->postv('tahun');
      $service = new AkademikService();
      $result = $service->deleteKRS($nrm, $semesterke, $semester, $tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function entriKRS() {
    try {
      $nrm = $this->postv('nrm');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $semesterke = $this->postv('semesterke');
      $semesterkrs = $this->postv('semesterkrs');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $service = new AkademikService();
      $result = $service->entriKRS($nrm, $tahun, $semester, $semesterke, $semesterkrs, $kdmk, $kurikulum);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function dropKRS() {
    try {
      $nrm = $this->postv('nrm');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $semesterke = $this->postv('semesterke');
      $semesterkrs = $this->postv('semesterkrs');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $service = new AkademikService();
      $result = $service->dropKRS($nrm, $tahun, $semester, $semesterke, $semesterkrs, $kdmk, $kurikulum);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getKelas() {
    try {
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $service = new KelasService();
      $result = $service->getListKelas($tahun, $semester, $kdmk, $kurikulum);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function buatKelas() {
    try {
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $nama = $this->postv('nama');
      $service = new KelasService();
      $result = $service->buatKelas($tahun, $semester, $kdmk, $kurikulum, $nama);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function hapusKelas() {
    try {
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $nama = $this->postv('nama');
      $service = new KelasService();
      $result = $service->hapusKelas($tahun, $semester, $kdmk, $kurikulum, $nama);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getMahasiswaKelas($page = 1, $perpage = 10) {
    try {
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $nama = $this->postv('nama');
      $service = new KelasService();
      $result = $service->getMahasiswaKelas($tahun, $semester, $kdmk, $kurikulum, $nama, $page, $perpage);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getPemrogram($page = 1, $perpage = 10) {
    try {
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $service = new KelasService();
      $result = $service->getPemrogram($tahun, $semester, $kdmk, $kurikulum, $page, $perpage);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function masukkanKelas() {
    try {
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $nama = $this->postv('nama');
      $nrm = $this->postv('nrm');
      $service = new KelasService();
      $result = $service->masukkanKelas($tahun, $semester, $kdmk, $kurikulum, $nama, $nrm);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function keluarkanKelas() {
    try {
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $nama = $this->postv('nama');
      $nrm = $this->postv('nrm');
      $service = new KelasService();
      $result = $service->keluarkanKelas($tahun, $semester, $kdmk, $kurikulum, $nama, $nrm);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getNilaiKelas() {
    try {
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $nama = $this->postv('nama');
      $service = new KelasService();
      $result = $service->getNilaiKelas($tahun, $semester, $kdmk, $kurikulum, $nama);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function simpanNilaiMahasiswa() {
    try {
      $nrm = $this->postv('nrm');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $nilai = $this->postv('nilai');
      $bobotnilai = $this->postv('bobotnilai');
      $service = new AkademikService();
      $result = $service->simpanNilaiMahasiswa($nrm, $tahun, $semester, $kdmk, $kurikulum, $nilai, $bobotnilai);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getListMatakuliahKHS() {
    try {
      $nrm = $this->postv('nrm');
      $semester = $this->postv('semester');
      $semesterke = $this->postv('semesterke');
      $service = new AkademikService();
      $result = $service->getListMatakuliahKHS($nrm, $semester, $semesterke);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getListMatakuliahKHSTahunAkademik() {
    try {
      $nrm = $this->postv('nrm');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $service = new AkademikService();
      $result = $service->getListMatakuliahKHSTahunAkademik($nrm, $tahun, $semester);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getListMahasiswaMemprogram() {
    try {
      $prodi = $this->postv('prodi');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $service = new AkademikService();
      $result = $service->getListMahasiswaMemprogram($prodi, $tahun, $semester);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getTranskripNilai() {
    try {
      $nrm = $this->postv('nrm');
      $service = new AkademikService();
      $result = $service->getTranskripNilai($nrm);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function setStatusMatakuliahKRS() {
    try {
      $nrm = $this->postv('nrm');
      $tahun = $this->postv('tahun');
      $semester = $this->postv('semester');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $status = $this->postv('status');
      $service = new AkademikService();
      $result = $service->setStatusMatakuliahKRS($nrm, $tahun, $semester, $kdmk, $kurikulum, $status);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getDataAkademikMahasiswa() {
    try {
      $nrm = $this->postv('nrm');
      $service = new AkademikService();
      $result = $service->getDataAkademikMahasiswa($nrm);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function saveDataAkademik() {
    try {
      $nrm = $this->postv('nrm');
      $field = $this->postv('field');
      $value = $this->postv('value');
      $service = new AkademikService();
      $result = $service->saveDataAkademik($nrm, $field, $value);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function clearDataAkademik() {
    try {
      $nrm = $this->postv('nrm');
      $field = $this->postv('field');
      $service = new AkademikService();
      $result = $service->clearDataAkademik($nrm, $field);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getListTanggalWisuda() {
    try {
      $service = new AkademikService();
      $result = $service->getListTanggalWisuda();
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function createTanggalWisuda() {
    try {
      $tanggal = $this->postv('tanggal');
      $service = new AkademikService();
      $result = $service->createTanggalWisuda($tanggal);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteTanggalWisuda() {
    try {
      $tanggal = $this->postv('tanggal');
      $service = new AkademikService();
      $result = $service->deleteTanggalWisuda($tanggal);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getMahasiswaWisuda() {
    try {
      $service = new AkademikService();
      $tgwisuda = $this->postv('tgwisuda');
      $result = $service->getMahasiswaWisuda($tgwisuda);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getMahasiswaLulusBelumWisuda() {
    try {
      $service = new AkademikService();
      $result = $service->getMahasiswaLulusBelumWisuda();
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function daftarWisuda() {
    try {
      $tgwisuda = $this->postv('tgwisuda');
      $nrms = $this->postv('nrms');
      $service = new AkademikService();
      $result = $service->daftarWisuda($tgwisuda, $nrms);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function batalWisuda() {
    try {
      $tgwisuda = $this->postv('tgwisuda');
      $nrms = $this->postv('nrms');
      $service = new AkademikService();
      $result = $service->batalWisuda($nrms);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }


}