<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-card-checklist mx-2 text-primary"></i> Kartu Hasil Studi</h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <form class="form" id="form-search">
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
      <div class="list-mahasiswa" id="list-mahasiswa"></div>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <div id="selected-mahasiswa" class="px-4 border border-primary rounded bg-primary-subtle d-flex justify-content-between align-items-center">
      </div>
    </div>
  </div>
  
  <div class="row m-5">
    <div class="col-md-5 col-sm-12">
      <form method="post" id="riwayat-krs" target="_blank"
        action="<?php echo $this->location('m/x/waka/print/krs'); ?>">
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Daftar KRS</h1>
        <div id="list-krs" class="mb-3 rounded-2 border border-1" style="max-height: 450px; overflow-y:auto">&nbsp;</div>
        <div class="mb-3 p-3 border rounded-2 bg-light text-end container-action-krs">
          <span class="btn btn-sm btn-success text-light bt-refresh"><i class="bi bi-arrow-repeat me-2"></i>
            Refresh</span>
        </div>
      </form>
    </div>
    <div class="col-md-7 col-sm-12">
      <h1 class="fs-4 fw-lighter my-3 text-secondary">KHS <small class="text-muted info-selected-khs"></small></h1>
      <div id="list-matakuliah-khs" class="rounded-2 border border-1">&nbsp;</div>
      <form method="post" id="cetak-khs" target="_blank" class="mt-3"
        action="<?php echo $this->location('m/x/waka/print/khs'); ?>">
        <input type="hidden" name="nrm">
        <input type="hidden" name="semester">
        <input type="hidden" name="semesterke">
        <input type="hidden" name="tahun">
        <div class="mb-3 p-3 border rounded-2 bg-light text-end container-action-khs">
          <span class="btn btn-sm btn-success text-light bt-refresh"><i class="bi bi-arrow-repeat me-2"></i>
            Refresh</span>
          <span class="btn btn-sm btn-primary bt-print-khs">
            <i class="bi bi-printer me-2"></i> Cetak KHS
          </span>
        </div>
      </form>
    </div>
  </div>
  
</div>



<!-- <div id="nim-dialog" class="card shadow" style="width: 500px; display:none;">
  <div class="card-header app-card-header">NIM Mahasiswa</div>
  <div class="card-body">
    <form>
      
      <div class="form-group row mb-2">
        <label for="input-nim" class="col-4 col-form-label">NIM</label>
        <div class="col-8">
          <input id="input-nim" name="input-nim" placeholder="" type="text" class="form-control"
            required="required">
          <span id="input-nimHelpBlock" class="form-text text-muted">NIM Mahasiswa</span>
        </div>
      </div>
      
    </form>
    <hr>
    <div class="d-flex justify-content-between text-end">
      <span>&nbsp;</span>
      <span>
        <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
        <button class="bt-save btn btn-success text-light fw-normal ms-2">Save</button>
      </span>
    </div>
  </div>
</div> -->