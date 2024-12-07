<div class="container">

  <div class="row m-5">
    <div class="col">
      <h3 class=""><i class="bi bi-arrow-left-right me-2 text-primary"></i> Mutasi Kas</h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col-6">
      <div class="small-box bg-info rounded-3 p-3 my-2 text-light">
        <div class="inner">
          <h3 class="h1 text-light saldo">Rp--</h3>
          <p>Saldo</p>
        </div>
      </div>
    </div>

    <div class="col-lg-3 col-6">
      <div class="small-box bg-success rounded-3 p-3 my-2 text-light">
        <div class="inner">
          <h3 class="h1 text-light count-penerimaan">150</h3>
          <p>Penerimaan Kas</p>
        </div>
      </div>
    </div>

    <div class="col-lg-3 col-6">
      <div class="small-box bg-warning rounded-3 my-2 p-3">
        <div class="inner text-dark">
          <h3 class="h1 count-pengeluaran">150</h3>
          <p>Pengeluaran Kas</p>
        </div>
      </div>
    </div>

  </div>

  <div class="row m-5">
    <div class="col">
      <h5 class="m-3">Penerimaan Kas</h5>
      <form class="m-2" id="form-search-penerimaan">
        <div class="input-group mb-3">
          <select name="year" class="form-select flex-shrink-1 input-perpage input-year-penerimaan"></select>
          <select name="month" class="form-select flex-shrink-1 input-perpage input-month-penerimaan">
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
          <select name="perpage" class="form-select flex-shrink-1 input-perpage-penerimaan">
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

      <div class="penerimaan-list mb-3"></div>
      <div id="penerimaan-selection" class="mt-1 px-2 mb-3">
        <span class="badge rounded-pill bg-primary bt-select-all-penerimaan" role="button">Select All</span>
        <span class="badge rounded-pill bg-danger bt-unselect-all-penerimaan" role="button">Unselect All</span>
        with selected:
        <button class="btn btn-danger btn-sm bt-delete-selected text-light"><i class="bi bi-trash"></i>
          Delete</button>
      </div>
      <div class="penerimaan-pagination mb-3"></div>

      <div class="border rounded p-3 bg-light text-end">
        <button class="btn btn-success text-light" id="bt-new-mutasi-penerimaan"><i class="bi bi-plus"></i>
        Catat Mutasi Penerimaan Kas</button>
      </div>
    </div>


    <!-- Pengembalian Kas -->
    <div class="col">
      <h5 class="m-3">Pengembalian Kas</h5>
      <form class="m-2" id="form-search-pengembalian">
        <div class="input-group mb-3">
          <!-- <input type="text" name="keyword" class="form-control w-50 input-keyword" placeholder="Search keyword"
            aria-label="Keyword"> -->
          <select name="year" class="form-select flex-shrink-1 input-perpage input-year-pengembalian"></select>
          <select name="month" class="form-select flex-shrink-1 input-perpage input-month-pengembalian">
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
          <select name="perpage" class="form-select flex-shrink-1 input-perpage-pengembalian">
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

      <div class="pengembalian-list mb-3"></div>
      <div id="pengembalian-selection" class="mt-1 px-2 mb-3">
        <span class="badge rounded-pill bg-primary bt-select-all-pengembalian" role="button">Select All</span>
        <span class="badge rounded-pill bg-danger bt-unselect-all-pengembalian" role="button">Unselect All</span>
        with selected:
        <button class="btn btn-danger btn-sm bt-delete-selected text-light"><i class="bi bi-trash"></i>
          Delete</button>
      </div>
      <div class="pengembalian-pagination mb-3"></div>

      <div class="rounded border p-3 bg-light text-end">
        <button class="btn btn-warning text-dark" id="bt-new-mutasi-pengembalian"><i class="bi bi-plus"></i>
          Catat Mutasi Pengembalian Kas</button>
      </div>

    </div>
  </div>
</div>




<div id="mutasi-dialog" class="border rounded shadow p-4 bg-white" style="display:none;">
  <h5 class="mb-3">Transaksi Mutasi Kas</h5>
  <div>
    <form>
      <div class="form-group row mb-2">
        <label for="input-nominal" class="col-4 col-form-label">Tanggal</label>
        <div class="col-8">
          <input type="text" class="form-control" id="input-tanggal" />
          <span id="input-tanggalHelpBlock" class="form-text text-muted">format: dd/mm/yyyy</span>
        </div>
      </div>
      <div class="form-group row mb-2">
        <label for="input-nominal" class="col-4 col-form-label">Nominal</label>
        <div class="col-8">
          <input id="input-nominal" name="input-nominal" placeholder="" type="text" class="form-control"
            required="required">
          <span id="input-nominalHelpBlock" class="form-text text-muted">Nominal Mutasi</span>
        </div>
      </div>
      <div class="form-group row mb-2">
        <label for="input-kakundebit" class="col-4 col-form-label">Akun Debit</label>
        <div class="col-8">
          <select id="input-kakundebit" name="input-kakundebit" class="form-select"
            aria-describedby="input-kakundebitHelpBlock" required="required">
          </select>
          <span id="input-kakundebitHelpBlock" class="form-text text-muted">Akun yang didebit dalam transaksi
            ini.</span>
        </div>
      </div>
      <div class="form-group row mb-2">
        <label for="input-kakunkredit" class="col-4 col-form-label">Akun Kredit</label>
        <div class="col-8">
          <select id="input-kakunkredit" name="input-kakunkredit" class="form-select">
          </select>
          <span id="input-kakunkreditHelpBlock" class="form-text text-muted">Akun yang dikredit dalam transaksi
            ini.</span>
        </div>
      </div>
      <div class="row mb-2">
        <label for="input-keterangan" class="col-4 col-form-label">Keterangan</label>
        <div class="col-8">
          <textarea id="input-keterangan" name="input-keterangan" class="form-control form-control-sm"
            style="height:100px;" aria-describedby="input-keteranganHelpBlock"></textarea>
          <span id="input-keteranganHelpBlock" class="form-text text-muted">Keterangan dan informasi terkait
            tujuan penggunaan dana dari mutasi kas ini.</span>
        </div>
      </div>
    </form>
    <hr>
    <div class="text-end">
      <!-- <button class="btn-delete btn btn-danger text-light fw-normal me-5"><i class="bi bi-exclamation-triangle"></i>
        DELETE</button> -->
      <span>
        <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
        <button class="btn-save btn btn-success text-light fw-normal ms-2">Save</button>
      </span>
    </div>
  </div>
</div>