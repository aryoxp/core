<?php

class InterchangeService extends CoreService {

  public function addPoint($id, $idInterchange) {
    $db = self::instance('mta');
    $qb = QB::instance('linepoint l')
      ->update('idinterchange', QB::esc($idInterchange))
      ->where('idpoint', QB::esc($id));
    return $db->query($qb->get());
  }

  public function removePoint($id, $idInterchange) {
    $db = self::instance('mta');
    $qb = QB::instance('linepoint l')
      ->update('idinterchange', null)
      ->where('idpoint', QB::esc($id));
    return $db->query($qb->get());
  }

  public function create($idpoint) {
    $db = self::instance('mta');
    $qb = QB::instance('interchange')
      ->insert(['name' => null]);
    $db->query($qb->get());
    $idInterchange = $db->getInsertId();
    $qb = QB::instance('linepoint l')
      ->update('idinterchange', QB::esc($idInterchange))
      ->where('idpoint', QB::esc($idpoint));
    $db->query($qb->get());
    return $idInterchange;
  }

  public function deleteInterchange($idInterchange) {
    $db = self::instance('mta');
    $qb = QB::instance('linepoint l')
      ->update('idinterchange', null)
      ->where('idinterchange', $idInterchange);
    $db->query($qb->get());
    $qb = QB::instance('interchange i')
      ->delete()
      ->where('idinterchange', $idInterchange);
    return $db->query($qb->get());
  }

  public function getNearbyLineIds($lat, $lng, $distance) {
    $diff = $distance * 0.00000898311;    
    $db = self::instance('mta');
    $qb = QB::instance('linepoint l')
      ->select('l.idline')
      ->leftJoin('point p', 'p.idpoint', 'l.idpoint')
      ->distinct()
      ->where(QB::raw("SQRT(POWER(p.lat - $lat, 2) + POWER(p.lng - $lng, 2)) < $diff"))
      ->where('l.stop', 1);
    return $db->query($qb->get());
  } 

}