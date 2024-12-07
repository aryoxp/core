<div class="container mb-5">

  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-currency-dollar mx-2 text-primary"></i> Transaksi Hutang</h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <form id="form-search-tagihan">
        <div class="input-group mb-3">
          <select name="year" class="form-select flex-shrink-1 input-perpage input-year-tagihan"></select>
          <select name="month" class="form-select flex-shrink-1 input-perpage input-month-tagihan">
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
          <select name="perpage" class="form-select flex-shrink-1 input-perpage-tagihan">
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
      <div class="my-0" id="list-transaksi">
      </div>
      <span class="pagination-transaksi my-4"></span>
    </div>
  </div>

  <form id="form-tagihan" class="needs-validation" novalidate>
    <div class="row m-5">
      <div class="col">
        <div class="">
          <h1 class="fs-4 fw-lighter my-3 text-secondary">Form Entri Tagihan Hutang</h1>
          <small>Hutang adalah transaksi di mana barang/jasa sudah diterima namun belum dibayarkan secara tunai. Pembayaran secara tunai hutang akan dilakukan dalam jangka waktu yang singkat.</small>
          <hr>
          <div class="form-group row">
            <label for="input-kakunkredit" class="col-4 col-form-label text-primary">Akun Kredit</label>
            <div class="col-8">
              <select id="input-kakunkredit" name="input-kakunkredit" type="text" class="form-select"
                required="required"></select>
              <span id="input-tanggalHelpBlock" class="form-text text-muted my-2 d-block">Akun kredit hutang.</span>
              <div class="invalid-feedback">Akun kredit harus dipilih.</div>
            </div>
          </div>
          <div class="form-group row mb-4">
            <label for="input-kakundebit" class="col-4 col-form-label text-primary">Akun Debit</label>
            <div class="col-8">
              <select id="input-kakundebit" name="input-kakundebit" type="text" class="form-select"
                required="required"></select>
              <span id="input-tanggalHelpBlock" class="form-text text-muted my-2 d-block">Biaya/Jasa yang telah diterima.</span>
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
            <label for="input-nominal" class="col-4 col-form-label text-primary">Nominal Tagihan</label>
            <div class="col-8">
              <input id="input-nominal" name="input-nominal" type="number" class="form-control" required="required">
              <div id="input-terbilang" class="text-danger my-2 mx-2"></div>
              <div class="invalid-feedback">Harus diisi dengan angka nominal.</div>
            </div>
          </div>
          <div class="mb-5 p-3 border rounded-2 bg-light text-end container-action-transaksi">
            <span class="btn btn-sm btn-secondary bt-print-kuitansi" style="display:none"><i class="bi bi-printer"></i>
              Cetak Bukti Pembayaran</span>
            <button class="btn btn-sm btn-primary bt-catat">
              <i class="bi bi-cash-coin me-2"></i> Catat Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>

</div>


<form id="form-pembayaran-tagihan" class="bg-white border rounded shadow needs-validation" novalidate style="display:none">
  <div class="row m-4">
    <div class="col">
      <h5 class="mb-3">Pembayaran Tagihan Hutang</h5>
      <div class="info-hutang border rounded p-3 mb-3 bg-light"></div>
      <div class="form-group row">
        <label for="input-kakunkredit" class="col-4 col-form-label text-primary">Akun Kredit</label>
        <div class="col-8">
          <select name="input-kakunkredit" type="text" class="form-select input-kakunkredit"
            required="required"></select>
          <span id="input-tanggalHelpBlock" class="form-text text-muted my-2 d-block">Kas sumber dana pembayaran.</span>
          <div class="invalid-feedback">Akun kredit harus dipilih.</div>
        </div>
      </div>
      <div class="form-group row mb-4">
        <label for="input-kakundebit" class="col-4 col-form-label text-primary">Akun Debit</label>
        <div class="col-8">
          <select name="input-kakundebit" type="text" class="form-select .input-kakundebit"
            required="required"></select>
          <span id="input-tanggalHelpBlock" class="form-text text-muted my-2 d-block">Akun hutang.</span>
          <div class="invalid-feedback">Akun debit harus dipilih.</div>
        </div>
      </div>
      <div class="form-group row mb-4">
        <label for="input-keterangan" class="col-4 col-form-label text-primary">Catatan/Keterangan</label>
        <div class="col-8">
          <textarea style="height:70px;" name="input-keterangan" type="number"
            class="form-control input-keterangan"></textarea>
        </div>
      </div>
      <div class="form-group row">
        <label for="input-nominal" class="col-4 col-form-label text-primary">Nominal Pembayaran</label>
        <div class="col-8">
          <input name="input-nominal" type="number" class="form-control input-nominal" required="required">
          <div class="text-danger my-2 mx-2 input-terbilang"></div>
          <div class="invalid-feedback">Harus diisi dengan angka nominal.</div>
        </div>
      </div>
      <div class="py-3 text-end">
        <span class="btn btn-sm btn-secondary app-btn-close-dialog me-2"><i class="bi bi-x-lg"></i> Close</span>
        <button class="btn btn-sm btn-primary bt-bayar">
          <i class="bi bi-cash-coin me-2"></i> Catat Pembayaran Hutang
        </button>
      </div>
    </div>
  </div>
</form>

<div id="dialog-pembayaran-tagihan" class="bg-white rounded border p-4 shadow" style="display:none">
  <h5 class="mb-3">Daftar Pembayaran Tagihan</h5>
  <div class="info-tagihan border rounded bg-light p-3 mb-3"></div>
  <div class="list-pembayaran"></div>
  <div class="info-total-pembayaran p-3 mt-3 border rounded bg-light"></div>
  <div class="text-end mt-3">
    <span class="btn btn-sm btn-secondary app-btn-close-dialog"><i class="bi bi-x-lg"></i> Close</span>
  </div>
</div>