<?php

class MatakuliahService extends CoreService {

  public function getAllKurikulum() {
    $db = self::instance('wisaka');
    $qb = QB::instance('kurikulum')
      ->select()
      ->orderBy('tahun', QB::DESC);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function search($keyword, $prodi, $kurikulum, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wisaka');
    $qb = QB::instance('matakuliah')
      ->select()
      ->where(QB::OG)
      ->where('kdmk', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('namamk', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('mkname', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where(QB::EG)
      ->where(QB::OG, QB::AND)
      ->where('prodi', QB::esc($prodi))
      ->where('kurikulum', QB::esc($kurikulum))
      ->where(QB::EG)
      ->limit($offset, $perpage);
      // echo $qb->get();
    $matakuliah = $db->query($qb->get());
    $qb = QB::instance('matakuliah')
      ->select(QB::raw('COUNT(*)'))
      ->where(QB::OG)
      ->where('kdmk', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('namamk', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('mkname', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where(QB::EG)
      ->where(QB::OG, QB::AND)
      ->where('prodi', QB::esc($prodi))
      ->where('kurikulum', QB::esc($kurikulum))
      ->where(QB::EG);
    $result = new stdClass;
    $result->matakuliah = $matakuliah;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function insert($kdmk, $kurikulum, $prodi, $namamk, $mkname, $sks) {
    $db = self::instance('wisaka');
    $insert['kdmk'] = QB::esc($kdmk);
    $insert['kurikulum'] = QB::esc($kurikulum);
    $insert['prodi'] = QB::esc($prodi);
    $insert['namamk'] = QB::esc($namamk);
    $insert['mkname'] = QB::esc($mkname);
    $insert['sks'] = QB::esc($sks);
    $qb = QB::instance('matakuliah')
      ->insert($insert);
    $result = $db->query($qb->get());
    if($result) $result = $this->getMatakuliah($insert['kdmk']);
    return $result;
  }
  public function getMatakuliah($kdmk, $kurikulum) {
    $db = self::instance('wisaka');
    $qb = QB::instance('matakuliah')
      ->select()
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum));
    $result = $db->getRow($qb->get());
    return $result; 
  }
  public function deleteMatakuliah($kdmk, $kurikulum) {
    $db = self::instance('wisaka');
    $qb = QB::instance('matakuliah')
      ->delete()
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function updateMatakuliah($id, $kdmk, $kurikulum, $prodi, $namamk, $mkname, $sks) {
    $update['kdmk'] = QB::esc($kdmk);
    $update['kurikulum'] = QB::esc($kurikulum);
    $update['prodi'] = QB::esc($prodi);
    $update['namamk'] = QB::esc($namamk);
    $update['mkname'] = QB::esc($mkname);
    $update['sks'] = QB::esc($sks);
    $db = self::instance('wisaka');
    $qb = QB::instance('matakuliah')
      ->update($update)
      ->where('kdmk', QB::esc($id));
    $result = $db->query($qb->get());
    return $result;
  }

}
