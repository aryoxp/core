<?php

class LaporanService extends CoreService {

  public function getLaporanPembayaranMahasiswa($tanggal, $page, $perpage, $order = 'ASC') {
    $result = new stdClass;
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('t_pembayaranmahasiswa tpm');
    $qb->select('t.no', 'm.nim', 'm.namam', 'm.prodi')
      ->select('ad.kode as kodekas', 'ak.nama as pembayaran')
      ->select('t.nominal')
      ->leftJoin('wis.mahasiswa m', 'm.nrm', 'tpm.nrm')
      ->leftJoin('transaksi t', 't.no', 'tpm.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where('t.tanggal', QB::esc($tanggal))
      ->orderBy(QB::raw('SUBSTR(tpm.nrm, 1, 4)'))
      ->orderBy('t.kodeakunkredit')
      ->limit($offset, $perpage);
    $result->transaksi = $db->query($qb->get());
    $qb = QB::instance('t_pembayaranmahasiswa tpm')
      ->select(QB::raw('COUNT(*)'))
      ->leftJoin('wis.mahasiswa m', 'm.nrm', 'tpm.nrm')
      ->leftJoin('transaksi t', 't.no', 'tpm.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where('t.tanggal', QB::esc($tanggal));
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function getLaporanPengeluaranKerumahtanggaan($tanggal, $page, $perpage, $order = 'ASC') {
    $result = new stdClass;
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('t_kerumahtanggaan tkrt');
    $qb->select('t.no', 't.tanggal', 't.keterangan')
      ->select('ad.nama as pengeluaran', 'ak.nama as kas')
      ->select('ad.kode as kakundebit', 'ak.kode as kakunkredit')
      ->select('t.nominal', 'tkrt.prodi')
      ->leftJoin('transaksi t', 't.no', 'tkrt.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where('t.tanggal', QB::esc($tanggal))
      ->orderBy('t.kodeakunkredit')
      ->orderBy('t.tanggal')
      ->orderBy('t.jam')
      ->limit($offset, $perpage);
    $result->transaksi = $db->query($qb->get());
    $qb = QB::instance('t_kerumahtanggaan tkrt')
      ->select(QB::raw('COUNT(*)'))
      ->leftJoin('transaksi t', 't.no', 'tkrt.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where('t.tanggal', QB::esc($tanggal));
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function getLaporanPengeluaranAkademi($tanggal, $page, $perpage, $order = 'ASC') {
    $result = new stdClass;
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('t_pengeluarankasbesar tpkb');
    $qb->select('t.no', 't.tanggal', 't.keterangan')
      ->select('ad.nama as pengeluaran', 'ak.nama as kas')
      ->select('t.nominal', 'tpkb.prodi')
      ->leftJoin('transaksi t', 't.no', 'tpkb.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where('t.tanggal', QB::esc($tanggal))
      ->orderBy('t.kodeakunkredit')
      ->orderBy('t.tanggal')
      ->orderBy('t.jam')
      ->limit($offset, $perpage);
    $result->transaksi = $db->query($qb->get());
    $qb = QB::instance('t_pengeluarankasbesar tpkb')
      ->select(QB::raw('COUNT(*)'))
      ->leftJoin('transaksi t', 't.no', 'tpkb.no')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where('t.tanggal', QB::esc($tanggal));
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function getJurnalKasKecil($bulan, $tahun, $col = null, $order = 'ASC') {
    $result = new stdClass;
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi t');
    $qb->select()
      ->select('t.keterangan')
      ->select('ad.nama as akundebit', 'ak.nama as akunkredit')
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($bulan))
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($tahun))
      ->where(QB::OG)
      ->where('t.kodeakundebit', '102')
      ->where('t.kodeakunkredit', '=', '102', QB::OR)
      ->where(QB::EG);
    if ($col)
      $qb->orderBy($col, $order);
    $result->transaksi = $db->query($qb->get());
    $qb->reset();
    $qb = QB::instance('transaksi t')
      ->select(QB::raw('COUNT(*)'))
      ->leftJoin('akun ad', 'ad.kode', 't.kodeakundebit')
      ->leftJoin('akun ak', 'ak.kode', 't.kodeakunkredit')
      ->where(QB::raw('MONTH(t.tanggal)'), QB::esc($bulan))
      ->where(QB::raw('YEAR(t.tanggal)'), QB::esc($tahun))
      ->where(QB::OG)
      ->where('t.kodeakundebit', '102')
      ->where('t.kodeakunkredit', '=', '102', QB::OR)
      ->where(QB::EG);
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function bukubesar($kode, $tgmulai, $tgsampai) {
    $result = new stdClass;
    $db = self::instance('wismon');
    $qb = QB::instance('bukubesar');
    $qb->select()
      ->where('tanggal', 'BETWEEN', QB::raw("'". QB::esc($tgmulai) . "' AND '" . QB::esc($tgsampai) . "'"))
      ->where('kode', QB::esc($kode))
      ->orderBy('tanggal')
      ->orderBy('jam');
    $result = $db->query($qb->get());
    foreach($result as $row) {
      $row->saldo = $row->debit - $row->kredit;
    }
    return $result;
  }
  public function ikhtisarkas($tahun) {
    $db = self::instance('wismon');
    $sql = "SELECT kode, bulan, debit, kredit, (debit-kredit) AS total FROM
    (	
      SELECT debit.kode, debit.bulan, debit, kredit FROM
      (
      SELECT kodeakundebit AS kode, MONTH(d.tanggal) AS bulan, SUM(d.nominal) AS debit
      FROM (
        SELECT tanggal, jam, kodeakundebit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakundebit LIKE '1%'
      ) d
      GROUP BY MONTH(tanggal), kodeakundebit
      ) debit
      LEFT OUTER JOIN 
      (
      SELECT kodeakunkredit AS kode, MONTH(k.tanggal) AS bulan, SUM(k.nominal) AS kredit
      FROM (
        SELECT tanggal, jam, kodeakunkredit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakunkredit LIKE '1%'
      ) k
      GROUP BY MONTH(tanggal), kodeakunkredit
      ) kredit 
      ON debit.kode = kredit.kode AND debit.bulan = kredit.bulan
      
      UNION
      
      SELECT kredit.kode, kredit.bulan, debit, kredit FROM
      (
      SELECT kodeakundebit AS kode, MONTH(d.tanggal) AS bulan, SUM(d.nominal) AS debit
      FROM (
        SELECT tanggal, jam, kodeakundebit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakundebit LIKE '1%'
      ) d
      GROUP BY MONTH(tanggal), kodeakundebit
      ) debit 
      RIGHT OUTER JOIN 
      (
      SELECT kodeakunkredit AS kode, MONTH(k.tanggal) AS bulan, SUM(k.nominal) AS kredit
      FROM (
        SELECT tanggal, jam, kodeakunkredit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakunkredit LIKE '1%'
      ) k
      GROUP BY MONTH(tanggal), kodeakunkredit
      ) kredit ON debit.kode = kredit.kode AND debit.bulan = kredit.bulan
    ) u
    ";
    $result = $db->query($sql);
    return $result;
  }
  public function ikhtisarpendapatan($tahun) {
    $db = self::instance('wismon');
    $sql = "SELECT kode, bulan, debit, kredit, (debit-kredit) AS total FROM
    (	
      SELECT debit.kode, debit.bulan, debit, kredit FROM
      (
      SELECT kodeakundebit AS kode, MONTH(d.tanggal) AS bulan, SUM(d.nominal) AS debit
      FROM (
        SELECT tanggal, jam, kodeakundebit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakundebit LIKE '4%'
      ) d
      GROUP BY MONTH(tanggal), kodeakundebit
      ) debit
      LEFT OUTER JOIN 
      (
      SELECT kodeakunkredit AS kode, MONTH(k.tanggal) AS bulan, SUM(k.nominal) AS kredit
      FROM (
        SELECT tanggal, jam, kodeakunkredit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakunkredit LIKE '4%'
      ) k
      GROUP BY MONTH(tanggal), kodeakunkredit
      ) kredit 
      ON debit.kode = kredit.kode AND debit.bulan = kredit.bulan
      
      UNION
      
      SELECT kredit.kode, kredit.bulan, debit, kredit FROM
      (
      SELECT kodeakundebit AS kode, MONTH(d.tanggal) AS bulan, SUM(d.nominal) AS debit
      FROM (
        SELECT tanggal, jam, kodeakundebit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakundebit LIKE '4%'
      ) d
      GROUP BY MONTH(tanggal), kodeakundebit
      ) debit 
      RIGHT OUTER JOIN 
      (
      SELECT kodeakunkredit AS kode, MONTH(k.tanggal) AS bulan, SUM(k.nominal) AS kredit
      FROM (
        SELECT tanggal, jam, kodeakunkredit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakunkredit LIKE '4%'
      ) k
      GROUP BY MONTH(tanggal), kodeakunkredit
      ) kredit ON debit.kode = kredit.kode AND debit.bulan = kredit.bulan
    ) u
    ";
    $result = $db->query($sql);
    return $result;
  }
  public function ikhtisarbiaya($tahun) {
    $db = self::instance('wismon');
    $sql = "SELECT kode, bulan, debit, kredit, (debit-kredit) AS total FROM
    (	
      SELECT debit.kode, debit.bulan, debit, kredit FROM
      (
      SELECT kodeakundebit AS kode, MONTH(d.tanggal) AS bulan, SUM(d.nominal) AS debit
      FROM (
        SELECT tanggal, jam, kodeakundebit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakundebit LIKE '5%'
      ) d
      GROUP BY MONTH(tanggal), kodeakundebit
      ) debit
      LEFT OUTER JOIN 
      (
      SELECT kodeakunkredit AS kode, MONTH(k.tanggal) AS bulan, SUM(k.nominal) AS kredit
      FROM (
        SELECT tanggal, jam, kodeakunkredit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakunkredit LIKE '5%'
      ) k
      GROUP BY MONTH(tanggal), kodeakunkredit
      ) kredit 
      ON debit.kode = kredit.kode AND debit.bulan = kredit.bulan
      
      UNION
      
      SELECT kredit.kode, kredit.bulan, debit, kredit FROM
      (
      SELECT kodeakundebit AS kode, MONTH(d.tanggal) AS bulan, SUM(d.nominal) AS debit
      FROM (
        SELECT tanggal, jam, kodeakundebit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakundebit LIKE '5%'
      ) d
      GROUP BY MONTH(tanggal), kodeakundebit
      ) debit 
      RIGHT OUTER JOIN 
      (
      SELECT kodeakunkredit AS kode, MONTH(k.tanggal) AS bulan, SUM(k.nominal) AS kredit
      FROM (
        SELECT tanggal, jam, kodeakunkredit, nominal
        FROM transaksi
        WHERE
        YEAR(tanggal) = '".QB::esc($tahun)."' 
        AND kodeakunkredit LIKE '5%'
      ) k
      GROUP BY MONTH(tanggal), kodeakunkredit
      ) kredit ON debit.kode = kredit.kode AND debit.bulan = kredit.bulan
    ) u
    ";
    $result = $db->query($sql);
    return $result;
  }
  
}