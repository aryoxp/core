<div class="container mb-5">

  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-cash-coin mx-2 text-primary"></i> Pembayaran Mahasiswa</h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <form id="form-search">
        <div class="input-group mb-3">
          <input type="text" name="keyword" class="form-control w-50 input-keyword" placeholder="Masukkan Nama, NIM, atau NRM"
            aria-label="Keyword">
          <button class="btn btn-secondary bt-search"><i class="bi bi-search"></i></button>
          <div class="invalid-feedback">Gunakan keyword dengan panjang minimal 3 karakter.</div>
        </div>
      </form>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <div id="list-mahasiswa"></div>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <div id="selected-mahasiswa" class="px-4 border border-primary rounded bg-primary-subtle d-flex justify-content-between align-items-center">
      </div>
    </div>
  </div>
  
  <form method="post" class="row m-5" id="riwayat-pembayaran" target="_blank" 
    action="<?php echo $this->location('m/x/wmon/print/kuitansipembayaranmahasiswa'); ?>">
    <input type="hidden" name="nrm">
    <div class="col">
      <h1 class="fs-4 fw-lighter my-3 text-secondary">Riwayat Pembayaran</h1>
      <hr>
      <div id="transaksi-list" class="mb-3 rounded-2 border border-1" style="max-height: 200px; overflow-y:auto">&nbsp;</div>
      <div class="p-3 border rounded-2 bg-light text-end container-action-transaksi">
        <span class="btn btn-sm btn-success text-light bt-refresh"><i class="bi bi-arrow-repeat me-2"></i>
          Refresh</span>
        <span class="btn btn-sm btn-primary bt-print-kuitansi">
          <i class="bi bi-printer me-2"></i> Cetak Kuitansi Pembayaran
        </span>
      </div>
    </div>
  </form>

  <div class="row m-5" id="rekapitulasi-pembayaran">
    <div class="col">
      <div>
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Rekapitulasi Pembayaran</h1>
        <hr>
        <div id="rekap-list" class="mb-3 rounded-2 border border-1" style="max-height: 200px; overflow-y:auto">&nbsp;</div>
        <div class="p-3 border rounded-2 bg-light text-end container-action-transaksi">
          <span class="btn btn-sm btn-success text-light bt-refresh"><i class="bi bi-arrow-repeat me-2"></i>
            Refresh</span>
        </div>
      </div>
    </div>
  </div>

  <form id="form-pembayaran" class="needs-validation" novalidate>
    <div class="row m-5">
      <div class="col">
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Form Entri Pembayaran</h1>
        <hr>
        <div class="form-group row">
          <label for="input-kakunkredit" class="col-4 col-form-label text-primary">Akun Kredit</label>
          <div class="col-8">
            <select id="input-kakunkredit" name="input-kakunkredit" type="text" class="form-select"
              required="required"></select>
            <span id="input-tanggalHelpBlock" class="form-text text-muted my-2 d-block">Akun kredit jenis pembayaran
              yang dibayarkan oleh mahasiswa.</span>
            <div class="invalid-feedback">Akun kredit harus dipilih.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-kakundebit" class="col-4 col-form-label text-primary">Akun Debit</label>
          <div class="col-8">
            <select id="input-kakundebit" name="input-kakundebit" type="text" class="form-select"
              required="required"></select>
            <span id="input-tanggalHelpBlock" class="form-text text-muted my-2 d-block">Akun kas di mana dana yang
              dibayarkan diterima.</span>
            <div class="invalid-feedback">Akun debit harus dipilih.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-keterangan" class="col-4 col-form-label text-primary">Catatan/Keterangan</label>
          <div class="col-8">
            <textarea id="input-keterangan" style="height:70px;" name="input-keterangan" type="number"
              class="form-control"></textarea>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-nominal" class="col-4 col-form-label text-primary">Nominal Pembayaran</label>
          <div class="col-8">
            <input id="input-nominal" name="input-nominal" type="number" class="form-control" required="required">
            <div id="input-terbilang" class="text-danger my-2 mx-2"></div>
            <div class="invalid-feedback">Harus diisi dengan angka nominal.</div>
          </div>
        </div>
        <div class="p-3 border rounded-2 bg-light text-end container-action-transaksi">
          <span class="btn btn-sm btn-secondary bt-print-kuitansi" style="display:none"><i class="bi bi-printer"></i>
            Cetak Bukti Pembayaran</span>
          <button class="btn btn-sm btn-primary bt-bayar">
            <i class="bi bi-cash-coin me-2"></i> Bayar
          </button>
        </div>
      </div>
    </div>
  </form>

</div>