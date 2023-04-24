<?php
class SetupService extends CoreService {
  public function checkDb($key) {
    try {
      $db = self::instance($key);
      if ($result = $db->getVar('SELECT 1')) return true;
      else return false;
    } catch (Exception $e) {
      return false;
    }
  }
  public function getTableCount($key) {
    try {
      $db = self::instance($key);
      $result = $db->query('SHOW TABLES');
      return count($result);
    } catch (Exception $e) {
      return false;
    }
  }
}