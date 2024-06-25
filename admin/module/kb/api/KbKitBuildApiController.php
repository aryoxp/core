<?php

class KbKitBuildApiController extends CoreApi {

  function save() {
    $id = $this->postv('id');
    $title = $this->postv('title');
    $data = $this->postv('data');
    try {
      $service = new KitBuildService();
      $result = $service->insertOrUpdate($id, $title, $data);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  function getConceptMaps($keyword = null) {
    try {
      $service = new KitBuildService();
      $result = $service->getConceptMaps($keyword);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  function searchConceptMaps($keyword = null) {
    try {
      $service = new KitBuildService();
      $result = $service->searchConceptMaps($keyword);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  function openConceptMap($cmid = null) {
    try {
      $service = new KitBuildService();
      $result = $service->openConceptMap($cmid);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  function getKitListByConceptMap($cmid = null) {
    try {
      $service = new KitBuildService();
      $result = $service->getKitListByConceptMap($cmid);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  function saveKitMap() {
    $id = $this->postv('id');
    $title = $this->postv('title');
    $cmid = $this->postv('cmid');
    $data = $this->postv('data');
    $options = $this->postv('options');
    try {
      $service = new KitBuildService();
      $result = $service->insertOrUpdateKitMap($id, $title, $cmid, $data, $options);
      $result = $service->getKitMap($id);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  function updateKitMap() {
    $id = $this->postv('id');
    $newid = $this->postv('newid');
    $title = $this->postv('title');
    $cmid = $this->postv('cmid');
    $data = $this->postv('data');
    $options = $this->postv('options');
    try {
      $service = new KitBuildService();
      $result = $service->updateKitMap($id, $newid, $title, $cmid, $data, $options);
      $result = $service->getKitMap($newid);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  function openKitMap($id = null) {
    try {
      $service = new KitBuildService();
      $result = $service->getKitMap($id);
      $result->conceptMap = $service->openConceptMap($result->cmid);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  function openLearnerMap($lmid = null) {
    try {
      $service = new LearnerMapService();
      $learnerMap = $service->getLearnerMap($lmid);
      CoreResult::instance($learnerMap)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

}