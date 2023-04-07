<?php

/** 
 * Boot class for module. 
 * */

class MController extends CoreController {

  private $controller;
  private $method;

  public function __construct()
  {
    $config = (Core::lib(Core::CONFIG));
    $this->controller = $config->get('default_controller', CoreConfig::CONFIG_TYPE_RUNTIME);
    $this->method = $config->get('default_method', CoreConfig::CONFIG_TYPE_RUNTIME);
  }
  
  function x($module = null, $controller = null, $method = null, ...$args) {

    $modulePath = CORE_APP_PATH . CoreModule::MODULE_DIR . DS . $module;
    if (empty($module) || !file_exists($modulePath)) 
      throw CoreError::instance('Invalid module: ' . $module);

    $controllerId = empty($controller) ? $this->controller : $controller;
    $controller = ucfirst($module) . ucfirst($controllerId) . "Controller";
    $method = empty($method) ? $this->method : $method;

    CoreModule::set($module, $controller, $controllerId, $method, $args);
    CoreModuleAutoloader::instance($module);

    if (!class_exists($controller)) throw CoreError::instance("Invalid controller: '$controller'");
    
    $controllerInstance = new $controller();
    if (!$controllerInstance instanceof CoreModuleController && 
        !$controllerInstance instanceof CoreApi)
      throw CoreError::instance("Invalid module controller: '$controller'");

    if ($controllerInstance instanceof CoreModuleController) {
      $controllerInstance->init($module, $controller, $controllerId, $method, $args);
      $controllerInstance->preamble();
    }

    try {
      if (method_exists($controller, $method))
        $controllerInstance->$method(...$args);
      else throw CoreError::instance("Invalid method: '$method' on module: '$module' controller: '$controller'. ");
    } catch(Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

}