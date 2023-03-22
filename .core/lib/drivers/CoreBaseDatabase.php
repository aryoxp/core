<?php

defined('CORE') or (header($_SERVER["SERVER_PROTOCOL"] . " 403 Forbidden") and die('403.14 - Access denied.'));

class CoreBaseDatabase {

  protected $link;
  protected $dbConfig = null;

  function __construct($config) {
    $this->dbConfig = $config;
  }

  function getConfig() {
    return $this->dbConfig;
  }

  function getLink() {
    return $this->link;
  }

}