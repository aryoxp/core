<div class="container mb-5">

  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-cash-coin mx-2 text-primary"></i> Pengeluaran Rumah Tangga</h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <form id="form-search-pengeluaran">
        <div class="input-group mb-3">
          <select name="year" class="form-select flex-shrink-1 input-perpage input-year-pengeluaran"></select>
          <select name="month" class="form-select flex-shrink-1 input-perpage input-month-pengeluaran">
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
          <select name="perpage" class="form-select flex-shrink-1 input-perpage-pengeluaran">
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="10" selected="">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
          <button class="btn btn-secondary bt-search"><i class="bi bi-search"></i></button>
        </div>
      </form>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <div id="list-transaksi">
      </div>
      <span class="pagination-transaksi my-4"></span>
    </div>
  </div>

  <form id="form-pembayaran" class="needs-validation" novalidate>
    <div class="row m-5">
      <div class="col">
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Form Entri Pengeluaran Rumah Tangga</h1>
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
          <label for="input-nominal" class="col-4 col-form-label text-primary">Nominal Pengeluaran</label>
          <div class="col-8">
            <input id="input-nominal" name="input-nominal" type="number" class="form-control" required="required">
            <div id="input-terbilang" class="text-danger my-2 mx-2"></div>
            <div class="invalid-feedback">Harus diisi dengan angka nominal.</div>
          </div>
        </div>
        <div class="form-group row mb-4 border rounded bg-primary-subtle border-primary">
          <label for="input-kakundebit" class="col-4 col-form-label text-primary">Program Studi</label>
          <div class="col-8 p-3">
            <select id="input-prodi" name="input-kakundebit" type="text" class="form-select">
              <option value="">Umum/Non-Program Studi</option>
              <option value="D3">D3 Kebidanan</option>
              <option value="D3F">D3 Farmasi</option>
              <option value="MIK">D4 Manajemen Informasi Kesehatan</option>
              <option value="FIS">D4 Fisioterapi</option>
            </select>
            <span id="input-tanggalHelpBlock" class="form-text text-primary my-2 d-block">Pilih program studi hanya jika transaksi yang dicatat relevan dengan salah satu program studi. Jika tidak, pilih <strong class="text-primary">[Umum/Non-Program Studi]</strong></span>
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