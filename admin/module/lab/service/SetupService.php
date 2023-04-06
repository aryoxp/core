<?php

class SetupService extends CoreService {

  public function check() {
    $db = self::instance('lab');
    $db->query("SELECT 1");
  }

}