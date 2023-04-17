<?php

defined('CORE') or (header($_SERVER["SERVER_PROTOCOL"] . " 403 Forbidden") and die('403.14 - Access denied.'));

class CoreController extends CoreApi {

  protected $ui;

  public function __construct() {
    parent::__construct();
    $this->ui = CoreView::instance($this);
  }

  public function redirect($destination = null) {
    $destination = (empty($destination)) ? $this->location() : $destination;
    if (!preg_match("/^http(s)\:\/\//i", $destination))
      $destination = $this->location() . $destination;
    header('location: ' . trim($destination));
    exit;
  }

  // UI URL Wrappers

  public function location($path = null, $location = CoreView::NONE, $basePath = null) {
    return $this->ui->location($path, $location, $basePath);
  }
  public function file($path, $location = CoreView::NONE, $basePath = null) {
    return $this->ui->file($path, $location, $basePath);
  }
  public function asset($path, $location = CoreView::NONE, $basePath = null) {
    return $this->ui->asset($path, $location, $basePath);
  }
}
