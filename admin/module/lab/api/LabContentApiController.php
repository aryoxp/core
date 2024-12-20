<?php

class LabContentApiController extends CoreApi {

  public function search($page = 1, $perpage=100, $sort='asc') {
    try {
      $service = new ContentService();
      $keyword = $this->postv('keyword');
      $filter = $this->postv('filter');
      $result = $service->search($keyword, $filter, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function save() {
    try {
      $service = new ContentService();
      $key = $this->postv('key');
      $title = $this->postv('title');
      $content = $this->postv('content');
      $subtitle = $this->postv('subtitle');
      $type = $this->postv('type');
      $id = $this->postv('cid');
      $result = $service->save($type, $key, 
        $title, $content, $subtitle, $id);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getContent($cid) {
    try {
      $service = new ContentService();
      $result = $service->getContent($cid);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteContent() {
    try {
      $cid = $this->postv('cid');
      $service = new ContentService();
      $result = $service->deleteContent($cid);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

}
