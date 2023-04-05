<?php

class CoreModule {

  const CORE_MODULE_DIR = "module";

  private $menu = array();

  public function __construct($id)
  {
    $this->menu = CoreModule::loadMenu($id);
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
    // var_dump(get_defined_constants());
    $menus = array();
    $menuFile = CORE_APP_PATH . CoreModule::CORE_MODULE_DIR . DS . $module . DS . CORE_APP_CONFIG . "menu.json";
    if (file_exists($menuFile)) {
      $menusJson = json_decode(file_get_contents($menuFile));
      foreach($menusJson as $menu)
        $menus[] = CoreModule::parseMenu($menu);
    }
    return $menus;
  }

  public static function getAvailableModules() {
    $modulesDir = CORE_APP_PATH . CoreModule::CORE_MODULE_DIR . DS;
    $dirs  = array_diff(scandir($modulesDir), array('.', '..')); // var_dump($dirs);
    // $mdirs = $dirs;
    $dirs  = preg_grep('/^\./i', $dirs, PREG_GREP_INVERT);
    // var_dump($dirs);
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