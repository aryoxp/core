<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-person-fill-check mx-2 text-primary"></i> Penerimaan Mahasiswa <small class="text-muted fw-light">Pemberian NIM</small></h3>
    </div>
  </div>

  <form id="form-search" class="row m-5">
    <div class="input-group col mb-3">
      <select id="input-prodi" name="input-prodi" style="width:200px;" class="form-select">
        <option value="D3">D3 Kebidanan</option>
        <option value="D3F">D3 Farmasi</option>
        <option value="MIK">D4 Manajemen Informasi Kesehatan</option>
        <option value="FIS">D4 Fisioterapi</option>
      </select>
      <select id="input-angkatan" name="input-angkatan" class="form-select"></select>
      <input type="text" name="keyword" class="form-control input-keyword" placeholder="Search keyword" aria-label="Keyword" style="width:100px">
      <select name="perpage" class="form-select flex-shrink-1 input-perpage" style="width:50px">
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

  <div class="row m-5">
    <div class="col">
      <div class="mahasiswa-list mb-3"></div>
      <div class="student-pagination"></div>
    </div>
  </div>
</div>



<div id="nim-dialog" class="card shadow" style="width: 500px; display:none;">
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
      <!-- <button class="btn-delete btn btn-danger text-light fw-normal me-5"><i class="bi bi-exclamation-triangle"></i> -->
        <!-- DELETE</button> -->
      <span>
        <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
        <button class="bt-save btn btn-success text-light fw-normal ms-2">Save</button>
      </span>
    </div>
  </div>
</div>