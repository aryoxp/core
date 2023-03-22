<?php 

defined('CORE') or (header($_SERVER["SERVER_PROTOCOL"] . " 403 Forbidden") and die('403.14 - Access denied.'));

abstract class CoreModel {
  public abstract function getKey();
}