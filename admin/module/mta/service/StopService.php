<?php

class StopService extends CoreService {

  public function setStop($id, $isStop = true) {
    $update['stop'] = $isStop ? '1' : '0';
    if (!$isStop) $update['idinterchange'] = null;

    $db = self::instance('mta');
    $qb = QB::instance('linepoint l')
      ->update($update)
      ->where('idpoint', QB::esc($id));
    return $db->query($qb->get());
  }

}