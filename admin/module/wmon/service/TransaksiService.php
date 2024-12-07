<?php

class TransaksiService extends CoreService {
  public function searchJenisTransaksi($keyword, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('jenistransaksi')
      ->select()
      ->where('kode', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('nama', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('keterangan', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('kakundebit', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('kakunkredit', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->limit($offset, $perpage);
    $jenistransaksi = $db->query($qb->get());
    $qb = QB::instance('jenistransaksi')
      ->select(QB::raw('COUNT(*)'))
      ->where('kode', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('nama', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('keterangan', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('kakundebit', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('kakunkredit', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR);
    $result = new stdClass;
    $result->jenistransaksi = $jenistransaksi;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function insertJenisTransaksi($kode, $nama, $kakundebit, $kakunkredit, $keterangan) {
    $insert['kode'] = QB::esc($kode);
    $insert['nama'] = QB::esc($nama);
    $insert['kakundebit'] = QB::esc($kakundebit);
    $insert['kakunkredit'] = QB::esc($kakunkredit);
    $insert['keterangan'] = QB::esc($keterangan);
    $db = self::instance('wismon');
    $qb = QB::instance('jenistransaksi');
    $qb->insert($insert);
    $jenistransaksi = $db->query($qb->get());
    return $jenistransaksi;
  }
  public function deleteJenisTransaksi($kode) {
    $db = self::instance('wismon');
    $qb = QB::instance('jenistransaksi');
    $qb->delete()
      ->where('kode', QB::esc($kode));
    $jenistransaksi = $db->query($qb->get());
    return $jenistransaksi;
  }
  public function getJenisTransaksi($kode) {
    $db = self::instance('wismon');
    $qb = QB::instance('jenistransaksi');
    $qb->select()
      ->where('kode', QB::esc($kode));
    $jenistransaksi = $db->getRow($qb->get());
    return $jenistransaksi;
  }
  public function updateJenisTransaksi($id, $kode, $nama, $kakundebit, $kakunkredit, $keterangan) {
    $update['kode'] = QB::esc($kode);
    $update['nama'] = QB::esc($nama);
    $update['kakundebit'] = QB::esc($kakundebit);
    $update['kakunkredit'] = QB::esc($kakunkredit);
    $update['keterangan'] = QB::esc($keterangan);
    $db = self::instance('wismon');
    $qb = QB::instance('jenistransaksi');
    $qb->update($update)
      ->where('kode', $id);
    $jenistransaksi = $db->query($qb->get());
    return $jenistransaksi;
  }
  public function getYearList() {
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->select(QB::raw('YEAR(tanggal) AS tahun'))
      ->distinct()
      ->orderBy(QB::raw('YEAR(tanggal)'), QB::DESC);
    $jenistransaksi = $db->query($qb->get());
    return $jenistransaksi;
  }
  public function searchMutasiPenerimaanKas($year, $month, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('t_penerimaankas tpk')
      ->select()
      ->leftJoin('transaksi t', 't.no', 'tpk.no')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month))
      ->limit($offset, $perpage);
    $transaksi = $db->query($qb->get());
    $qb = QB::instance('t_penerimaankas tpk')
      ->select(QB::raw('COUNT(*)'))
      ->leftJoin('transaksi t', 't.no', 'tpk.no')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month));
    $result = new stdClass;
    $result->transaksi = $transaksi;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function insertMutasiPenerimaanKas($tanggal, $jam, 
    $kodeJenisTransaksi, $kodeAkunDebit, $kodeAkunKredit, 
    $nominal, $keterangan, $username) {
    $insert['tanggal'] = QB::esc($tanggal);
    $insert['jam'] = QB::esc($jam);
    $insert['kodejenistransaksi'] = QB::esc($kodeJenisTransaksi);
    $insert['kodeakundebit'] = QB::esc($kodeAkunDebit);
    $insert['kodeakunkredit'] = QB::esc($kodeAkunKredit);
    $insert['nominal'] = QB::esc($nominal);
    $insert['keterangan'] = QB::esc($keterangan);
    $insert['username'] = QB::esc($username);
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->insert($insert);
    $result = $db->query($qb->get());
    $no = $db->getInsertId();
    $insert = array();
    $insert['no'] = $no;
    $qb->reset();
    $qb = QB::instance('t_penerimaankas');
    $qb->insert($insert);
    $result = $db->query($qb->get());
    return $result;
  }
  public function deleteMutasiPenerimaanKas($no) {
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->delete()
      ->where('no', QB::esc($no));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getMutasiPenerimaanKas($no) {
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->select()
      ->where('no', QB::esc($no));
    $transaksi = $db->getRow($qb->get());
    return $transaksi;
  }
  public function searchMutasiPengembalianKas($year, $month, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('t_pengembaliankas tpk')
      ->select()
      ->leftJoin('transaksi t', 't.no', 'tpk.no')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month))
      ->limit($offset, $perpage);
    $transaksi = $db->query($qb->get());
    $qb = QB::instance('t_pengembaliankas tpk')
      ->select(QB::raw('COUNT(*)'))
      ->leftJoin('transaksi t', 't.no', 'tpk.no')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month));
    $result = new stdClass;
    $result->transaksi = $transaksi;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function insertMutasiPengembalianKas($tanggal, $jam, 
    $kodeJenisTransaksi, $kodeAkunDebit, $kodeAkunKredit, 
    $nominal, $keterangan, $username) {
    $insert['tanggal'] = QB::esc($tanggal);
    $insert['jam'] = QB::esc($jam);
    $insert['kodejenistransaksi'] = QB::esc($kodeJenisTransaksi);
    $insert['kodeakundebit'] = QB::esc($kodeAkunDebit);
    $insert['kodeakunkredit'] = QB::esc($kodeAkunKredit);
    $insert['nominal'] = QB::esc($nominal);
    $insert['keterangan'] = QB::esc($keterangan);
    $insert['username'] = QB::esc($username);
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->insert($insert);
    $result = $db->query($qb->get());
    $no = $db->getInsertId();
    $insert = array();
    $insert['no'] = $no;
    $qb->reset();
    $qb = QB::instance('t_pengembaliankas');
    $qb->insert($insert);
    $result = $db->query($qb->get());
    return $result;
  }
  public function deleteMutasiPengembalianKas($no) {
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->delete()
      ->where('no', QB::esc($no));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getMutasiPengembalianKas($no) {
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->select()
      ->where('no', QB::esc($no));
    $transaksi = $db->getRow($qb->get());
    return $transaksi;
  }
  public function getSaldoAkun($tahun, $kodeAkun) {
    $sql = "SELECT (
              (SELECT IFNULL(SUM(nominal),0) AS debit 
                FROM transaksi t 
                WHERE YEAR(t.tanggal) = '$tahun' 
                  AND t.kodeakundebit = '$kodeAkun')
              -
              (SELECT IFNULL(SUM(nominal),0) AS kredit 
                FROM transaksi t 
                WHERE YEAR(t.tanggal) = '$tahun' 
                  AND t.kodeakunkredit = '$kodeAkun')
            ) AS Saldo ";
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $result = new stdClass;
    $result->saldo = $db->getVar($sql);
    $qb->reset();
    $qb = QB::instance('transaksi');
    $qb->select(QB::raw('COUNT(*)'))
      ->where('kodeakundebit', QB::esc($kodeAkun))
      ->where(QB::raw('YEAR(tanggal)'), QB::esc($tahun));
    $result->countpenerimaan = $db->getVar($qb->get());
    $qb->reset();
    $qb = QB::instance('transaksi');
    $qb->select(QB::raw('COUNT(*)'))
      ->where('kodeakunkredit', QB::esc($kodeAkun))
      ->where(QB::raw('YEAR(tanggal)'), QB::esc($tahun));
    $result->countpengeluaran = $db->getVar($qb->get());
    return $result;
  }
  public function getTransaksi($no) {
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->select()
      ->where('no', QB::esc($no));
    $transaksi = $db->getRow($qb->get());
    return $transaksi;
  }
  public function getAllTransaksiPembayaranMahasiswa($kodejenistransaksi, $nrm) {
    $db = self::instance('wismon');
    $table = null;
    switch ($kodejenistransaksi) {
      case 'TDFT': $table = 't_pembayaranmahasiswa tx'; break;
    }
    $qb = QB::instance($table);
    $qb->select()
      ->leftJoin('transaksi t', 't.no', 'tx.no')
      ->where('kodejenistransaksi', QB::esc($kodejenistransaksi))
      ->where('nrm', QB::esc($nrm));
    $transaksi = $db->getRow($qb->get());
    return $transaksi;
  }
  public function getCatatanPembayaranMahasiswa($nrm) {
    $sql = "SELECT t.no, DATE_FORMAT(t.tanggal,'%d/%m/%Y') AS 'tanggal', t.jam, 
      CONCAT('Rp ', FORMAT(t.nominal, 0)) AS 'nominal', 
      ad.kode AS kas, ak.nama AS pembayaran, t.keterangan, tpm.nrm
      FROM t_pembayaranmahasiswa tpm LEFT JOIN transaksi t ON tpm.no = t.no
      LEFT JOIN akun ad ON ad.kode = t.kodeakundebit
      LEFT JOIN akun ak ON ak.kode = t.kodeakunkredit
      WHERE tpm.nrm = '".QB::esc($nrm)."' ORDER BY t.tanggal DESC, t.no DESC";
    $db = self::instance('wismon');
    $result = $db->query($sql);
    return $result;
  }
  public function getRekapitulasiPembayaranMahasiswa($nrm) {
    $sql = "SELECT ak.kode, ak.nama AS 'pembayaran', CONCAT('Rp ', FORMAT(SUM(t.nominal), 0)) AS 'jumlah', 
      CONCAT('Rp ',FORMAT((SELECT beban FROM kewajiban k WHERE k.nrm = tpm.nrm AND k.kodeakun = ak.kode), 0)) AS kewajiban, 
      CONCAT('Rp ',FORMAT(((SELECT beban FROM kewajiban k WHERE k.nrm = tpm.nrm AND k.kodeakun = ak.kode)-SUM(t.NOMINAL)), 0)) AS sisa 
      FROM t_pembayaranmahasiswa tpm LEFT JOIN transaksi t ON tpm.no = t.no 
      LEFT JOIN akun ad ON ad.kode = t.kodeakundebit 
      LEFT JOIN akun ak ON ak.kode = t.kodeakunkredit 
      WHERE tpm.nrm = '".QB::esc($nrm)."' GROUP BY ak.kode ORDER BY ak.nama ASC";
    $db = self::instance('wismon');
    $result = $db->query($sql);
    return $result;
  }
  public function getSelectiveCatatanPembayaranMahasiswa($nos = []) {
    $trxs = [];
    foreach($nos as $no) {
      $trxs[] = QB::qt(QB::esc($no));
    }
    $sql = "SELECT t.no, DATE_FORMAT(t.tanggal,'%d/%m/%Y') AS 'tanggal', t.jam, 
      t.nominal, ad.kode AS 'kakundebit',
      ak.kode AS kakunkredit, ak.nama AS pembayaran, t.keterangan, tpm.nrm
      FROM t_pembayaranmahasiswa tpm LEFT JOIN transaksi t ON tpm.no = t.no
      LEFT JOIN akun ad ON ad.kode = t.kodeakundebit
      LEFT JOIN akun ak ON ak.kode = t.kodeakunkredit
      WHERE tpm.no IN (".implode(", ", $trxs).") ORDER BY t.tanggal DESC, t.no DESC";
    $db = self::instance('wismon');
    $result = $db->query($sql);
    return $result;
  }
  public function catatTransaksiPembayaranMahasiswa(
    $kodejenistransaksi, $nrm, $prodi, $kakundebit, $kakunkredit, $nominal, 
    $keterangan, $username) {
      $insert['tanggal'] = QB::raw('CURDATE()');
      $insert['jam'] = QB::raw('CURTIME()');
      $insert['kodejenistransaksi'] = QB::esc($kodejenistransaksi);
      $insert['kodeakundebit'] = QB::esc($kakundebit);
      $insert['kodeakunkredit'] = QB::esc($kakunkredit);
      $insert['nominal'] = QB::esc($nominal);
      $insert['keterangan'] = QB::esc($keterangan);
      $insert['username'] = QB::esc($username);
      $db = self::instance('wismon');
      $qb = QB::instance('transaksi');
      $qb->insert($insert);
      try {
        $db->begin();
        $result = $db->query($qb->get());
        $no = $db->getInsertId();
        $insert = array();
        $insert['no'] = $no;
        $insert['nrm'] = $nrm;
        $insert['prodi'] = $prodi;
        $qb->reset();
        $qb = QB::instance('t_pembayaranmahasiswa');
        $qb->insert($insert);
        $result = $db->query($qb->get());
        $result = $this->getTransaksi($no);
        $db->commit();
      } catch(Exception $ex) {
        $db->rollback();
      }
      return $result;
  }
  public function deleteTransaksi($no) {
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->delete()
      ->where('no', QB::esc($no));
    $result = $db->query($qb->get());
    return $result;
  }
  public function searchPengeluaran($year, $month, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('t_kerumahtanggaan tpk')
      ->select('t.no','t.tanggal','t.jam')
      ->select('ad.nama AS jenispengeluaran', 'ak.nama AS sumberdana')
      ->select('t.keterangan', 't.nominal', 'tpk.prodi')
      ->leftJoin('transaksi t', 't.no', 'tpk.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month))
      ->orderBy(QB::raw('t.tanggal'), QB::DESC)
      ->orderBy(QB::raw('t.jam'), QB::DESC)
      ->limit($offset, $perpage);
    $transaksi = $db->query($qb->get());
    $qb = QB::instance('t_kerumahtanggaan tpk')
      ->select(QB::raw('COUNT(*)'))
      ->leftJoin('transaksi t', 't.no', 'tpk.no')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month));
    $result = new stdClass;
    $result->transaksi = $transaksi;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function catatTransaksiPengeluaran(
    $kodejenistransaksi, $prodi, $kakundebit, $kakunkredit, $nominal, 
    $keterangan, $username) {
      $insert['tanggal'] = QB::raw('CURDATE()');
      $insert['jam'] = QB::raw('CURTIME()');
      $insert['kodejenistransaksi'] = QB::esc($kodejenistransaksi);
      $insert['kodeakundebit'] = QB::esc($kakundebit);
      $insert['kodeakunkredit'] = QB::esc($kakunkredit);
      $insert['nominal'] = QB::esc($nominal);
      $insert['keterangan'] = QB::esc($keterangan);
      $insert['username'] = QB::esc($username);
      $db = self::instance('wismon');
      $qb = QB::instance('transaksi');
      $qb->insert($insert);
      try {
        $db->begin();
        $result = $db->query($qb->get());
        $no = $db->getInsertId();
        $insert = array();
        $insert['no'] = $no;
        $insert['prodi'] = empty($prodi) ? null : $prodi;
        $qb->reset();
        $qb = QB::instance('t_kerumahtanggaan');
        $qb->insert($insert);
        $result = $db->query($qb->get());
        $result = $this->getTransaksi($no);
        $db->commit();
      } catch(Exception $ex) {
        $db->rollback();
      }
      return $result;
  }
  public function searchPengeluaranAkademi($year, $month, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('t_pengeluarankasbesar tpk')
      ->select('t.no','t.tanggal','t.jam')
      ->select('ad.nama AS jenispengeluaran', 'ak.nama AS sumberdana')
      ->select('t.keterangan', 't.nominal', 'tpk.prodi')
      ->leftJoin('transaksi t', 't.no', 'tpk.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month))
      ->orderBy(QB::raw('t.tanggal'), QB::DESC)
      ->orderBy(QB::raw('t.jam'), QB::DESC)
      ->limit($offset, $perpage);
    $transaksi = $db->query($qb->get());
    $qb = QB::instance('t_pengeluarankasbesar tpk')
      ->select(QB::raw('COUNT(*)'))
      ->leftJoin('transaksi t', 't.no', 'tpk.no')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month));
    $result = new stdClass;
    $result->transaksi = $transaksi;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function catatTransaksiPengeluaranAkademi(
    $kodejenistransaksi, $prodi, $kakundebit, $kakunkredit, $nominal, 
    $keterangan, $username) {
      $insert['tanggal'] = QB::raw('CURDATE()');
      $insert['jam'] = QB::raw('CURTIME()');
      $insert['kodejenistransaksi'] = QB::esc($kodejenistransaksi);
      $insert['kodeakundebit'] = QB::esc($kakundebit);
      $insert['kodeakunkredit'] = QB::esc($kakunkredit);
      $insert['nominal'] = QB::esc($nominal);
      $insert['keterangan'] = QB::esc($keterangan);
      $insert['username'] = QB::esc($username);
      $db = self::instance('wismon');
      $qb = QB::instance('transaksi');
      $qb->insert($insert);
      try {
        $db->begin();
        $result = $db->query($qb->get());
        $no = $db->getInsertId();
        $insert = array();
        $insert['no'] = $no;
        $insert['prodi'] = empty($prodi) ? null : $prodi;
        $qb->reset();
        $qb = QB::instance('t_pengeluarankasbesar');
        $qb->insert($insert);
        $result = $db->query($qb->get());
        $result = $this->getTransaksi($no);
        $db->commit();
      } catch(Exception $ex) {
        $db->rollback();
      }
      return $result;
  }
  public function searchTagihan($year, $month, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('t_tagihan tgh')
      ->select('t.no','t.tanggal','t.jam')
      ->select('ad.nama AS jenistagihan', 'ak.nama AS sumberdana')
      ->select('t.keterangan', 't.nominal')
      ->select(QB::raw('(SELECT SUM(tr.nominal) FROM t_pembayarantagihan tph LEFT JOIN transaksi tr ON tr.no = tph.no WHERE tph.notagihan = tgh.no) AS terbayar'))
      ->leftJoin('transaksi t', 't.no', 'tgh.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month))
      ->orderBy(QB::raw('t.tanggal'), QB::DESC)
      ->orderBy(QB::raw('t.jam'), QB::DESC)
      ->limit($offset, $perpage);
    $transaksi = $db->query($qb->get());
    $qb = QB::instance('t_tagihan tgh')
      ->select(QB::raw('COUNT(*)'))
      ->leftJoin('transaksi t', 't.no', 'tgh.no')
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($year))
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($month));
    $result = new stdClass;
    $result->transaksi = $transaksi;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function catatTagihan (
    $kodejenistransaksi, $kakundebit, $kakunkredit, $nominal, 
    $keterangan, $username) {
      $insert['tanggal'] = QB::raw('CURDATE()');
      $insert['jam'] = QB::raw('CURTIME()');
      $insert['kodejenistransaksi'] = QB::esc($kodejenistransaksi);
      $insert['kodeakundebit'] = QB::esc($kakundebit);
      $insert['kodeakunkredit'] = QB::esc($kakunkredit);
      $insert['nominal'] = QB::esc($nominal);
      $insert['keterangan'] = QB::esc($keterangan);
      $insert['username'] = QB::esc($username);
      $db = self::instance('wismon');
      $qb = QB::instance('transaksi');
      $qb->insert($insert);
      try {
        $db->begin();
        $result = $db->query($qb->get());
        $no = $db->getInsertId();
        $insert = array();
        $insert['no'] = $no;
        $qb->reset();
        $qb = QB::instance('t_tagihan');
        $qb->insert($insert);
        $result = $db->query($qb->get());
        $result = $this->getTransaksi($no);
        $db->commit();
      } catch(Exception $ex) {
        $db->rollback();
      }
      return $result;
  }
  public function getHutang($no) {
    $db = self::instance('wismon');
    $qb = QB::instance('t_tagihan tgh');
    $qb->select()
      ->select('t.keterangan')
      ->select('ad.nama AS jenistagihan', 'ak.nama AS hutang')
      ->leftJoin('transaksi t', 't.no', 'tgh.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where('t.no', QB::esc($no));
    $transaksi = $db->getRow($qb->get());
    return $transaksi;
  }
  public function bayarTagihan (
    $kodejenistransaksi, $kakundebit, $kakunkredit, $nominal, 
    $keterangan, $username, $notagihan) {
      $insert['tanggal'] = QB::raw('CURDATE()');
      $insert['jam'] = QB::raw('CURTIME()');
      $insert['kodejenistransaksi'] = QB::esc($kodejenistransaksi);
      $insert['kodeakundebit'] = QB::esc($kakundebit);
      $insert['kodeakunkredit'] = QB::esc($kakunkredit);
      $insert['nominal'] = QB::esc($nominal);
      $insert['keterangan'] = QB::esc($keterangan);
      $insert['username'] = QB::esc($username);
      $db = self::instance('wismon');
      $qb = QB::instance('transaksi');
      $qb->insert($insert);
      try {
        $db->begin();
        $result = $db->query($qb->get());
        $no = $db->getInsertId();
        $insert = array();
        $insert['no'] = $no;
        $insert['notagihan'] = $notagihan;
        $qb->reset();
        $qb = QB::instance('t_pembayarantagihan');
        $qb->insert($insert);
        $result = $db->query($qb->get());
        $result = $this->getTransaksi($no);
        $db->commit();
        return $result;
      } catch(Exception $ex) {
        $db->rollback();
      }
      return false;
  }
  public function getListPembayaranTagihan($no) {
    $db = self::instance('wismon');
    $qb = QB::instance('t_pembayarantagihan tpt');
    $qb->select()
      ->select('t.keterangan')
      ->select('ad.nama AS hutang', 'ak.nama AS sumberdana')
      ->leftJoin('transaksi t', 't.no', 'tpt.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where('tpt.notagihan', QB::esc($no));
    $transaksi = $db->query($qb->get());
    return $transaksi;
  }

}