<?php

class MahasiswaService extends CoreService {

  public function getMahasiswa($nrm) {
    $db = self::instance('wis');
    // var_dump($db);
    $qb = QB::instance('mahasiswa')
      ->select()
      ->where('nrm', QB::esc($nrm));
    $result = $db->getRow($qb->get());
    return $result; 
  }

}