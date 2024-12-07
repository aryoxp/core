<?php

class WakaMatakuliahApiController extends CoreApi {

  public function search($page = 1, $perpage=100, $sort='asc') {
    try {
      $service = new MatakuliahService();
      $keyword = $this->postv('keyword');
      $prodi = $this->postv('prodi');
      $kurikulum = $this->postv('kurikulum');
      $result = $service->search($keyword, $prodi, $kurikulum, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getMatakuliah() {
    try {
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $service = new MatakuliahService();
      $result = $service->getMatakuliah($kdmk, $kurikulum);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function createMatakuliah() {
    try {
      $service = new MatakuliahService();
      $kdmk = $this->postv('kdmk');
      $namamk = $this->postv('namamk');
      $kurikulum = $this->postv('kurikulum');
      $prodi = $this->postv('prodi');
      $mkname = $this->postv('mkname');
      $sks = $this->postv('sks');
      $result = $service->insert($kdmk, $kurikulum, $prodi, $namamk, $mkname, $sks);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteMatakuliah() {
    try {
      $service = new MatakuliahService();
      $kdmk = $this->postv('kdmk');
      $result = $service->deleteMatakuliah($kdmk);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateMatakuliah() {
    try {
      $service = new MatakuliahService();
      $id = $this->postv('id');
      $kdmk = $this->postv('kdmk');
      $kurikulum = $this->postv('kurikulum');
      $prodi = $this->postv('prodi');
      $namamk = $this->postv('namamk');
      $mkname = $this->postv('mkname');
      $sks = $this->postv('sks');
      $result = $service->updateMatakuliah($id, $kdmk, $kurikulum, $prodi, $namamk, $mkname, $sks);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

}