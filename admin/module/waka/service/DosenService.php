<?php

class DosenService extends CoreService {

  public function getDosenList() {
    $db = self::instance('wisaka');
    $qb = QB::instance('dosen d')
      ->select()
      ->leftJoin('wis.pegawai p', 'p.nip', 'd.nip')
      ->orderBy('p.nama');
    $result = $db->query($qb->get());
    return $result; 
  }

}