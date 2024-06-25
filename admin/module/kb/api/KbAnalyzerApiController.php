<?php

defined('CORE') or (header($_SERVER["SERVER_PROTOCOL"] . " 403 Forbidden") and die('403.14 - Access denied.'));
defined('CORE') or die();

class KbAnalyzerApiController extends CoreApi {

  function getLearnerMapsOfConceptMap($cmid) {
    try {
      $service = new LearnerMapService();
      $learnerMaps = $service->getLearnerMapsOfConceptMap($cmid);
      CoreResult::instance(CoreApi::compress(json_encode($learnerMaps)))->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  function getSessions() {
    try {
      $service = new AnalyzerService();
      $sessions = $service->getSessions();
      CoreResult::instance(CoreApi::compress(json_encode($sessions)))->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  function getSessionsOfConceptMap($cmid) {
    try {
      $service = new AnalyzerService();
      $sessions = $service->getSessionsOfConceptMap($cmid);
      CoreResult::instance(CoreApi::compress(json_encode($sessions)))->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

  function getSessionLogs($sessid) {
    try {
      $service = new AnalyzerService();
      $sessions = $service->getSessionLogs($sessid);
      CoreResult::instance(CoreApi::compress(json_encode($sessions)))->show();
    } catch (Exception $ex) {
      CoreError::instance($ex->getMessage())->show();
    }
  }

}