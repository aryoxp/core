<?php

class WakaKurikulumApiController extends CoreApi {

  public function search($page = 1, $perpage=100, $sort='asc') {
    try {
      $service = new KurikulumService();
      $keyword = $this->postv('keyword');
      $result = $service->search($keyword, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getKurikulum($tahun) {
    try {
      $service = new KurikulumService();
      $result = $service->getKurikulum($tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function createKurikulum() {
    try {
      $service = new KurikulumService();
      $tahun = $this->postv('tahun');
      $result = $service->insert($tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteKurikulum() {
    try {
      $service = new KurikulumService();
      $tahun = $this->postv('tahun');
      $result = $service->deleteKurikulum($tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateKurikulum() {
    try {
      $service = new KurikulumService();
      $id = $this->postv('id');
      $tahun = $this->postv('tahun');
      $result = $service->updateKurikulum($id, $tahun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

}