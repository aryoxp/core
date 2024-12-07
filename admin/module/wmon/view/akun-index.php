<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3 class=""><i class="bi bi-book text-primary me-2"></i> Akun</h3>
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
          
      <div class="akun-list mb-3"></div>
      <div id="akun-selection" class="mt-1 px-2 mb-3">
        <span class="badge rounded-pill bg-primary bt-select-all" role="button">Select All</span>
        <span class="badge rounded-pill bg-danger bt-unselect-all" role="button">Unselect All</span>
        with selected:
        <button class="btn btn-danger btn-sm bt-delete-selected text-light"><i class="bi bi-trash"></i> Delete</button>
      </div>
      <div class="akun-pagination"></div>

      <div class="p-3 border rounded bg-light mt-3 text-end">
        <button class="btn btn-sm btn-primary" id="bt-new-akun">
          <i class="bi bi-plus"></i> Akun Baru
        </button>
      </div>
  
      <div id="akun-dialog" class="card shadow p-4" style="display:none;">
        <h5 class="mb-3">Akun Baru</h5>
        <form>
          <div class="form-group row mb-2">
            <label class="col-4 col-form-label" for="input-kode">Kode</label>
            <div class="col-8">
              <input id="input-kode" name="input-kode" placeholder="" type="text" class="form-control" aria-describedby="input-kodeHelpBlock" required="required">
              <span id="input-kodeHelpBlock" class="form-text text-muted">Contoh: 401, 203, atau 504</span>
            </div>
          </div>
          <div class="form-group row mb-2">
            <label for="input-nama" class="col-4 col-form-label">Nama</label>
            <div class="col-8">
              <input id="input-nama" name="input-nama" placeholder="" type="text" class="form-control" required="required">
            </div>
          </div>
          <div class="form-group row mb-2">
            <label for="input-kategori" class="col-4 col-form-label">Kategori</label>
            <div class="col-8">
              <select id="input-kategori" name="input-kategori" class="form-select" aria-describedby="input-kategoriHelpBlock" required="required">
                <option value="Harta">Harta</option>
                <option value="Inventaris">Inventaris</option>
                <option value="Modal">Modal</option>
                <option value="Hutang">Hutang</option>
                <option value="Pendapatan">Pendapatan</option>
                <option value="Biaya">Biaya</option>
              </select>
              <span id="input-kategoriHelpBlock" class="form-text text-muted">Kategori Akun dalam Akuntansi</span>
            </div>
          </div>
          <div class="row mb-2">
            <label for="input-keterangan" class="col-4 col-form-label">Keterangan</label>
            <div class="col-8">
              <textarea id="input-keterangan" name="input-keterangan" class="form-control form-control-sm" style="height:100px;" aria-describedby="input-keteranganHelpBlock"></textarea>
              <span id="input-keteranganHelpBlock" class="form-text text-muted">Opsional: Keterangan dan informasi terkait penggunaan akun ini.</span>
            </div>
          </div>
        </form>
        <hr>
        <div class="text-end">
          <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
          <button class="btn-save btn btn-success text-light fw-normal ms-2">Save</button>
        </div>
      </div>
    </div>
    <div id="akun-detail" class="col p-4">
      <div class="content">
        <em>Pilih salah satu akun untuk melihat detail informasi akun.</em>
      </div>
    </div>
  </div>
</div>