<?php

class KbLogApiController extends CoreApi {

  function extractCompareCount() {
    // $id = $this->postv('id');
    // $title = $this->postv('title');
    // $data = $this->postv('data');
    try {
      $service = new LogService();
      $result = $service->extractCompareCount();
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  function extractCompareCountA() {
    // $id = $this->postv('id');
    // $title = $this->postv('title');
    // $data = $this->postv('data');
    try {
      $service = new LogService();
      $result = $service->extractCompareCountA();
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

}

?>