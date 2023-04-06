<?php

class CoreModuleAutoloader {

  private static $module;
  private static $autoloader;

  public static function instance($module)
  {
    self::$module = $module;
    self::$autoloader = new CoreModuleAutoloader();
    CoreAutoloader::register(array(CoreModuleAutoloader::$autoloader, 'module_api'));
    CoreAutoloader::register(array(CoreModuleAutoloader::$autoloader, 'module_controller'));
    CoreAutoloader::register(array(CoreModuleAutoloader::$autoloader, 'module_service'));
    CoreAutoloader::register(array(CoreModuleAutoloader::$autoloader, 'module_library'));
  }

  public function module_api($className) {
    $classFile = CORE_APP_PATH . CoreModule::MODULE_DIR . DS . self::$module . DS . "api" . DS . $className . ".php";
    if (file_exists($classFile)) @require_once($classFile);
  }

  public function module_controller($className) {
    $classFile = CORE_APP_PATH . CoreModule::MODULE_DIR . DS . self::$module . DS . "controller" . DS . $className . ".php";
    if (file_exists($classFile)) @require_once($classFile);
  }

  public function module_service($className) {
    $classFile = CORE_APP_PATH . CoreModule::MODULE_DIR . DS . self::$module . DS . "service" . DS . $className . ".php";
    if (file_exists($classFile)) @require_once($classFile);
  }

  public function module_library($className) {
    $classFile = CORE_APP_PATH . CoreModule::MODULE_DIR . DS . self::$module . DS . "lib" . DS . $className . ".php";
    if (file_exists($classFile)) @require_once($classFile);
  }

}