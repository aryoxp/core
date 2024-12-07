<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-card-checklist mx-2 text-primary"></i> Kartu Rencana Studi</h3>
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
      <form id="form-krs" method="post" class="p-3 rounded border">
        <div class="form-group row mb-2">
          <label for="input-semesterke" class="col-4 col-form-label">Semester Ke-</label>
          <div class="col-8">
            <select name="input-semesterke" class="form-select input-semesterke" aria-describedby="input-semesterkeHelpBlock" required="required">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
            </select>
          </div>
        </div>
        <div class="form-group row mb-2">
          <label for="input-semester" class="col-4 col-form-label">Semester</label>
          <div class="col-8">
            <select id="input-semester" name="input-semester" class="form-select input-semester">
              <option value="1">Ganjil</option>
              <option value="2">Genap</option>
              <option value="3">Ganjil Pendek</option>
              <option value="4">Genap Pendek</option>
            </select>
            <!-- <span id="input-semesterHelpBlock" class="form-text text-muted">Kurikulum Mata Kuliah</span> -->
          </div>
        </div>
        <div class="row mb-2">
          <label for="input-tahun" class="col-4 col-form-label">Tahun</label>
          <div class="col-8">
            <select id="input-tahun" name="input-tahun" class="form-select form-control-sm input-tahun" aria-describedby="input-tahunHelpBlock" required="required"></select>
            <span id="input-tahunHelpBlock" class="form-text text-muted">Tahun penawaran/pengambilan semester</span>
          </div>
        </div>
        <div class="row">
          <div class="col text-end">
            <span class="btn btn-sm btn-success text-light bt-buat-krs"><i class="bi bi-plus-lg me-2"></i>
                Buat KRS</span>
          </div>
        </div>
      </form>
    </div>
    <div class="col-md-7 col-sm-12">
      <h1 class="fs-4 fw-lighter my-3 text-secondary">Matakuliah KRS <small class="text-muted info-selected-krs"></small></h1>
      <div id="list-matakuliah-krs" class="rounded-2 border border-1">&nbsp;</div>
      <form method="post" id="cetak-krs" target="_blank" class="mt-3"
        action="<?php echo $this->location('m/x/waka/print/krs'); ?>">
        <input type="hidden" name="nrm">
        <input type="hidden" name="semester">
        <input type="hidden" name="semesterke">
        <input type="hidden" name="tahun">
        <div class="mb-3 p-3 border rounded-2 bg-light text-end container-action-krs">
          <span class="btn btn-sm btn-success text-light bt-refresh"><i class="bi bi-arrow-repeat me-2"></i>
            Refresh</span>
          <span class="btn btn-sm btn-primary bt-print-krs">
            <i class="bi bi-printer me-2"></i> Cetak KRS
          </span>
        </div>
      </form>
      <h1 class="fs-4 fw-lighter my-3 text-secondary mt-5">Matakuliah Ditawarkan <small class="text-muted info-selected-krs"></small></h1>
      <div id="list-matakuliah-ditawarkan" class="rounded-2 border border-1">&nbsp;</div>
      <div class="pagination-matakuliah-ditawarkan mt-5"></div>
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