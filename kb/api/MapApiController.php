<?php

class MapApiController extends CoreApi {
  
  function get($mapid = null) {
    try {
      $service = new KitService();
      $kit = $service->getKit($mapid);
      if (!$kit) throw new CoreError('Kit not found.');
      $conceptMap = $service->getConceptMap($kit->cmid);
      if (!$conceptMap) throw new CoreError('Concept map information not found.');
      // $result = CoreApi::decompress($kit->data);
      $result = new stdClass;
      $result->id = $mapid;
      $result->mapdata = 'conceptMap='.$conceptMap->data."\r\n";
      $result->mapdata .= 'kit='.$kit->data."\r\n";
      CoreResult::instance($result)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  function saveLearnerMap() {
    try {
      $userid = $this->postv('userid');
      $cmid = $this->postv('cmid');
      $kid = $this->postv('kid');
      $type = $this->postv('type');
      $data = $this->postv('data');

      $service = new LearnerMapService();
      $id = $service->insert($userid, $cmid, $kid, $type, $data);
      $lmap = $service->get($id);
      CoreResult::instance($lmap)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  function saveDraftLearnerMap() {
    try {
      $userid = $this->postv('userid');
      $cmid = $this->postv('cmid');
      $kid = $this->postv('kid');
      $data = $this->postv('data');
      
      $service = new LearnerMapService();
      $id = $service->insertDraft($userid, $cmid, $kid, $data);
      $lmap = $service->get($id);
      CoreResult::instance($lmap)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  function getConceptMapReferenceList($cmid) {
    try {
      $service = new KitBuildService();
      $references = $service->getConceptMapReferenceList($cmid);
      CoreResult::instance($references)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  function getConceptMapReferences($cmid) {
    try {
      $service = new KitBuildService();
      $references = $service->getConceptMapReferences($cmid);
      CoreResult::instance($references)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  function getConceptMapReference($id, $cmid) {
    try {
      $service = new KitBuildService();
      $references = $service->getConceptMapReference($id, $cmid);
      CoreResult::instance($references)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

}