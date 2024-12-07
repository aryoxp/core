<?php

class MahasiswaService extends CoreService {

  public function getTahunAngkatanList($prodi) {
    $db = self::instance('wis');
    $qb = QB::instance('mahasiswa')
      ->select(QB::raw("SUBSTR(nrm, 1, 4) AS angkatan"))
      ->distinct()
      ->where('prodi', QB::esc($prodi));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function setNim($nrm, $nim) {
    $update['nim'] = empty($nim) ? null : QB::esc($nim);
    $db = self::instance('wis');
    $qb = QB::instance('mahasiswa')
      ->update($update)
      ->where('nrm', QB::esc($nrm));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function setPA($nrm, $nip) {
    $insert['nip'] = empty($nip) ? null : QB::esc($nip);
    $insert['nrm'] = QB::esc($nrm);
    $update['nip'] = empty($nip) ? null : QB::esc($nip);
    $db = self::instance('wisaka');
    $qb = QB::instance('pa')
      ->insert($insert)
      ->update($update);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function unsetPA($nrm) {
    $db = self::instance('wisaka');
    $qb = QB::instance('pa')
      ->delete()
      ->where('nrm', QB::esc($nrm));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function setPAMulti($nrms, $nip) {
    $db = self::instance('wisaka');
    $qb = QB::instance('pa');
    foreach($nrms as $nrm) {
      $insert['nip'] = empty($nip) ? null : QB::esc($nip);
      $insert['nrm'] = QB::esc($nrm);
      $update['nip'] = empty($nip) ? null : QB::esc($nip);
      $qb->reset();
      $qb = QB::instance('pa')
        ->insert($insert)
        ->update($update);
      $result = $db->query($qb->get());
    }
    return $result; 
  }
  public function getMahasiswa($nrm) {
    $db = self::instance('wis');
    $qb = QB::instance('mahasiswa')
      ->select()
      ->where('nrm', QB::esc($nrm));
    $result = $db->getRow($qb->get());
    return $result; 
  }
  public function getMahasiswaWithPA($nrm) {
    $db = self::instance('wisaka');
    $qb = QB::instance('wis.mahasiswa m')
      ->select()
      ->select('m.nrm')
      ->select('p.nama AS namapa')
      ->leftJoin('pa', 'pa.nrm', 'm.nrm')
      ->leftJoin('wis.pegawai p', 'p.nip', 'pa.nip')
      ->where('m.nrm', QB::esc($nrm));
    $result = $db->getRow($qb->get());
    return $result; 
  }
  public function search($keyword, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wis');
    $qb = QB::instance('mahasiswa m')
      ->select()
      ->select('m.nrm')
      ->select(QB::raw('(SELECT SUM(mk.sks) 
        FROM wisaka.krsmatakuliah km 
        LEFT JOIN wisaka.matakuliah mk ON mk.kdmk = km.kdmk AND mk.kurikulum = km.kurikulum
        WHERE km.nrm = m.nrm AND km.status = 1 AND km.bobotnilai > 1) AS jsks'))
      ->select(QB::raw('(SELECT SUM(km.bobotnilai * mk.sks) 
        FROM wisaka.krsmatakuliah km
        LEFT JOIN wisaka.matakuliah mk ON mk.kdmk = km.kdmk AND mk.kurikulum = km.kurikulum
        WHERE km.nrm = m.nrm AND km.status = 1 AND km.bobotnilai > 1) AS snxk'))
      ->select(QB::raw('ROUND((SELECT SUM(km.bobotnilai * mk.sks) 
        FROM wisaka.krsmatakuliah km
        LEFT JOIN wisaka.matakuliah mk ON mk.kdmk = km.kdmk AND mk.kurikulum = km.kurikulum
        WHERE km.nrm = m.nrm AND km.status = 1 AND km.bobotnilai > 1) / 
        (SELECT SUM(mk.sks) 
        FROM wisaka.krsmatakuliah km 
        LEFT JOIN wisaka.matakuliah mk ON mk.kdmk = km.kdmk AND mk.kurikulum = km.kurikulum
        WHERE km.nrm = m.nrm AND km.status = 1 AND km.bobotnilai > 1),3) AS ipk'))
      ->leftJoin('wisaka.akademik wa', 'wa.nrm', 'm.nrm')
      ->where(QB::OG)
      ->where('m.nim', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('m.nrm', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('m.namam', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where(QB::EG)
      ->where('m.nim', 'IS NOT', QB::raw('NULL'))
      ->where(QB::raw('TRIM(m.nim)'), '<>', QB::raw('\'\''))
      ->orderBy(QB::raw('SUBSTRING(m.nrm, 1, 4)'), QB::DESC)
      ->limit($offset, $perpage);
    // echo $qb->get();
    $mahasiswa = $db->query($qb->get());
    $qb = QB::instance('mahasiswa')
      ->select(QB::raw('COUNT(*)'))
      ->where('nim', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('nrm', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('namam', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR);
    $result = new stdClass;
    $result->mahasiswa = $mahasiswa;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  // public function register($prodi, $group, $gelombang, 
  //   $status, $nama, $tplahir, $tglahir, $nikpaspor) {
  //   $db = self::instance('wis');
  //   $sql = "SELECT IF(MAX(SUBSTR(nrm,9,3)) IS NOT NULL, MAX(SUBSTR(nrm,9,3))+1,1) 
  //     FROM mahasiswa WHERE SUBSTR(nrm,1,8) = '".QB::esc($group)."'";
  //   $nrm = $db->getVar($sql);
  //   $insert['tgdaftar'] = QB::raw('NOW()');
  //   $insert['prodi'] = QB::esc($prodi);
  //   $insert['nrm'] = QB::esc($group) . str_pad($nrm, 3, '0', STR_PAD_LEFT);
  //   $insert['gelombang'] = QB::esc($gelombang);
  //   $insert['status'] = QB::esc($status);
  //   $insert['namam'] = QB::esc($nama);
  //   $insert['tplahir'] = QB::esc($tplahir);
  //   $insert['tglahir'] = QB::esc($tglahir);
  //   $insert['nikpaspor'] = QB::esc($nikpaspor);
  //   $qb = QB::instance('mahasiswa')
  //     ->insert($insert);
  //   $result = $db->query($qb->get());
  //   if($result) $result = $this->getMahasiswa($insert['nrm']);
  //   return $result;
  // }

  // public function deleteMahasiswa($nrm) {
  //   $db = self::instance('wis');
  //   $qb = QB::instance('mahasiswa')
  //     ->delete()
  //     ->where('nrm', QB::esc($nrm));
  //   $result = $db->query($qb->get());
  //   return $result; 
  // }
  // public function updateProgram($nrm, $prodi, $gelombang, $status) {
  //   $update['prodi'] = QB::esc($prodi);
  //   $update['gelombang'] = QB::esc($gelombang);
  //   $update['status'] = QB::esc($status);
  //   $db = self::instance('wis');
  //   $qb = QB::instance('mahasiswa')
  //     ->update($update)
  //     ->where('nrm', QB::esc($nrm));
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
  // public function updateIdentitasDiri($nrm, $nama, $tplahir, 
  //   $tglahir, $goldarah, $kdagama, $statnikah, $nikpaspor, $telp) {
  //   $update['namam'] = QB::esc($nama);
  //   $update['tplahir'] = QB::esc($tplahir);
  //   $update['tglahir'] = QB::esc($tglahir);
  //   $update['goldarah'] = QB::esc($goldarah);
  //   $update['kdagama'] = QB::esc($kdagama);
  //   $update['statnikah'] = QB::esc($statnikah);
  //   $update['nikpaspor'] = QB::esc($nikpaspor);
  //   $update['telp'] = QB::esc($telp);
  //   $db = self::instance('wis');
  //   $qb = QB::instance('mahasiswa')
  //     ->update($update)
  //     ->where('nrm', QB::esc($nrm));
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
  // public function updateAlamat($nrm, $alamatasal, 
  //   $propasal, $kotaasal, $alamat, $prop, $kota) {
  //   $update['alamatasal'] = QB::esc($alamatasal);
  //   $update['propasal'] = empty($propasal) ? null : QB::esc($propasal);
  //   $update['kotaasal'] = empty($kotaasal) ? null : QB::esc($kotaasal);
  //   $update['alamat'] = QB::esc($alamat);
  //   $update['prop'] = QB::esc($prop);
  //   $update['kota'] = QB::esc($kota);
  //   $db = self::instance('wis');
  //   $qb = QB::instance('mahasiswa')
  //     ->update($update)
  //     ->where('nrm', QB::esc($nrm));
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
  // public function updateSekolahAsal($nrm, $propsekolah, 
  //   $kotasekolah, $asalsekolah, $jurusan, $thlulus) {
  //   $update['propsekolah'] = empty($propsekolah) ? null : QB::esc($propsekolah);
  //   $update['kotasekolah'] = empty($kotasekolah) ? null : QB::esc($kotasekolah);
  //   $update['asalsekolah'] = empty($asalsekolah) ? null : QB::esc($asalsekolah);
  //   $update['jurusan'] = empty($jurusan) ? null : QB::esc($jurusan);
  //   $update['thlulus'] = empty($thlulus) ? null : QB::esc($thlulus);
  //   $db = self::instance('wis');
  //   $qb = QB::instance('mahasiswa')
  //     ->update($update)
  //     ->where('nrm', QB::esc($nrm));
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
  // public function updateOrtu($nrm, $namaortu, 
  //   $pekerjaanortu, $telportu, $alamatortu) {
  //   $update['namaortu'] = empty($namaortu) ? null : QB::esc($namaortu);
  //   $update['pekerjaanortu'] = empty($pekerjaanortu) ? null : QB::esc($pekerjaanortu);
  //   $update['telportu'] = empty($telportu) ? null : QB::esc($telportu);
  //   $update['alamatortu'] = empty($alamatortu) ? null : QB::esc($alamatortu);
  //   $db = self::instance('wis');
  //   $qb = QB::instance('mahasiswa')
  //     ->update($update)
  //     ->where('nrm', QB::esc($nrm));
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
}