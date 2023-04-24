<?php

class DataService extends CoreService {
  public function getPoints($limit = 100) {
    $db = self::instance('mta');
    $qb = QB::instance('point')
      ->select()
      ->limit($limit);
    return ($db->query($qb->get()));
  }
}