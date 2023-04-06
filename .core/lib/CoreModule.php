<?php

class CoreModule {

  const MODULE_DIR = "module";

  private $menu = array();
  
  private static $module;
  private static $controller;
  private static $controllerId;
  private static $method;
  private static $args;

  const MODULE       = 1;
  const CONTROLLER   = 2;
  const CONTROLLERID = 3;
  const METHOD       = 4;
  const ARGS         = 5;

  public function __construct($id) {
    $this->menu = CoreModule::loadMenu($id);
  }

  public function menu() {
    return $this->menu;
  }

  private static function parseMenu($menu) {
    $m = new CoreMenu();
    if (property_exists($menu, 'label')) $m->label = $menu->label;
    if (property_exists($menu, 'id'))    $m->id = $menu->id;
    if (property_exists($menu, 'icon'))  $m->icon = $menu->icon;
    if (property_exists($menu, 'url'))   $m->url = $menu->url;
    if (property_exists($menu, 'subs') && is_array($menu->subs)) {
      foreach ($menu->subs as $sub)
        $m->addSub(CoreModule::parseMenu($sub));
    }
    return $m;
  }

  public static function loadMenu($module) {
    $menus = array();
    $menuFile = CORE_APP_PATH . CoreModule::MODULE_DIR . DS . $module . DS . CORE_APP_CONFIG . "menu.json";
    if (file_exists($menuFile)) {
      $menusJson = json_decode(file_get_contents($menuFile));
      foreach($menusJson as $menu)
        $menus[] = CoreModule::parseMenu($menu);
    }
    return $menus;
  }

  public static function set($module, $controller, $controllerId = null, $method = null, $args = []) {
    CoreModule::$module = $module;
    CoreModule::$controller = $controller;
    CoreModule::$controllerId = $controllerId;
    CoreModule::$method = $method;
    CoreModule::$args = $args;
  }

  public static function part($what = null) {
    switch($what) {
      case CoreModule::MODULE:
        return CoreModule::$module;
      case CoreModule::CONTROLLER:
        return CoreModule::$controller;
      case CoreModule::CONTROLLERID:
        return CoreModule::$controllerId;
      case CoreModule::METHOD:
        return CoreModule::$method;
      case CoreModule::ARGS:
        return CoreModule::$args;
    }
    return null;
  }

  public static function getModules() {
    $moduleKeys = CoreModule::getAvailableModules();
    $modules = array();
    foreach($moduleKeys as $key)
      $modules[] = new CoreModule($key);
    return $modules;
  }

  public static function getAvailableModules() {
    $modulesDir = CORE_APP_PATH . CoreModule::MODULE_DIR . DS;
    $dirs  = array_diff(scandir($modulesDir), array('.', '..'));
    $dirs  = preg_grep('/^\./i', $dirs, PREG_GREP_INVERT);
    return $dirs;
    // $runtimeModules = CORE_APP_PATH . "runtime" . DS . "modules.ini";
    // $activeModules = parse_ini_file($runtimeModules);
    // $data['active-modules'] = @$activeModules['modules'] ? $activeModules['modules'] : [];
    
    // $data['module-keys'] = [];
    // foreach($data['active-modules'] as $m) {
    //   $data['module-keys'][] = $m;
    //   $i = array_search($m, $dirs);
    //   unset($dirs[$i]);
    // }
  }

}