<?php

class Admin {
  public static function title() {
    $config = Core::lib(Core::CONFIG)->load('config.ini');
    return $config['title'] ?? 'Core Framework';
  }
}