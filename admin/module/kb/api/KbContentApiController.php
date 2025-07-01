<?php

class KbContentApiController extends CoreApi {

  function getTexts($page = 1, $perpage = 5) {
    try {
      $keyword = $this->postv('keyword');
      $cmid = $this->postv('cmid');
      $service = new ContentService();
      $result = $service->getTexts($cmid, $keyword, $page, $perpage);
      CoreResult::instance($result)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

}