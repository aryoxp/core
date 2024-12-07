<?php

class WadmPrintController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function kuitansipendaftaranmahasiswa($nrm, $no) {
    $this->ui->useStyle('css/print.css');
    $service = new TransaksiService();
    $transaksi = $service->getTransaksi($no);
    $service = new MahasiswaService();
    $mahasiswa = $service->getMahasiswa($nrm);
    $this->ui->useScript('js/kuitansi-pendaftaran-mahasiswa.js');
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->view('print-kuitansi-pendaftaran-mahasiswa.php', 
      ['transaksi' => $transaksi, 'mahasiswa' => $mahasiswa]
    );
  }

}