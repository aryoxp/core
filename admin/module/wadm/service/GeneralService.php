<?php

class GeneralService extends CoreService {
  public function listAgama() {
    $db = self::instance('wis');
    $qb = QB::instance('agama')
      ->select();
    $result = $db->query($qb->get());
    return $result;
  }
  public function listPropinsi() {
    $db = self::instance('wis');
    $qb = QB::instance('propinsi')
      ->select();
    $result = $db->query($qb->get());
    return $result;
  }
  public function listKotaKabupaten($propinsi_id) {
    $db = self::instance('wis');
    $qb = QB::instance('kota_kabupaten')
      ->select()
      ->where('propinsi_id', QB::esc($propinsi_id));
    $result = $db->query($qb->get());
    return $result;
  }
}