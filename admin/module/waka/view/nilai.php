<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-clipboard-check mx-2 text-primary"></i> Nilai Matakuliah</h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <form class="form" id="form-penawaran">
        <div class="input-group mb-3">
          <select id="input-prodi" name="input-prodi" class="form-select flex-shrink-1 input-prodi">
            <option value="D3">D3 Kebidanan</option>
            <option value="D3F">D3 Farmasi</option>
            <option value="MIK">D4 Manajemen Informasi Kesehatan</option>
            <option value="FIS">D4 Fisioterapi</option>
          </select>
          <select id="input-tahun" name="input-tahun" class="form-select input-tahun"></select>
          <select id="input-semester" name="input-semester" class="form-select input-semester">
            <option value="1">Ganjil</option>
            <option value="2">Genap</option>
            <option value="3">Ganjil Pendek</option>
            <option value="4">Genap Pendek</option>
          </select>
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
          <button class="btn btn-secondary bt-show"><i class="bi bi-search"></i></button>
        </div>
      </form>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <div class="list-matakuliah" id="list-matakuliah"></div>
      <div class="pagination-matakuliah mt-3"></div>
    </div>
  </div>

  <div class="row m-5">
    <form id="form-kelas" method="post" class="col mb-5">
      <input type="hidden" name="tahun">
      <input type="hidden" name="semester">
      <input type="hidden" name="kdmk">
      <input type="hidden" name="kurikulum">
      <h4 class="fs-5">Kelas</h4>
      <div class="info-kelas mb-3"></div>
      <div id="list-kelas" class="list-kelas"></div>
    </form>
  </div>

  <div class="row m-5">
    <div class="col-sm-12 col-md-6">
      <form id="form-peserta-kelas">
        <input type="hidden" name="tahun">
        <input type="hidden" name="semester">
        <input type="hidden" name="kdmk">
        <input type="hidden" name="kurikulum">
        <input type="hidden" name="nama">
        <div class="mb-2">
          <h4 class="fs-5 me-auto">Nilai Peserta Kelas <small class="text-muted info-kelas"></small></h4>
        </div>
      </form>
      <table class="table">
        <thead>
          <th>NIM</th>
          <th>Nama</th>
          <th>Nilai</th>
          <th>Bobot</th>
          <th>&nbsp;</th>
        </thead>
        <tbody id="list-mahasiswa">
        </tbody>
      </table>
      <!-- <div id="list-mahasiswa" class="list-mahasiswa border rounded mb-3">&nbsp;</div>
      <div class="pagination-peserta mb-3"></div> -->
      <form id="form-nilai" target="_blank" method="post" class="p-3 border rounded text-end bg-light mb-2">
        <input type="hidden" name="tahun">
        <input type="hidden" name="semester">
        <input type="hidden" name="kdmk">
        <input type="hidden" name="kurikulum">
        <input type="hidden" name="nama">
        <button class="bt-refresh btn btn-success text-light"><i class="bi bi-arrow-repeat"></i> Reset</button>
        <button class="bt-save-all btn btn-danger text-light"><i class="bi bi-floppy"></i> Simpan Nilai di
          Database</button>
      </form>
      <div id="progressbar" class="progress" role="progressbar" aria-label="Save progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="height:10px;">
        <div class="progress-bar"></div>
      </div>
      <div id="tprogress"></div>
    </div>
    <div class="col-sm-12 col-md-6">
      <div class="mb-2">
        <h4 class="fs-5 me-auto">Upload Nilai Peserta Kelas <small class="text-muted info-kelas"></small></h4>
      </div>
      <div id="uploadfile" class="p-4 text-center border rounded bg-light upload-area">
        Drag file Excel nilai di sini.
      </div>
      <input type="file" name="file" id="file" class="d-none">
      <form id="form-presensi-uts" method="post" class="d-none" target="_blank">
        <input type="hidden" name="tahun">
        <input type="hidden" name="semester">
        <input type="hidden" name="kdmk">
        <input type="hidden" name="kurikulum">
        <input type="hidden" name="nama">
      </form>
      <form id="form-presensi-uas" method="post" class="d-none" target="_blank">
        <input type="hidden" name="tahun">
        <input type="hidden" name="semester">
        <input type="hidden" name="kdmk">
        <input type="hidden" name="kurikulum">
        <input type="hidden" name="nama">
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