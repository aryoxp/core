<?php

class WmonTransaksiApiController extends CoreApi {

  public function searchJenisTransaksi($page = 1, $perpage=100, $sort='asc') {
    try {
      $transaksiService = new TransaksiService();
      $keyword = $this->postv('keyword');
      $result = $transaksiService->searchJenisTransaksi($keyword, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getJenisTransaksi($kode) {
    try {
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getJenisTransaksi($kode);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function createJenisTransaksi() {
    try {
      $transaksiService = new TransaksiService();
      $kode = $this->postv('kode');
      $nama = $this->postv('nama');
      $kakundebit = $this->postv('kakundebit');
      $kakunkredit = $this->postv('kakunkredit');
      $keterangan = $this->postv('keterangan');
      $result = $transaksiService->insertJenisTransaksi($kode, $nama, $kakundebit, $kakunkredit, $keterangan);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteJenisTransaksi() {
    try {
      $transaksiService = new TransaksiService();
      $kode = $this->postv('kode');
      $result = $transaksiService->deleteJenisTransaksi($kode);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateJenisTransaksi() {
    try {
      $transaksiService = new TransaksiService();
      $id = $this->postv('id');
      $kode = $this->postv('kode');
      $nama = $this->postv('nama');
      $kakundebit = $this->postv('kakundebit');
      $kakunkredit = $this->postv('kakunkredit');
      $keterangan = $this->postv('keterangan');
      $result = $transaksiService->updateJenisTransaksi($id, $kode, $nama, $kakundebit, $kakunkredit, $keterangan);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAkunDebitJenisTransaksi($kodeJenisTransaksi) {
    try {
      $akunService = new AkunService();
      $result = $akunService->getAkunDebit($kodeJenisTransaksi);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAkunKreditJenisTransaksi($kodeJenisTransaksi) {
    try {
      $akunService = new AkunService();
      $result = $akunService->getAkunKredit($kodeJenisTransaksi);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function removeAkunDebitJenisTransaksi() {
    try {
      $kodeJenisTransaksi = $this->postv('kodejenistransaksi');
      $kodeAkun = $this->postv('kodeakun');
      $akunService = new AkunService();
      $result = $akunService->removeAkunDebitJenisTransaksi($kodeJenisTransaksi, $kodeAkun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function removeAkunKreditJenisTransaksi() {
    try {
      $kodeJenisTransaksi = $this->postv('kodejenistransaksi');
      $kodeAkun = $this->postv('kodeakun');
      $akunService = new AkunService();
      $result = $akunService->removeAkunKreditJenisTransaksi($kodeJenisTransaksi, $kodeAkun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function addAkunDebitJenisTransaksi() {
    try {
      $kodeJenisTransaksi = $this->postv('kodejenistransaksi');
      $kodeAkun = $this->postv('kodeakun');
      $akunService = new AkunService();
      $result = $akunService->addAkunDebitJenisTransaksi($kodeJenisTransaksi, $kodeAkun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function addAkunKreditJenisTransaksi() {
    try {
      $kodeJenisTransaksi = $this->postv('kodejenistransaksi');
      $kodeAkun = $this->postv('kodeakun');
      $akunService = new AkunService();
      $result = $akunService->addAkunKreditJenisTransaksi($kodeJenisTransaksi, $kodeAkun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getYearList() {
    try {
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getYearList();
      if (count($result) == 0) $result = [date("Y")];
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function searchMutasiPenerimaanKas($page = 1, $perpage=100, $sort='asc') {
    try {
      $transaksiService = new TransaksiService();
      $year = $this->postv('year');
      $month = $this->postv('month');
      $result = $transaksiService->searchMutasiPenerimaanKas($year, $month, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function insertMutasiPenerimaanKas() {
    try {
      $tanggal = $this->postv('tanggal');
      $jam = $this->postv('jam');
      $kodeJenisTransaksi = $this->postv('kodejenistransaksi');
      $kodeAkunDebit = $this->postv('kakundebit');
      $kodeAkunKredit = $this->postv('kakunkredit');
      $nominal = $this->postv('nominal');
      $keterangan = $this->postv('keterangan');
      $username = $this->postv('username');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->insertMutasiPenerimaanKas($tanggal, $jam, $kodeJenisTransaksi, $kodeAkunDebit, $kodeAkunKredit, $nominal, $keterangan, $username);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteMutasiPenerimaanKas() {
    try {
      $kodeJenisTransaksi = $this->postv('transaksi');
      $no = $this->postv('no');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->deleteMutasiPenerimaanKas($no);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getMutasiPenerimaanKas($no) {
    try {
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getMutasiPenerimaanKas($no);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function searchMutasiPengembalianKas($page = 1, $perpage=100, $sort='asc') {
    try {
      $transaksiService = new TransaksiService();
      $year = $this->postv('year');
      $month = $this->postv('month');
      $result = $transaksiService->searchMutasiPengembalianKas($year, $month, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function insertMutasiPengembalianKas() {
    try {
      $tanggal = $this->postv('tanggal');
      $jam = $this->postv('jam');
      $kodeJenisTransaksi = $this->postv('kodejenistransaksi');
      $kodeAkunDebit = $this->postv('kakundebit');
      $kodeAkunKredit = $this->postv('kakunkredit');
      $nominal = $this->postv('nominal');
      $keterangan = $this->postv('keterangan');
      $username = $this->postv('username');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->insertMutasiPengembalianKas($tanggal, $jam, $kodeJenisTransaksi, $kodeAkunDebit, $kodeAkunKredit, $nominal, $keterangan, $username);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteMutasiPengembalianKas() {
    try {
      $kodeJenisTransaksi = $this->postv('transaksi');
      $no = $this->postv('no');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->deleteMutasiPengembalianKas($no);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getMutasiPengembalianKas($no) {
    try {
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getMutasiPengembalianKas($no);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getSaldoAkun() {
    try {
      $tahun = $this->postv('tahun');
      $kodeAkun = $this->postv('kodeakun');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getSaldoAkun($tahun, $kodeAkun);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAllTransaksiPembayaranMahasiswa() {
    try {
      $kodejenistransaksi = $this->postv('kodejenistransaksi');
      $nrm = $this->postv('nrm');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getAllTransaksiPembayaranMahasiswa($kodejenistransaksi, $nrm);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function catatTransaksiPembayaranPendaftaranMahasiswa() {
    try {
      $kodejenistransaksi = $this->postv('kodejenistransaksi');
      $nrm = $this->postv('nrm');
      $prodi = $this->postv('prodi');
      $kakundebit = $this->postv('kakundebit');
      $kakunkredit = $this->postv('kakunkredit');
      $nominal = $this->postv('nominal');
      $keterangan = $this->postv('keterangan');
      $username = $this->postv('username');
      $transaksiService = new TransaksiService();
      $transaksi = $transaksiService->getAllTransaksiPembayaranMahasiswa($kodejenistransaksi, $nrm);
      if ($transaksi !== null)
        throw new Exception('Transaksi pembayaran biaya pendaftaran telah dicatat');
      $result = $transaksiService->catatTransaksiPembayaranMahasiswa(
        $kodejenistransaksi, $nrm, $prodi, $kakundebit, $kakunkredit, $nominal, 
        $keterangan, $username); 
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getCatatanPembayaranMahasiswa() {
    try {
      $nrm = $this->postv('nrm');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getCatatanPembayaranMahasiswa($nrm);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  } 
  public function getRekapitulasiPembayaranMahasiswa() {
    try {
      $nrm = $this->postv('nrm');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getRekapitulasiPembayaranMahasiswa($nrm);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  } 
  public function catatTransaksiPembayaranMahasiswa() {
    try {
      $kodejenistransaksi = $this->postv('kodejenistransaksi');
      $nrm = $this->postv('nrm');
      $prodi = $this->postv('prodi');
      $kakundebit = $this->postv('kakundebit');
      $kakunkredit = $this->postv('kakunkredit');
      $nominal = $this->postv('nominal');
      $keterangan = $this->postv('keterangan');
      $username = $this->postv('username');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->catatTransaksiPembayaranMahasiswa(
        $kodejenistransaksi, $nrm, $prodi, $kakundebit, $kakunkredit, $nominal, 
        $keterangan, $username); 
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteTransaksi() {
    try {
      $kodeJenisTransaksi = $this->postv('transaksi');
      $no = $this->postv('no');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->deleteTransaksi($no);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function searchPengeluaran($page = 1, $perpage=100, $sort='asc') {
    try {
      $transaksiService = new TransaksiService();
      $year = $this->postv('year');
      $month = $this->postv('month');
      $result = $transaksiService->searchPengeluaran($year, $month, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function catatTransaksiPengeluaran() {
    try {
      $kodejenistransaksi = $this->postv('kodejenistransaksi');
      $prodi = $this->postv('prodi');
      $kakundebit = $this->postv('kakundebit');
      $kakunkredit = $this->postv('kakunkredit');
      $nominal = $this->postv('nominal');
      $keterangan = $this->postv('keterangan');
      $username = $this->postv('username');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->catatTransaksiPengeluaran(
        $kodejenistransaksi, $prodi, $kakundebit, $kakunkredit, $nominal, 
        $keterangan, $username); 
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function searchPengeluaranAkademi($page = 1, $perpage=100, $sort='asc') {
    try {
      $transaksiService = new TransaksiService();
      $year = $this->postv('year');
      $month = $this->postv('month');
      $result = $transaksiService->searchPengeluaranAkademi($year, $month, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function catatTransaksiPengeluaranAkademi() {
    try {
      $kodejenistransaksi = $this->postv('kodejenistransaksi');
      $prodi = $this->postv('prodi');
      $kakundebit = $this->postv('kakundebit');
      $kakunkredit = $this->postv('kakunkredit');
      $nominal = $this->postv('nominal');
      $keterangan = $this->postv('keterangan');
      $username = $this->postv('username');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->catatTransaksiPengeluaranAkademi(
        $kodejenistransaksi, $prodi, $kakundebit, $kakunkredit, $nominal, 
        $keterangan, $username); 
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function searchTagihan($page = 1, $perpage=100, $sort='asc') {
    try {
      $transaksiService = new TransaksiService();
      $year = $this->postv('year');
      $month = $this->postv('month');
      $result = $transaksiService->searchTagihan($year, $month, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function catatTagihan() {
    try {
      $kodejenistransaksi = $this->postv('kodejenistransaksi');
      $kakundebit = $this->postv('kakundebit');
      $kakunkredit = $this->postv('kakunkredit');
      $nominal = $this->postv('nominal');
      $keterangan = $this->postv('keterangan');
      $username = $this->postv('username');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->catatTagihan(
        $kodejenistransaksi, $kakundebit, $kakunkredit, $nominal, 
        $keterangan, $username); 
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getHutang($no) {
    try {
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getHutang($no);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function bayarTagihan() {
    try {
      $kodejenistransaksi = $this->postv('kodejenistransaksi');
      $kakundebit = $this->postv('kakundebit');
      $kakunkredit = $this->postv('kakunkredit');
      $nominal = $this->postv('nominal');
      $keterangan = $this->postv('keterangan');
      $username = $this->postv('username');
      $notagihan = $this->postv('notagihan');
      $transaksiService = new TransaksiService();
      $result = $transaksiService->bayarTagihan(
        $kodejenistransaksi, $kakundebit, $kakunkredit, $nominal, 
        $keterangan, $username, $notagihan); 
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getListPembayaranTagihan($no) {
    try {
      $transaksiService = new TransaksiService();
      $result = $transaksiService->getListPembayaranTagihan($no);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
}