<?php

class PegawaiService extends CoreService {
  public function search($keyword, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wis');
    $qb = QB::instance('pegawai p')
      ->select()
      ->select(QB::raw('(SELECT COUNT(*) FROM wisaka.dosen d WHERE d.nip = p.nip) AS isdosen'))
      ->where('nama', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->orderBy('nama')
      ->limit($offset, $perpage);
    $pegawai = $db->query($qb->get());
    $qb = QB::instance('pegawai')
      ->select(QB::raw('COUNT(*)'))
      ->where('nama', 'LIKE', QB::esc('%'.$keyword.'%'));
    $result = new stdClass;
    $result->pegawai = $pegawai;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function register($prodi, $group, $gelombang, 
    $status, $nama, $tp_lahir, $tg_lahir, $alamat) {
    $db = self::instance('wis');
    $sql = "SELECT IF(MAX(SUBSTR(nip,9,3)) IS NOT NULL, MAX(SUBSTR(nip,9,3))+1,1) 
      FROM pegawai WHERE SUBSTR(nip,1,8) = '".QB::esc($group)."'";
    $nip = $db->getVar($sql);
    $insert['tgdaftar'] = QB::raw('NOW()');
    $insert['prodi'] = QB::esc($prodi);
    $insert['nip'] = QB::esc($group) . str_pad($nip, 3, '0', STR_PAD_LEFT);
    $insert['gelombang'] = QB::esc($gelombang);
    $insert['status'] = QB::esc($status);
    $insert['nama'] = QB::esc($nama);
    $insert['tp_lahir'] = QB::esc($tp_lahir);
    $insert['tg_lahir'] = QB::esc($tg_lahir);
    $insert['alamat'] = QB::esc($alamat);
    $qb = QB::instance('pegawai')
      ->insert($insert);
    $result = $db->query($qb->get());
    if($result) $result = $this->getPegawai($insert['nip']);
    return $result;
  }
  public function getPegawai($nip) {
    $db = self::instance('wis');
    $qb = QB::instance('pegawai')
      ->select()
      ->where('nip', QB::esc($nip));
    $result = $db->getRow($qb->get());
    return $result; 
  }
  public function deletePegawai($nip) {
    $db = self::instance('wis');
    $qb = QB::instance('pegawai')
      ->delete()
      ->where('nip', QB::esc($nip));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function updateIdentitasDiri($nip, $nama, $j_kelamin, $tp_lahir, 
  $tg_lahir, $kdagama, $status, $alamat, $telp1, $telp2, $jabatan, $nidn) {
    $update['nama'] = QB::esc($nama);
    $update['j_kelamin'] = QB::esc($j_kelamin);
    $update['tp_lahir'] = QB::esc($tp_lahir);
    $update['tg_lahir'] = QB::esc($tg_lahir);
    $update['kdagama'] = QB::esc($kdagama);
    $update['status'] = QB::esc($status);
    $update['alamat'] = QB::esc($alamat);
    $update['telp1'] = QB::esc($telp1);
    $update['telp2'] = QB::esc($telp2);
    $update['jabatan'] = QB::esc($jabatan);
    $update['nidn'] = QB::esc($nidn);
    $db = self::instance('wis');
    $qb = QB::instance('pegawai')
      ->update($update)
      ->where('nip', QB::esc($nip));
    $result = $db->query($qb->get());
    return $result;
  }
  public function setDosen($nip) {
    $db = self::instance('wisaka');
    $qb = QB::instance('dosen')
      ->insert(['nip' => QB::esc($nip)]);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function unsetDosen($nip) {
    $db = self::instance('wisaka');
    $qb = QB::instance('dosen')
      ->delete()
      ->where('nip', QB::esc($nip));
    $result = $db->query($qb->get());
    return $result; 
  }
}