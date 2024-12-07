<?php

class KelasService extends CoreService {

  public function getListKelas($tahun, $semester, $kdmk, $kurikulum) {
    $count = '(SELECT COUNT(*) FROM kelasmahasiswa km 
      WHERE km.tahun = k.tahun AND km.semester = k.semester 
        AND km.kdmk = k.kdmk AND km.kurikulum = k.kurikulum 
        AND km.nama = k.nama) AS jumlah';
    $db = self::instance('wisaka');
    $qb = QB::instance('kelas k')
      ->select()
      ->select(QB::raw($count))
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function buatKelas($tahun, $semester, $kdmk, $kurikulum, $nama) {
    $insert['tahun'] = QB::esc($tahun);
    $insert['semester'] = QB::esc($semester);
    $insert['kdmk'] = QB::esc($kdmk);
    $insert['kurikulum'] = QB::esc($kurikulum);
    $insert['nama'] = QB::esc($nama);
    $db = self::instance('wisaka');
    $qb = QB::instance('kelas')
      ->insert($insert);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function hapusKelas($tahun, $semester, $kdmk, $kurikulum, $nama) {
    $db = self::instance('wisaka');
    $qb = QB::instance('kelas')
      ->delete()
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum))
      ->where('nama', QB::esc($nama));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function getMahasiswaKelas($tahun, $semester, $kdmk, $kurikulum, $nama, $page = 1, $perpage = 10) {
    $offset = ($page-1)*$perpage;
    $db = self::instance('wisaka');
    $qb = QB::instance('kelasmahasiswa k')
      ->select()
      ->leftJoin('wis.mahasiswa m', 'm.nrm', 'k.nrm')
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum))
      ->where('nama', QB::esc($nama))
      ->limit($offset, $perpage);
    $result = new stdClass;
    $result->mahasiswa = $db->query($qb->get());
    $qb->reset();
    $qb = QB::instance('kelasmahasiswa k')
      ->select(QB::raw('COUNT(*) AS count'))
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum))
      ->where('nama', QB::esc($nama));
    $result->count = $db->getVar($qb->get());
    return $result; 
  }
  public function getPemrogram($tahun, $semester, $kdmk, $kurikulum, $page = 1, $perpage = 10) {
    $offset = ($page-1)*$perpage;
    $db = self::instance('wisaka');
    $qb = QB::instance('kelasmahasiswa')
      ->select('nrm')
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum));
    $subsql = $qb->get();
    $qb->reset();
    $qb = QB::instance('krsmatakuliah k')
      ->select()
      ->leftJoin('wis.mahasiswa m', 'm.nrm', 'k.nrm')
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum))
      ->where('m.nrm', QB::NOTIN, QB::raw('('.$subsql.')'))
      ->limit($offset, $perpage);
    $result = new stdClass;
    $result->mahasiswa = $db->query($qb->get());
    $qb->reset();
    $qb = QB::instance('krsmatakuliah')
      ->select(QB::raw('COUNT(*) AS count'))
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum))
      ->where('nrm', QB::NOTIN, QB::raw('('.$subsql.')'));
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function masukkanKelas($tahun, $semester, $kdmk, $kurikulum, $nama, $nrm) {
    $insert['tahun'] = QB::esc($tahun);
    $insert['semester'] = QB::esc($semester);
    $insert['kdmk'] = QB::esc($kdmk);
    $insert['kurikulum'] = QB::esc($kurikulum);
    $insert['nama'] = QB::esc($nama);
    $insert['nrm'] = QB::esc($nrm);
    $db = self::instance('wisaka');
    $qb = QB::instance('kelasmahasiswa')
      ->insert($insert);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function keluarkanKelas($tahun, $semester, $kdmk, $kurikulum, $nama, $nrm) {
    $db = self::instance('wisaka');
    $qb = QB::instance('kelasmahasiswa')
      ->delete()
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum))
      ->where('nama', QB::esc($nama))
      ->where('nrm', QB::esc($nrm));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function getNilaiKelas($tahun, $semester, $kdmk, $kurikulum, $nama) {
    $db = self::instance('wisaka');
    $qb = QB::instance('kelasmahasiswa km')
      ->select()
      ->select(QB::raw('(SELECT nilai FROM krsmatakuliah k WHERE k.nrm = km.nrm AND k.tahun = km.tahun AND k.semester = km.semester AND k.kdmk = km.kdmk AND k.kurikulum = km.kurikulum) AS nilai'))
      ->select(QB::raw('(SELECT bobotnilai FROM krsmatakuliah k WHERE k.nrm = km.nrm AND k.tahun = km.tahun AND k.semester = km.semester AND k.kdmk = km.kdmk AND k.kurikulum = km.kurikulum) AS bobotnilai'))
      ->leftJoin('wis.mahasiswa m', 'm.nrm', 'km.nrm')
      ->where('km.tahun', QB::esc($tahun))
      ->where('km.semester', QB::esc($semester))
      ->where('km.kdmk', QB::esc($kdmk))
      ->where('km.kurikulum', QB::esc($kurikulum))
      ->where('km.nama', QB::esc($nama))
      ->orderBy('m.nim')
      ->orderBy('m.nrm');
    $result = $db->query($qb->get());
    return $result; 
  }
  // public function getListMatakuliahKRS($nrm, $semester, $semesterke) {
  //   $db = self::instance('wisaka');
  //   $qb = QB::instance('krsmatakuliah k')
  //     ->select('k.nrm', 'k.semester', 'k.semesterke', 'k.kdmk', 'k.kurikulum')
  //     ->select('m.namamk', 'm.sks')
  //     ->leftJoin('matakuliah m', ['m.kdmk' => 'k.kdmk', 'm.kurikulum' => 'k.kurikulum'])
  //     ->where('k.nrm', QB::esc($nrm))
  //     ->where('k.semester', QB::esc($semester))
  //     ->where('k.semesterke', QB::esc($semesterke))
  //     ->orderBy('k.semesterke');
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
  // public function buatKRS($nrm, $semesterke, $semester, $tahun) {
  //   $insert['nrm'] = QB::esc($nrm);
  //   $insert['semesterke'] = QB::esc($semesterke);
  //   $insert['semester'] = QB::esc($semester);
  //   $insert['tahun'] = QB::esc($tahun);
  //   $db = self::instance('wisaka');
  //   $qb = QB::instance('krs')
  //     ->insert($insert);
  //   $result = $db->query($qb->get());
  //   return $result; 
  // }
  // public function getKRS($nrm, $semesterke, $semester) {
  //   $db = self::instance('wisaka');
  //   $qb = QB::instance('krs')
  //     ->select()
  //     ->where('nrm', QB::esc($nrm))
  //     ->where('semesterke', QB::esc($semesterke))
  //     ->where('semester', QB::esc($semester));
  //   $result = $db->getRow($qb->get());
  //   return $result; 
  // }
  // public function deleteKRS($nrm, $semesterke, $semester, $tahun) {
  //   $db = self::instance('wisaka');
  //   $qb = QB::instance('krs')
  //     ->delete()
  //     ->where('nrm', QB::esc($nrm))
  //     ->where('semesterke', QB::esc($semesterke))
  //     ->where('semester', QB::esc($semester))
  //     ->where('tahun', QB::esc($tahun));
  //   $result = $db->query($qb->get());
  //   return $result; 
  // }
  // public function entriKRS($nrm, $tahun, $semester, $semesterke, $semesterkrs, $kdmk, $kurikulum) {
  //   $insert['nrm'] = QB::esc($nrm);
  //   $insert['tahun'] = QB::esc($tahun);
  //   $insert['semester'] = QB::esc($semester);
  //   $insert['semesterke'] = QB::esc($semesterke);
  //   $insert['semesterkrs'] = QB::esc($semesterkrs);
  //   $insert['kdmk'] = QB::esc($kdmk);
  //   $insert['kurikulum'] = QB::esc($kurikulum);
  //   $db = self::instance('wisaka');
  //   $qb = QB::instance('krsmatakuliah')
  //     ->insert($insert);
  //   $result = $db->query($qb->get());
  //   return $result; 
  // }
  // public function dropKRS($nrm, $tahun, $semester, $semesterke, $semesterkrs, $kdmk, $kurikulum) {
  //   $db = self::instance('wisaka');
  //   $qb = QB::instance('krsmatakuliah')
  //     ->delete()
  //     ->where('nrm', QB::esc($nrm))
  //     ->where('tahun', QB::esc($tahun))
  //     ->where('semester', QB::esc($semester))
  //     ->where('semesterke', QB::esc($semesterke))
  //     ->where('semesterkrs', QB::esc($semesterkrs))
  //     ->where('kdmk', QB::esc($kdmk))
  //     ->where('kurikulum', QB::esc($kurikulum));
  //   $result = $db->query($qb->get());
  //   return $result;
  // }

}