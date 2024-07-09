<?php

class MapApiController extends CoreApi {
  
  // function get($mapid = null) {
  //   try {
  //     $service = new KitService();
  //     $kit = $service->getKit($mapid);
  //     if (!$kit) throw new CoreError('Kit not found.');
  //     $conceptMap = $service->getConceptMap($kit->cmid);
  //     if (!$conceptMap) throw new CoreError('Concept map information not found.');
  //     // $result = CoreApi::decompress($kit->data);
  //     $result = new stdClass;
  //     $result->id = $mapid;
  //     $result->mapdata = 'conceptMap='.$conceptMap->data."\r\n";
  //     $result->mapdata .= 'kit='.$kit->data."\r\n";
  //     CoreResult::instance($result)->show();
  //   } catch (Exception $ex) {
  //     CoreError::instance($ex->getMessage())->show();
  //   }
  // }

  function saveScratchMap() {
    try {
      $userid = $this->postv('userid');
      $type   = $this->postv('type');
      $title  = $this->postv('title');
      $data   = $this->postv('data');

      $service = new ScratchMapService();
      $id = $service->insert($userid, $type, $title, $data);
      $smap = $service->get($id);
      CoreResult::instance($smap)->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  // function saveDraftLearnerMap() {
  //   try {
  //     $userid = $this->postv('userid');
  //     $cmid = $this->postv('cmid');
  //     $kid = $this->postv('kid');
  //     $data = $this->postv('data');
      
  //     $service = new LearnerMapService();
  //     $id = $service->insertDraft($userid, $cmid, $kid, $data);
  //     $lmap = $service->get($id);
  //     CoreResult::instance($lmap)->show();
  //   } catch (Exception $ex) {
  //     CoreError::instance($ex->getMessage())->show();
  //   }
  // }

}