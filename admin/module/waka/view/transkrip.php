<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-list-columns mx-2 text-primary"></i> Transkrip Nilai <small class="text-muted fw-light"></small></h3>
    </div>
  </div>

  <form id="form-search" class="row m-5">
    <div class="input-group col-sm-12">
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
    <div class="col p-4 py-3 border rounded bg-light m-3 mt-3">
        Mahasiswa yang belum memiliki informasi program studi, tidak ditampilkan dalam daftar pencarian. 
        <br>Set informasi program studi mahasiswa <a class="btn btn-danger btn-sm text-light p-2 py-1" href="<?php echo $this->location('m/x/wadm/student'); ?>">di sini</a>.</div>
  </form>


  <div class="row m-5">
    <div class="col">
      <div class="mahasiswa-list mb-3"></div>
      <div class="multi-select-action">
        
      </div>
      <div class="student-pagination"></div>
    </div>
  </div>
  <div class="row m-5">
    <div class="col">
      <h4 class="mb-3">Transkrip Nilai</h4>
      <div class="list-matakuliah mb-3"></div>
      <div class="pagination-matakuliah mb-3"></div>
      <div class="info-transkrip mb-3 px-4 py-3 bg-light border rounded"></div>
      <form method="post" id="print-transkrip" class="border rounded px-4 py-3 border-3 bg-light text-end">
        <input type="hidden" name="nrm">
        <button class="btn btn-primary bt-print-transkrip"><i class="bi bi-printer"></i> Print</button>
      </form>
    </div>
  </div>
</div>



<div id="nip-dialog" class="shadow bg-white rounded-3 border p-4" style="display:none;">
  <form>    
    <div class="form-group mb-2">
      <label for="input-nip" class="form-label">Transkrip Nilai</label>
      <div class="">
        <select id="input-nip" name="input-nip" placeholder="" type="text" class="form-select"></select>
        <span id="input-nipHelpBlock" class="form-text mt-2 p-2 d-block">Dosen Transkrip Nilai bertugas untuk memvalidasi matakuliah yang diprogram oleh mahasiswa dalam KRS. Matakuliah terporgram dalam KRS yang tidak divalidasi oleh dosen penasihat akademik (PA) akan dibatalkan.</span>
      </div>
    </div>
  </form>
  <hr>
  <div class="text-end">
    <!-- <button class="btn-delete btn btn-danger text-light fw-normal me-5"><i class="bi bi-exclamation-triangle"></i> -->
      <!-- DELETE</button> -->
    <span>
      <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
      <button class="bt-save btn btn-success text-light fw-normal ms-2">Save</button>
    </span>
  </div>
</div>