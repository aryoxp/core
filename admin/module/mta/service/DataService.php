<?php

class DataService extends CoreService {
  public function getPoints($limit = 100) {
    $db = self::instance('mta');
    $qb = QB::instance('point')
      ->select()
      ->limit($limit);
    return ($db->query($qb->get()));
  }

  public function dump() {
    $db = self::instance('mta');
    $qb = QB::instance('line')
      ->select('idline', 'name', 'direction', 'linecolor AS color');
    $lines = $db->query($qb->get());
    foreach($lines as $line) {
      $qb = QB::instance('linepoint lp')
        ->select('lp.idline', 'lp.idpoint', 'lp.sequence', 'lp.stop', 'lp.idinterchange', 'p.lat', 'p.lng')
        ->leftJoin('point p', 'lp.idpoint', 'p.idpoint')
        ->where('idline', $line->idline);
      $linepoints = $db->query($qb->get());
      $line->path = $linepoints;
    }
    $qb = QB::instance('interchange')
      ->select();
    $interchanges = $db->query($qb->get());
    foreach($interchanges as $ic) {
      $qb = QB::instance('linepoint')
        ->select()
        ->where('idinterchange', $ic->idinterchange);
      $points = $db->query($qb->get());
      $ic->points = $points;
    }
    $data = new stdClass;
    $data->lines = $lines;
    $data->interchanges = $interchanges;
    return $data;
  }
}