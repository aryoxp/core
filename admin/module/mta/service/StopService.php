<?php

class StopService extends CoreService {

  public function setStop($id, $isStop = true) {
    $db = self::instance('mta');
    $qb = QB::instance('linepoint l')
      ->update('stop', $isStop ? '1' : '0');
    if (!$isStop) $qb->update('idinterchange', null);
    $qb->where('idpoint', QB::esc($id));
    return $db->query($qb->get());
  }

}