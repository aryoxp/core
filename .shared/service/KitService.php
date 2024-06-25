<?php

defined('CORE') or (header($_SERVER["SERVER_PROTOCOL"] . " 403 Forbidden") and die('403.14 - Access denied.'));
defined('CORE') or die();

class KitService extends CoreService {

  function getKit($kid) {
    try {
      $db = self::instance();
      $qb = QB::instance('kit');
      $qb->select()->where('id', QB::esc($kid));
      $result = $db->getRow($qb->get());
      return $result;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function getConceptMap($cmid) {
    try {
      $db = self::instance();
      $qb = QB::instance('conceptmap');
      $qb->select()->where('id', QB::esc($cmid));
      $result = $db->getRow($qb->get());
      return $result;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }



}