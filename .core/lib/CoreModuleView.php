<?php

class CoreModuleView extends CoreView {

  private static $instance;

  public const MODULE = 64;

  public static function instance() {
    if (self::$instance == null) self::$instance = new CoreModuleView();
    return self::$instance;
  }

  private function header($data = []) {
    parent::view('module-head.php', $data);
  }

  private function footer($data = []) {
    parent::view('module-foot.php', $data);
  }
  
  public function view($view, $data = array(), $mode = null) {
    if(!is_array($data)) $data = array();
    switch($mode) {
      case CoreModuleView::APP:
        parent::view('view' . DS . $view, $data, $mode);
        return;
      case CoreModuleView::CORE:
      case CoreModuleView::SHARED:
        parent::view($view, $data, $mode);
        return;
      case CoreModuleView::MODULE:
        $this->header($data);
      default:
        if (is_array($data)) {
          extract($data, EXTR_PREFIX_SAME, "arg");
          extract($data, EXTR_PREFIX_INVALID, "arg");
        }
        $viewPath = CORE_APP_PATH 
          . CoreModule::MODULE_DIR . DS 
          . CoreModule::part(CoreModule::MODULE) . DS . 'view' . DS . $view;
        if ($mode == CoreModuleView::RETURN) ob_start();
        if (file_exists($viewPath) and is_readable($viewPath)) include $viewPath;
        else {
          echo 'Module View: ' . $view . ' not found at ' . $viewPath . "\n";
        }
        if ($mode == CoreModuleView::RETURN) return ob_get_clean();
        if ($mode == CoreModuleView::MODULE) $this->footer($data);
    }
  }

  public function useScript($path, $pad = null, $assetPath = null, $location = CoreModuleView::MODULE) {
    if (file_exists(CORE_MODULE_PATH . CORE_APP_ASSET . $path)) {
      $this->scripts[] = $this->moduleAsset($path, $pad, $assetPath, $location);
      return;
    } else parent::useScript($path, $pad, $assetPath);
  }

  public function useStyle($path, $pad = null, $assetPath = null, $location = CoreModuleView::MODULE) {
    if (file_exists(CORE_MODULE_PATH . CORE_APP_ASSET . $path)) {
      $this->styles[] = $this->moduleAsset($path, $pad, $assetPath, $location);
      return;
    } else parent::useStyle($path, $pad, $assetPath);
  }

  public function moduleAsset($path = '', $basePath = '') {
    if (preg_match("/http(s?)\:\/\//i", $path)) return $path;
    $location = Core::lib(Core::URI)->get(CoreUri::BASEURL)
      . ($basePath ? $basePath : Core::lib(Core::URI)->get(CoreUri::APP) . DS 
      . CoreModule::MODULE_DIR . DS 
      . CoreModule::part(CoreModule::MODULE) . DS 
      . CORE_APP_ASSET) . $path;
    return @$location;
  }


}