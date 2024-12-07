<?php

class AkademikService extends CoreService {

  public function getTahunPenawaranList() {
    $db = self::instance('wisaka');
    $qb = QB::instance('penawaran')
      ->select('tahun')
      ->distinct()
      ->orderBy('tahun', QB::DESC);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function getMatakuliahDitawarkan($prodi, $tahun, $semester, $page = 1, $perpage = 10, $order = 'ASC') {
    $offset = ($page - 1) * $perpage;
    $db = self::instance('wisaka');
    $qb = QB::instance('penawaran p')
      ->leftJoin('matakuliah mk', 'mk.kdmk', 'p.kdmk')
      ->select('mk.kurikulum', 'mk.kdmk','mk.namamk','mk.sks')
      ->where('p.prodi', QB::esc($prodi))
      ->where('p.tahun', QB::esc($tahun))
      ->where('p.semester', QB::esc($semester))
      ->orderBy('mk.kurikulum', QB::DESC)
      ->orderBy('mk.prodi')
      ->orderBy('mk.kdmk')
      ->limit($offset, $perpage);
    $result = new stdClass;
    $result->matakuliah = $db->query($qb->get());
    $qb->reset();
    $qb = QB::instance('penawaran p')
    ->leftJoin('matakuliah mk', 'mk.kdmk', 'p.kdmk')
    ->select(QB::raw('COUNT(*) AS count'))
    ->where('p.prodi', QB::esc($prodi))
    ->where('p.tahun', QB::esc($tahun))
    ->where('p.semester', QB::esc($semester));
    $result->count = $db->getVar($qb->get());
    return $result; 
  }
  public function getMatakuliahTidakDitawarkan($kurikulum, $prodi, $tahun, $semester, $page = 1, $perpage = 10, $order = 'ASC') {
    $offset = ($page - 1) * $perpage;
    $sql = "SELECT * FROM `matakuliah`
      WHERE `prodi` = '".QB::esc($prodi)."' 
      AND `kurikulum` = '".QB::esc($kurikulum)."'
      AND (`kdmk`, `kurikulum`) NOT IN (
        SELECT `kdmk`, `kurikulum` FROM penawaran 
        WHERE `tahun` = '".QB::esc($tahun)."' 
        AND `semester` = '".QB::esc($semester)."'
      )
      ORDER BY `kurikulum`, `kdmk`
      LIMIT ".QB::esc($offset).", ".QB::esc($perpage)."";
    // echo $sql;
    $db = self::instance('wisaka');
    $result = new stdClass;
    $result->matakuliah = $db->query($sql);
    $sql = "SELECT COUNT(*) FROM `matakuliah`
      WHERE `prodi` = '".QB::esc($prodi)."' 
      AND `kurikulum` = '".QB::esc($kurikulum)."'
      AND (`kdmk`, `kurikulum`) NOT IN (
        SELECT `kdmk`, `kurikulum` FROM penawaran 
        WHERE `tahun` = '".QB::esc($tahun)."' 
        AND `semester` = '".QB::esc($semester)."'
      )";
    $result->count = $db->getVar($sql);
    return $result; 
  }
  public function tawarkanMatakuliah($kdmk, $kurikulum, $prodi, $tahun, $semester) {
    $insert['kdmk'] = QB::esc($kdmk);
    $insert['kurikulum'] = QB::esc($kurikulum);
    $insert['prodi'] = QB::esc($prodi);
    $insert['tahun'] = QB::esc($tahun);
    $insert['semester'] = QB::esc($semester);
    $db = self::instance('wisaka');
    $qb = QB::instance('penawaran')
      ->insert($insert);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function turunkanPenawaranMatakuliah($kdmk, $kurikulum, $prodi, $tahun, $semester) {
    $db = self::instance('wisaka');
    $qb = QB::instance('penawaran')
      ->delete()
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum))
      ->where('prodi', QB::esc($prodi))
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function getDaftarKRSMahasiswa($nrm) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krs')
      ->select()
      ->where('nrm', QB::esc($nrm))
      ->orderBy('semesterke');
    $result = $db->query($qb->get());
    return $result; 
  }
  public function getListMatakuliahKRS($nrm, $semester, $semesterke) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah k')
      ->select('k.nrm', 'k.semester', 'k.semesterke', 'k.kdmk', 'k.kurikulum')
      ->select('m.namamk', 'm.sks')
      ->leftJoin('matakuliah m', ['m.kdmk' => 'k.kdmk', 'm.kurikulum' => 'k.kurikulum'])
      ->where('k.nrm', QB::esc($nrm))
      ->where('k.semester', QB::esc($semester))
      ->where('k.semesterke', QB::esc($semesterke))
      ->orderBy('k.semesterke');
    $result = $db->query($qb->get());
    return $result;
  }
  public function buatKRS($nrm, $semesterke, $semester, $tahun) {
    $insert['nrm'] = QB::esc($nrm);
    $insert['semesterke'] = QB::esc($semesterke);
    $insert['semester'] = QB::esc($semester);
    $insert['tahun'] = QB::esc($tahun);
    $db = self::instance('wisaka');
    $qb = QB::instance('krs')
      ->insert($insert);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function getKRS($nrm, $semesterke, $semester) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krs')
      ->select()
      ->where('nrm', QB::esc($nrm))
      ->where('semesterke', QB::esc($semesterke))
      ->where('semester', QB::esc($semester));
    $result = $db->getRow($qb->get());
    return $result; 
  }
  public function getKRSTahunAkademik($nrm, $tahun, $semester) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krs')
      ->select()
      ->where('nrm', QB::esc($nrm))
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester));
    $result = $db->getRow($qb->get());
    return $result; 
  }
  public function deleteKRS($nrm, $semesterke, $semester, $tahun) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krs')
      ->delete()
      ->where('nrm', QB::esc($nrm))
      ->where('semesterke', QB::esc($semesterke))
      ->where('semester', QB::esc($semester))
      ->where('tahun', QB::esc($tahun));
    $result = $db->query($qb->get());
    return $result; 
  }
  public function entriKRS($nrm, $tahun, $semester, $semesterke, $semesterkrs, $kdmk, $kurikulum) {
    $insert['nrm'] = QB::esc($nrm);
    $insert['tahun'] = QB::esc($tahun);
    $insert['semester'] = QB::esc($semester);
    $insert['semesterke'] = QB::esc($semesterke);
    $insert['semesterkrs'] = QB::esc($semesterkrs);
    $insert['kdmk'] = QB::esc($kdmk);
    $insert['kurikulum'] = QB::esc($kurikulum);
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah')
      ->insert($insert);
    $result = $db->query($qb->get());
    return $result; 
  }
  public function dropKRS($nrm, $tahun, $semester, $semesterke, $semesterkrs, $kdmk, $kurikulum) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah')
      ->delete()
      ->where('nrm', QB::esc($nrm))
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('semesterke', QB::esc($semesterke))
      ->where('semesterkrs', QB::esc($semesterkrs))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum));
    $result = $db->query($qb->get());
    return $result;
  }
  public function simpanNilaiMahasiswa($nrm, $tahun, $semester, $kdmk, $kurikulum, $nilai, $bobotnilai) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah')
      ->update([
        'nilai' => QB::esc($nilai),
        'bobotnilai' => QB::esc($bobotnilai) 
      ])
      ->where('nrm', QB::esc($nrm))
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getListMatakuliahKHS($nrm, $semester, $semesterke) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah k')
      ->select('k.nrm', 'k.semester', 'k.semesterke', 'k.kdmk', 'k.kurikulum')
      ->select('m.namamk', 'm.sks', 'k.nilai', 'k.bobotnilai')
      ->leftJoin('matakuliah m', ['m.kdmk' => 'k.kdmk', 'm.kurikulum' => 'k.kurikulum'])
      ->where('k.nrm', QB::esc($nrm))
      ->where('k.semester', QB::esc($semester))
      ->where('k.semesterke', QB::esc($semesterke))
      ->orderBy('k.semesterke');
    $result = $db->query($qb->get());
    return $result;
  }
  public function getListMatakuliahKHSTahunAkademik($nrm, $tahun, $semester) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah k')
      ->select('k.nrm', 'k.semester', 'k.semesterke', 'k.kdmk', 'k.kurikulum')
      ->select('m.namamk', 'm.sks', 'k.nilai', 'k.bobotnilai')
      ->leftJoin('matakuliah m', ['m.kdmk' => 'k.kdmk', 'm.kurikulum' => 'k.kurikulum'])
      ->where('k.nrm', QB::esc($nrm))
      ->where('k.tahun', QB::esc($tahun))
      ->where('k.semester', QB::esc($semester))
      ->orderBy('k.semesterke');
    $result = $db->query($qb->get());
    return $result;
  }
  public function getListMahasiswaMemprogram($prodi, $tahun, $semester) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krs k')
      ->select()
      ->leftJoin('wis.mahasiswa m', 'm.nrm', 'k.nrm')
      ->where('k.tahun', QB::esc($tahun))
      ->where('k.semester', QB::esc($semester))
      ->where('m.prodi', QB::esc($prodi))
      ->orderBy('m.namam');
    $result = $db->query($qb->get());
    return $result;
  }
  public function getTranskripNilai($nrm) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah km')
      ->select()
      ->leftJoin('matakuliah m', ['m.kdmk' => 'km.kdmk', 'm.kurikulum' => 'km.kurikulum'])
      ->where('km.nrm', QB::esc($nrm))
      ->orderBy('km.kdmk')
      ->orderBy('km.semesterke');
    $result = $db->query($qb->get());
    return $result;
  }
  public function setStatusMatakuliahKRS($nrm, $tahun, $semester, $kdmk, $kurikulum, $status) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah')
      ->update(['status' => $status])
      ->where('nrm', QB::esc($nrm))
      ->where('tahun', QB::esc($tahun))
      ->where('semester', QB::esc($semester))
      ->where('kdmk', QB::esc($kdmk))
      ->where('kurikulum', QB::esc($kurikulum));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getTranskripNilaiPrint($nrm) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah km')
      ->select()
      ->leftJoin('matakuliah m', ['m.kdmk' => 'km.kdmk', 'm.kurikulum' => 'km.kurikulum'])
      ->where('km.nrm', QB::esc($nrm))
      ->where('km.status', '1')
      ->orderBy('km.semesterke')
      ->orderBy('km.kdmk');
    $result = $db->query($qb->get());
    return $result;
  }
  public function getTranskripNilaiAkhirPrint($nrm) {
    $db = self::instance('wisaka');
    $qb = QB::instance('krsmatakuliah km')
      ->select()
      ->leftJoin('matakuliah m', ['m.kdmk' => 'km.kdmk', 'm.kurikulum' => 'km.kurikulum'])
      ->where('km.nrm', QB::esc($nrm))
      ->where('km.status', '1')
      ->orderBy('km.kdmk');
    $result = $db->query($qb->get());
    return $result;
  }
  public function getDataAkademikMahasiswa($nrm) {
    $db = self::instance('wisaka');
    $qb = QB::instance('wis.mahasiswa m')
      ->select()
      ->select('m.nrm')
      ->leftJoin('akademik a', 'a.nrm', 'm.nrm')
      ->where('m.nrm', QB::esc($nrm));
    $result = $db->getRow($qb->get());
    return $result;
  }
  public function saveDataAkademik($nrm, $field, $value) {
    switch($field) {
      case 'tglulus':
      case 'tgmasuk':
      case 'tgwisuda':
      case 'notranskrip':
      case 'pin':
      case 'judulta':
      case 'abstrakta':
        $insert['nrm'] = QB::esc($nrm);
        $insert[$field] = QB::esc($value);
        $update[$field] = QB::esc($value);
        $db = self::instance('wisaka');
        $qb = QB::instance('akademik')
          ->insert($insert)
          ->update($update);
        $result = $db->query($qb->get());
        return $result; 
        break;
      case 'nim':
      case 'namam':
      case 'tplahir':
      case 'tglahir':
      case 'status':
        $update[$field] = QB::esc($value);
        $db = self::instance('wis');
        $qb = QB::instance('mahasiswa')
          ->update($update)
          ->where('nrm', QB::esc($nrm));
        $result = $db->query($qb->get());
        return $result; 
        break;
    }
    return false;
  }
  public function clearDataAkademik($nrm, $field, $value = null) {
    switch($field) {
      case 'tglulus':
      case 'tgmasuk':
      case 'tgwisuda':
      case 'notranskrip':
      case 'pin':
      case 'judulta':
      case 'abstrakta':
        $update[$field] = $value;
        $db = self::instance('wisaka');
        $qb = QB::instance('akademik')
          ->update($update)
          ->where('nrm', QB::esc($nrm));
        $result = $db->query($qb->get());
        return $result; 
        break;
      case 'nim':
      case 'namam':
      case 'tplahir':
      case 'tglahir':
      case 'status':
        $update[$field] = $value;
        $db = self::instance('wis');
        $qb = QB::instance('mahasiswa')
          ->update($update)
          ->where('nrm', QB::esc($nrm));
        $result = $db->query($qb->get());
        return $result; 
        break;
    }
    return false;
  }
  public function getListTanggalWisuda() {
    $db = self::instance('wisaka');
    $qb = QB::instance('wisuda')
      ->select()
      ->orderBy('tanggal', QB::DESC);
    $result = $db->query($qb->get());
    $tanggals = [];
    foreach($result as $t) $tanggals[] = $t->tanggal;
    return $tanggals;
  }
  public function createTanggalWisuda($tanggal) {
    $db = self::instance('wisaka');
    $qb = QB::instance('wisuda')
      ->insert(['tanggal' => QB::esc($tanggal)])
      ->ignore();
    $result = $db->query($qb->get());
    return $result;
  }
  public function deleteTanggalWisuda($tanggal) {
    $db = self::instance('wisaka');
    $qb = QB::instance('wisuda')
      ->delete()
      ->where('tanggal', QB::esc($tanggal));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getMahasiswaWisuda($tgwisuda) {
    $db = self::instance('wisaka');
    $qb = QB::instance('akademik a')
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
      ->leftJoin('wis.mahasiswa m', 'm.nrm', 'a.nrm')
      ->where('a.tgwisuda', QB::esc($tgwisuda))
      ->orderBy('prodi')
      ->orderBy('namam')
      ->orderBy('notranskrip')
      ->orderBy(QB::raw('SUBSTRING(m.nrm, 1, 4)'), QB::DESC);
    // echo $qb->get();
    $result = $db->query($qb->get());
    return $result;
  }
  public function getMahasiswaLulusBelumWisuda() {
    $db = self::instance('wisaka');
    $qb = QB::instance('akademik a')
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
      ->leftJoin('wis.mahasiswa m', 'm.nrm', 'a.nrm')
      ->where('a.tgwisuda', QB::IS, QB::raw('NULL'))
      ->where('a.tglulus', QB::IS, QB::raw('NOT NULL'))
      ->orderBy('prodi')
      ->orderBy('notranskrip')
      ->orderBy('namam')
      ->orderBy(QB::raw('SUBSTRING(m.nrm, 1, 4)'), QB::DESC);
    // echo $qb->get();
    $result = $db->query($qb->get());
    return $result;
  }
  public function daftarWisuda($tanggal, $nrms) {
    $db = self::instance('wisaka');
    $qb = QB::instance('akademik')
      ->update(['tgwisuda' => QB::esc($tanggal)])
      ->where('nrm', QB::IN, QB::raw('(\''.implode("','", $nrms).'\')'));
    $result = $db->query($qb->get());
    return $result;
  }
  public function batalWisuda($nrms) {
    $db = self::instance('wisaka');
    $qb = QB::instance('akademik')
      ->update(['tgwisuda' => QB::raw('NULL')])
      ->where('nrm', QB::IN, QB::raw('(\''.implode("','", $nrms).'\')'));
    $result = $db->query($qb->get());
    return $result;
  }

}