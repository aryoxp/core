<?php

use PSpell\Config;

defined('CORE') or (header($_SERVER["SERVER_PROTOCOL"] . " 403 Forbidden") and die('403.14 - Access denied.'));

class CoreService {

  private static $connections = [];

  protected static function instance($configKey = null) {

    $config = Core::lib(Core::CONFIG);
    if ($configKey === null) 
      $configKey = $config->get('default_db_key');
    
    $dbConfig = $config->loadDatabaseConfig();

    if (!@$dbConfig[$configKey])
      throw CoreError::instance('Database configuration for key: \'' . $configKey . '\' does not exists.');
    $driverType = $dbConfig[$configKey]['driver'];
    $driverId = $driverType."-".$configKey;
    if (!isset(CoreService::$connections[$driverId])) {
      $dbDriverName = "CoreDB" . ucfirst($driverType);
      if (!class_exists($dbDriverName))
        throw CoreError::instance('DB driver implementation for ' . $dbDriverName . ' does not exists.');
      CoreService::$connections[$driverId] = new $dbDriverName($dbConfig[$configKey]);
    }
    return CoreService::$connections[$driverId];
    
  }

}
