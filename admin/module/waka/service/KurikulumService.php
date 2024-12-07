<?php

class KurikulumService extends CoreService {

  public function getAllKurikulum() {
    $db = self::instance('wisaka');
    $qb = QB::instance('kurikulum')
      ->select()
      ->orderBy('tahun', QB::DESC);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function search($keyword, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wisaka');
    $qb = QB::instance('kurikulum')
      ->select()
      ->where('tahun', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->limit($offset, $perpage);
      // echo $qb->get();
    $kurikulum = $db->query($qb->get());
    $qb = QB::instance('kurikulum')
      ->select(QB::raw('COUNT(*)'))
      ->where('tahun', 'LIKE', QB::esc('%'.$keyword.'%'));
    $result = new stdClass;
    $result->kurikulum = $kurikulum;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function insert($tahun) {
    $db = self::instance('wisaka');
    $insert['tahun'] = QB::esc($tahun);
    $qb = QB::instance('kurikulum')
      ->insert($insert);
    $result = $db->query($qb->get());
    if($result) $result = $this->getKurikulum($insert['tahun']);
    return $result;
  }
  public function getKurikulum($tahun) {
    $db = self::instance('wisaka');
    $qb = QB::instance('kurikulum')
      ->select()
      ->where('tahun', QB::esc($tahun));
    $result = $db->getRow($qb->get());
    return $result; 
  }
  public function deleteKurikulum($tahun) {
    $db = self::instance('wisaka');
    $qb = QB::instance('kurikulum')
      ->delete()
      ->where('tahun', QB::esc($tahun));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function updateKurikulum($id, $tahun) {
    $update['tahun'] = QB::esc($tahun);
    $db = self::instance('wisaka');
    $qb = QB::instance('kurikulum')
      ->update($update)
      ->where('tahun', QB::esc($id));
    $result = $db->query($qb->get());
    return $result;
  }

}
