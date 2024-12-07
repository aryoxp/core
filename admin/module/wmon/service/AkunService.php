<?php

class AkunService extends CoreService {
  public function search($keyword, $page, $perpage=100, $sort) {
    $offset = ($page-1) * $perpage;
    $db = self::instance('wismon');
    $qb = QB::instance('akun')
      ->select()
      ->where('kode', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('nama', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('kategori', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('keterangan', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->limit($offset, $perpage);
    $akun = $db->query($qb->get());
    $qb = QB::instance('akun')
      ->select(QB::raw('COUNT(*)'))
      ->where('kode', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('nama', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('kategori', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('keterangan', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR);
    $result = new stdClass;
    $result->akun = $akun;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function insert($kode, $nama, $kategori, $keterangan) {
    $insert['kode'] = QB::esc($kode);
    $insert['nama'] = QB::esc($nama);
    $insert['kategori'] = QB::esc($kategori);
    $insert['keterangan'] = QB::esc($keterangan);
    $db = self::instance('wismon');
    $qb = QB::instance('akun');
    $qb->insert($insert);
    $akun = $db->query($qb->get());
    return $akun;
  }
  public function delete($kode) {
    $db = self::instance('wismon');
    $qb = QB::instance('akun');
    $qb->delete()
      ->where('kode', QB::esc($kode));
    $akun = $db->query($qb->get());
    return $akun;
  }
  public function get($kode) {
    $db = self::instance('wismon');
    $qb = QB::instance('akun');
    $qb->select()
      ->where('kode', QB::esc($kode));
    $akun = $db->getRow($qb->get());
    return $akun;
  }
  public function update($id, $kode, $nama, $kategori, $keterangan) {
    $update['kode'] = QB::esc($kode);
    $update['nama'] = QB::esc($nama);
    $update['kategori'] = QB::esc($kategori);
    $update['keterangan'] = QB::esc($keterangan);
    $db = self::instance('wismon');
    $qb = QB::instance('akun');
    $qb->update($update)
      ->where('kode', $id);
    $akun = $db->query($qb->get());
    return $akun;
  }
  public function getAkunDebit($kodeJenisTransaksi) {
    $db = self::instance('wismon');
    $qb = QB::instance('akundebit ad');
    $qb->select()
      ->leftJoin('akun a', 'a.kode', 'ad.kodeakun')
      ->where('kodejenistransaksi', QB::esc($kodeJenisTransaksi));
    $akun = $db->query($qb->get());
    return $akun;
  }
  public function getAkunKredit($kodeJenisTransaksi) {
    $db = self::instance('wismon');
    $qb = QB::instance('akunkredit ak');
    $qb->select()
      ->leftJoin('akun a', 'a.kode', 'ak.kodeakun')
      ->where('kodejenistransaksi', QB::esc($kodeJenisTransaksi));
    $akun = $db->query($qb->get());
    return $akun;
  }
  public function getAkunKategori($kategori) {
    $db = self::instance('wismon');
    $qb = QB::instance('akun');
    $qb->select()
      ->where('kategori', QB::esc($kategori));
    $akun = $db->query($qb->get());
    return $akun;
  }
  public function removeAkunDebitJenisTransaksi($kodeJenisTransaksi, $kodeAkun) {
    $db = self::instance('wismon');
    $qb = QB::instance('akundebit');
    $qb->delete()
      ->where('kodejenistransaksi', QB::esc($kodeJenisTransaksi))
      ->where('kodeakun', QB::esc($kodeAkun));
    $akun = $db->query($qb->get());
    return $akun;  
  }
  public function removeAkunKreditJenisTransaksi($kodeJenisTransaksi, $kodeAkun) {
    $db = self::instance('wismon');
    $qb = QB::instance('akunkredit');
    $qb->delete()
      ->where('kodejenistransaksi', QB::esc($kodeJenisTransaksi))
      ->where('kodeakun', QB::esc($kodeAkun));
    $akun = $db->query($qb->get());
    return $akun;  
  }
  public function addAkunDebitJenisTransaksi($kodeJenisTransaksi, $kodeAkun) {
    $insert['kodejenistransaksi'] = QB::esc($kodeJenisTransaksi);
    $insert['kodeakun'] = QB::esc($kodeAkun);
    $db = self::instance('wismon');
    $qb = QB::instance('akundebit');
    $qb->insert($insert);
    $akun = $db->query($qb->get());
    return $akun;
  }
  public function addAkunKreditJenisTransaksi($kodeJenisTransaksi, $kodeAkun) {
    $insert['kodejenistransaksi'] = QB::esc($kodeJenisTransaksi);
    $insert['kodeakun'] = QB::esc($kodeAkun);
    $db = self::instance('wismon');
    $qb = QB::instance('akunkredit');
    $qb->insert($insert);
    $akun = $db->query($qb->get());
    return $akun;
  }
}