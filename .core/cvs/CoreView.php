<?php

defined('CORE') or (header($_SERVER["SERVER_PROTOCOL"] . " 403 Forbidden") and die('403.14 - Access denied.'));

class CoreView {

  private static $instance;
  private const PLUGIN_DEF_FILE = 'plugins.ini';

  protected $styles        = array();
  protected $scripts       = array();
  protected $modulescripts = array();
  protected $heads         = array();
  protected $foots         = array();
  protected $plugins       = array();

  public const NONE     = 0;
  public const RETURN   = 1;
  public const RELATIVE = 2;
  public const CORE     = 4;
  public const ASSET    = 8;
  public const APP      = 16;
  public const SHARED   = 32;
  public const ALL_VIEW = -1;

  public static function instance() {
    if (self::$instance == null) self::$instance = new CoreView();
    return self::$instance;
  }

  // /**
  //  * Get an instance of language library 
  //  * and load the specified language definition file.
  //  * $path: path to the language definition file, relative to /app/asset/lang/ directory
  //  * $location: path to the language definition file, relative to /app/ or global .shared/ directory
  //  */
  // public function language($path, $location = CoreLanguage::LOCATION_APP, $countryCode = CoreLanguage::DEFAULT_LANG_CODE) {
  //   CoreLanguage::instance()->load($path, $location, $countryCode);
  // }

  // /**
  //  * Get the language definition of a specified key.
  //  * $params: parameters passed to the language string template.
  //  */
  // public function l($key = '', ...$params) {
  //   if ($key == '' || trim($key) == '') return "-";
  //   return CoreLanguage::instance()->get($key, ...$params);
  // }

  /**
   * Output the specified data into JSON format. 
   */
  public function json($data) {
    CoreResult::instance($data)->json();
  }

  /**
   * Insert custom contents inside <head> tag.
   */
  public function head($content) {
    $this->heads[] = $content;
    return $this;
  }

  /**
   * Insert custom contents below </body> tag.
   */
  public function foot($content) {
    $this->foots[] = $content;
    return $this;
  }

  public function view($view, $data = array(), $options = null) {

    $return   = $options & self::RETURN;
    $relative = $options & self::RELATIVE;
    $core     = $options & self::CORE;
    $asset    = $options & self::ASSET;
    $app      = $options & self::APP;
    $shared   = $options & self::SHARED;

    $viewDir  = Core::lib(Core::CONFIG)->get('core_app_view_directory', CoreConfig::CONFIG_TYPE_CORE);
    $viewPath = CORE_APP_PATH . $viewDir . DS . $view;
    if ($relative) {
      $backtrace = debug_backtrace();
      if($trace = $backtrace[0]) $viewPath = dirname($trace['file']) . DS . $view;
    }
    $viewPath = $asset ? CORE_APP_PATH . CORE_APP_ASSET . $view : $viewPath;
    $viewPath = $shared ? $view : $viewPath;
    $viewPath = $app ? CORE_APP_PATH . $view : $viewPath;
    $viewPath = $core ? CORE_VIEW_PATH . $view : $viewPath;

    // var_dump($return, $relative, $core, $shared, $asset, $app, $options);
    // var_dump($viewPath);

    if (is_array($data)) {
      extract($data, EXTR_PREFIX_SAME, "arg");
      extract($data, EXTR_PREFIX_INVALID, "arg");
    }
    if ($return) ob_start();
    if (file_exists($viewPath) and is_readable($viewPath)) include $viewPath;
    else {
      echo 'View: ' . $view . ' not found at ' . $viewPath . "\n";
    }
    if ($return) return ob_get_clean();
  }

  public function viewPlugin($key, $data = null, $index = CoreView::ALL_VIEW, $options = CoreView::SHARED) {
    if (isset($this->plugins[$key]) && $p = $this->plugins[$key]) {
      $views = $p['views'] ?? array();
      $path = $p['path'] ? $p['path'] : null;
      if (substr("testers", -1) != DS) $path .= DS;
      if ($index == CoreView::ALL_VIEW) {
        foreach($views as $v) $this->view($path . $v, $data, $options);
      } else $this->view($path . $views[$index], $data, $options);

      $views = $p['coreviews'] ?? array();
      $path = $p['path'] ? $p['path'] : null;
      if (substr("testers", -1) != DS) $path .= DS;
      if ($index == CoreView::ALL_VIEW) {
        foreach($views as $v) $this->view(CORE_ASSET_PATH. $v, $data, $options);
      } else $this->view(CORE_ASSET_PATH . $views[$index], $data, $options);
    }
  }

  public function location($path = '', $location = CoreView::NONE, $basePath = null) {
    if (preg_match("/^http(s?)\:\/\//i", $path ?? "")) return $path;
    switch($location) {
      case CoreView::APP:
        $index = Core::lib(Core::CONFIG)->get('pretty_url', CoreConfig::CONFIG_TYPE_RUNTIME) ? "" : "index.php";
        $location = Core::lib(Core::URI)->get(CoreUri::BASEURL)
        . ($index ? ($index . DS) : "") 
        . ($basePath ? rtrim($basePath, "/") . DS : null) 
        . $path;
        break;
      default:
        $location = Core::lib(Core::URI)->get(CoreUri::BASELINKAPPURL) 
        . ($basePath ? rtrim($basePath, "/") . DS : null) 
        . $path;
        break;
    }
    return @$location;
  }

  public function file($path = '', $location = CoreView::NONE, $basePath = null) {
    if (preg_match("/http(s?)\:\/\//i", $path ?? "")) return $path;
    switch($location) {
      case CoreView::APP:
        $location = Core::lib(Core::URI)->get(CoreUri::BASEURL) 
        . ($basePath ? rtrim($basePath, "/") . DS : null) . $path;
        break;
      default:
        $location = Core::lib(Core::URI)->get(CoreUri::BASEFILEURL) 
        . ($basePath ? rtrim($basePath, "/") . DS : null) 
        . $path;
        break;
    }
    return @$location;
  }

  public function asset($path = '', $basePath = null) {
    if (preg_match("/http(s?)\:\/\//i", $path ?? "")) return $path;
    $location = Core::lib(Core::URI)->get(CoreUri::BASEURL)
      . ($basePath ? $basePath : Core::lib(Core::URI)->get(CoreUri::APP) . DS . CORE_APP_ASSET) 
      . $path;
    return @$location;
  }

  public function useScript($path, $pad = null, $assetPath = null) {

    /**
     * Is the path starts with http?
     * Then include the script as it is...
     */
    if (preg_match("/^http(s?)\:\/\//i", $path)) {
      $script = $path . ($pad ? $pad : '');
      if (in_array($script, $this->scripts)) return true;
      $this->scripts[] = $script;
      return true;
    }

    $scriptPath = ($assetPath ? CORE_ROOT_PATH . $assetPath : CORE_APP_PATH . CORE_APP_ASSET) . $path;
    if (file_exists($scriptPath)) {
      $script = $this->asset($path, $assetPath) . ($pad ? $pad : '');
      if (!in_array($script, $this->scripts))
        $this->scripts[] = $script;
      return true;
    } else echo '<!-- Invalid: ' . $scriptPath . '-->';
    return false;
  }

  public function useModuleScript($path, $pad = null, $assetPath = null) {

    /**
     * Is the path starts with http?
     * Then include the script as it is...
     */
    if (preg_match("/^http(s?)\:\/\//i", $path)) {
      $script = $path . ($pad ? $pad : '');
      if (in_array($script, $this->modulescripts)) return true;
      $this->modulescripts[] = $script;
      return true;
    }

    $scriptPath = ($assetPath ? CORE_ROOT_PATH . $assetPath : CORE_APP_PATH . CORE_APP_ASSET) . $path;
    if (file_exists($scriptPath)) {
      $script = $this->asset($path, $assetPath) . ($pad ? $pad : '');
      if (!in_array($script, $this->modulescripts))
        $this->modulescripts[] = $script;
      return true;
    } else echo '<!-- Invalid: ' . $scriptPath . '-->';
    return false;
  }

  public function useStyle($path, $pad = null, $assetPath = null) {

    /**
     * Is the path starts with http?
     * Then include the style as it is...
     */
    if (preg_match("/^http(s?)\:\/\//i", $path)) {
      $style = $path . ($pad ? $pad : '');
      if (in_array($style, $this->styles)) return true;
      $this->styles[] = $style;
      return true;
    }

    $stylePath = ($assetPath ? CORE_ROOT_PATH . $assetPath : CORE_APP_PATH . CORE_APP_ASSET) . $path;
    if (file_exists($stylePath)) {
      $style = $this->asset($path, $assetPath) . ($pad ? $pad : '');
      if (!in_array($style, $this->styles))
        $this->styles[] = $style;
      return true;
    } else  echo '<!-- Invalid: ' . $stylePath . '-->';
    return false;
  }

  public function usePlugin(...$key) {

    if (!count($this->plugins)) {
      $pluginsFile = CORE_CONFIG_PATH . CoreView::PLUGIN_DEF_FILE;
      $apppluginsFile = CORE_APP_PATH . CORE_APP_CONFIG . CoreView::PLUGIN_DEF_FILE;
      $sharedpluginsFile = CORE_SHARED_PATH . CORE_SHARED_CONFIG . CoreView::PLUGIN_DEF_FILE;

      // var_dump($pluginsFile, $apppluginsFile, $sharedpluginsFile);

      if (file_exists($pluginsFile) and is_readable($pluginsFile))
        $this->plugins = parse_ini_file($pluginsFile, true);
      if (file_exists($apppluginsFile) and is_readable($apppluginsFile))
        $this->plugins = array_merge($this->plugins, parse_ini_file($apppluginsFile, true));
      if (file_exists($sharedpluginsFile) and is_readable($sharedpluginsFile))
        $this->plugins = array_merge($this->plugins, parse_ini_file($sharedpluginsFile, true));
    }
    // var_dump(CORE_ASSET_PATH);
    foreach ($key as $k) {
      if (isset($this->plugins[$k]) && $p = $this->plugins[$k]) {
        // var_dump($this->plugins[$k]);
        if (isset($p['dependencies'])) {
          foreach ($p['dependencies'] as $dep) {
            $this->usePlugin($dep);
          }
        }
        if (isset($p['scripts'])) {
          foreach ($p['scripts'] as $s) {
            $this->useScript($s, null, isset($p['path']) ? $p['path'] . DS : null);
          }
        }
        if (isset($p['modulescripts'])) {
          foreach ($p['modulescripts'] as $s) {
            $this->useModuleScript($s, null, isset($p['path']) ? $p['path'] . DS : null);
          }
        }
        if (isset($p['styles'])) {
          foreach ($p['styles'] as $s) {
            $this->useStyle($s, null, isset($p['path']) ? $p['path'] . DS : null);
          }
        }
        if (isset($p['corescripts'])) {
          foreach ($p['corescripts'] as $s) {
            $this->useScript($s, null, CORE_ASSET_PATH);
          }
        }
        if (isset($p['corestyles'])) {
          foreach ($p['corestyles'] as $s) {
            $this->useStyle($s, null, CORE_ASSET_PATH);
          }
        }
      } else echo "<!-- Cannot find plugin definition of key: $k. -->";
    }
  }

  public function useCoreLib(...$pluginKeys) {
    $this->usePlugin('core-client'); // core-client-min
    $this->usePlugin('core-runtime');

    foreach ($pluginKeys as $pluginKey) $this->usePlugin($pluginKey);

    $clientBaseConfig                  = new stdClass;
    $clientBaseConfig->{'app'}         = Core::lib(Core::URI)->get(CoreUri::APP);
    $clientBaseConfig->{'controller'}  = Core::lib(Core::URI)->get(CoreUri::CONTROLLERID);
    $clientBaseConfig->{'method'}      = Core::lib(Core::URI)->get(CoreUri::METHOD);
    $clientBaseConfig->{'baseurl'}     = $this->location();
    $clientBaseConfig->{'basefileurl'} = $this->file();
    $clientBaseConfig->{'asseturl'}    = $this->asset();
    $clientBaseConfig->{'sessid'}      = session_id();

    Core::lib(Core::CONFIG)->set('core', base64_encode(json_encode($clientBaseConfig)), CoreConfig::CONFIG_TYPE_CLIENT);
  }

  // Needed from Core's View: head.php
  private function metaConfig() {
    if (!$cfgs = Core::lib(Core::CONFIG)->dump(CoreConfig::CONFIG_TYPE_CLIENT)) return;
    if ($lang = (Core::instance())->peekLib(Core::LANGUAGE)) {

      echo '    <meta id="core-lang" data-lang="' . "\n      ";
      echo implode("\n      ", 
        str_split(CoreApi::compress(json_encode($lang->dump())), 80)
        ) . "\">\n";
    }
    echo '    <meta id="core-client-config" ';
    $i = 0;
    foreach ($cfgs as $key => $value) {
      if ($key == 'core') {
        echo ($i > 0 ? "\n" : "") . "      data-{$key}=\"" . "\n      ";
        echo implode("\n      ", str_split($value, 80)) . "\"";
      } else echo ($i > 0 ? "\n      " : "") . "data-{$key}=\"{$value}\"";
      $i++;
    }
    echo ">\n";
  }

  private function headStyle() {
    foreach($this->styles as $s) echo '    <link rel="stylesheet" href="'.$s.'">' . "\n";
  }

  private function customHead() {
    if ($this->heads && count($this->heads)) echo "\n    " . implode("\n    " , $this->heads) . "\n\n";
  }

  private function footScript() {
    foreach($this->modulescripts as $s) echo '  <script type="module" src="'.$s.'"></script>' . "\n";
    foreach($this->scripts as $s) echo '  <script type="text/javascript" src="'.$s.'"></script>' . "\n";
  }

  private function customFoot() {
    if ($this->foots && count($this->foots)) echo "\n  " . implode("\n  " , $this->foots) . "\n\n";
  }

}
