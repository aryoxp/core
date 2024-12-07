<?php

class TransaksiService extends CoreService {
  
  public function getTransaksi($no) {
    $db = self::instance('wismon');
    $qb = QB::instance('transaksi');
    $qb->select()
      ->where('no', QB::esc($no));
    $transaksi = $db->getRow($qb->get());
    return $transaksi;
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

}