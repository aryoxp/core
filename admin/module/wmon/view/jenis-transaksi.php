<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3 class=""><i class="bi bi-grid me-2 text-primary"></i> Jenis Transaksi</h3>
    </div>
  </div>
  <div class="row m-5">
    <div class="col">

      <form class="m-2" id="form-search">
        <div class="input-group mb-3">
          <input type="text" name="keyword" class="form-control w-50 input-keyword" placeholder="Search keyword" aria-label="Keyword">
          <select name="perpage" class="form-select flex-shrink-1 input-perpage">
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
      <div class="jenis-transaksi-list mb-3"></div>
      <div id="jenis-transaksi-selection" class="mt-1 px-2 mb-3">
        <span class="badge rounded-pill bg-primary bt-select-all" role="button">Select All</span>
        <span class="badge rounded-pill bg-danger bt-unselect-all" role="button">Unselect All</span>
        with selected:
        <button class="btn btn-danger btn-sm bt-delete-selected text-light"><i class="bi bi-trash"></i> Delete</button>
      </div>
      <div class="jenis-transaksi-pagination mb-3"></div>
      <div class="border rounded p-3 bg-light text-end">
        <button class="btn btn=sm btn-primary" id="bt-new-jenis-transaksi"><i class="bi bi-plus"></i> Jenis Transaksi Baru</button>
      </div>
  
      <div id="jenis-transaksi-dialog" class="card shadow" style="width: 500px; display:none;">
        <div class="card-header app-card-header">Jenis Transaksi</div>
        <div class="card-body">
          <form>
            <div class="form-group row mb-2">
              <label class="col-4 col-form-label" for="input-kode">Kode</label>
              <div class="col-8">
                <input id="input-kode" name="input-kode" placeholder="" type="text" class="form-control" aria-describedby="input-kodeHelpBlock" required="required">
                <span id="input-kodeHelpBlock" class="form-text text-muted">Contoh: TMHS, TRNS (maksimal 4 karakter)</span>
              </div>
            </div>
            <div class="form-group row mb-2">
              <label for="input-nama" class="col-4 col-form-label">Nama</label>
              <div class="col-8">
                <input id="input-nama" name="input-nama" placeholder="" type="text" class="form-control" required="required">
              </div>
            </div>
            <div class="form-group row mb-2">
              <label for="input-kakundebit" class="col-4 col-form-label">Kategori Akun Debit</label>
              <div class="col-8">
                <select id="input-kakundebit" name="input-kakundebit" class="form-select" aria-describedby="input-kakundebitHelpBlock" required="required">
                  <option value="Harta">Harta</option>
                  <option value="Inventaris">Inventaris</option>
                  <option value="Modal">Modal</option>
                  <option value="Hutang">Hutang</option>
                  <option value="Pendapatan">Pendapatan</option>
                  <option value="Biaya">Biaya</option>
                </select>
                <span id="input-kakundebitHelpBlock" class="form-text text-muted">Kategori Akun Debit untuk Jenis Transaksi</span>
              </div>
            </div>
            <div class="form-group row mb-2">
              <label for="input-kakunkredit" class="col-4 col-form-label">Kategori Akun Kredit</label>
              <div class="col-8">
                <select id="input-kakunkredit" name="input-kakunkredit" class="form-select" aria-describedby="input-kakunkreditHelpBlock" required="required">
                  <option value="Harta">Harta</option>
                  <option value="Inventaris">Inventaris</option>
                  <option value="Modal">Modal</option>
                  <option value="Hutang">Hutang</option>
                  <option value="Pendapatan">Pendapatan</option>
                  <option value="Biaya">Biaya</option>
                </select>
                <span id="input-kakunkreditHelpBlock" class="form-text text-muted">Kategori Akun Kredit untuk Jenis Transaksi</span>
              </div>
            </div>
            <div class="row mb-2">
              <label for="input-keterangan" class="col-4 col-form-label">Keterangan</label>
              <div class="col-8">
                <textarea id="input-keterangan" name="input-keterangan" class="form-control form-control-sm" style="height:100px;" aria-describedby="input-keteranganHelpBlock"></textarea>
                <span id="input-keteranganHelpBlock" class="form-text text-muted">Opsional: Keterangan dan informasi terkait penggunaan jenis transaksi ini.</span>
              </div>
            </div>
          </form>
          <hr>
          <div class="d-flex justify-content-between">
            <button class="btn-delete btn btn-danger text-light fw-normal me-5"><i class="bi bi-exclamation-triangle"></i> DELETE</button>
            <span>
              <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
              <button class="btn-save btn btn-success text-light fw-normal ms-2">Save</button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div id="jenis-transaksi-detail" class="col px-4">
      <h5 class="mb-3">Jenis Transaksi</h5>
      <div class="content">
        <em>Pilih salah satu jenis transaksi untuk melihat detail informasi jenis transaksi.</em>
      </div>
    </div>
  </div>
</div>