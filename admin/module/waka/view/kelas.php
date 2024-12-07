<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-person-video3 mx-2 text-primary"></i> Kelas</h3>
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
    <form id="form-kelas" method="post" class="col-sm-12 col-md-4 mb-5">
      <input type="hidden" name="tahun">
      <input type="hidden" name="semester">
      <input type="hidden" name="kdmk">
      <input type="hidden" name="kurikulum">
      <h4 class="fs-5">Kelas</h4>
      <div class="info-kelas mb-3"></div>
      <div id="list-kelas" class="list-kelas"></div>
      <div class="input-group mt-3 rounded border p-3 bg-light">
        <label for="input-kelas" class="input-group-text">Kelas</label>
        <select name="input-kelas" class="form-select input-kelas" aria-describedby="input-kelasHelpBlock" required="required">
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
          <option value="H">H</option>
          <option value="I">I</option>
          <option value="J">J</option>
          <option value="K">K</option>
          <option value="L">L</option>
          <option value="M">M</option>
          <option value="N">N</option>
          <option value="O">O</option>
          <option value="P">P</option>
          <option value="Q">Q</option>
          <option value="R">R</option>
          <option value="S">S</option>
          <option value="T">T</option>
          <option value="U">U</option>
          <option value="V">V</option>
          <option value="W">W</option>
          <option value="X">X</option>
          <option value="Y">Y</option>
          <option value="Z">Z</option>
          <option value="A1">A1</option>
          <option value="B1">B1</option>
          <option value="C1">C1</option>
          <option value="D1">D1</option>
          <option value="E1">E1</option>
          <option value="F1">F1</option>
          <option value="G1">G1</option>
          <option value="H1">H1</option>
          <option value="A2">A2</option>
          <option value="A3">A3</option>
          <option value="A4">A4</option>
          <option value="A5">A5</option>
          <option value="A6">A6</option>
          <option value="A7">A7</option>
          <option value="A8">A8</option>
          <option value="A9">A9</option>
          <option value="K1">K1</option>
          <option value="K2">K2</option>
          <option value="K3">K3</option>
          <option value="K4">K4</option>
          <option value="K5">K5</option>
          <option value="K6">K6</option>
          <option value="K7">K7</option>
          <option value="K8">K8</option>
          <option value="K9">K9</option>
        </select>
        <span class="btn btn-sm btn-success text-light bt-buat-kelas"><i class="bi bi-plus-lg me-2"></i>
            Buat Kelas</span>
      </div>
    </form>
    <div class="col-sm-12 col-md-8">
      <form id="form-peserta-kelas">
        <input type="hidden" name="tahun">
        <input type="hidden" name="semester">
        <input type="hidden" name="kdmk">
        <input type="hidden" name="kurikulum">
        <input type="hidden" name="nama">
      </form>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h4 class="fs-5 me-auto">Peserta Kelas <small class="text-muted info-kelas"></small></h4>
      </div>
      <div class="input-group mb-3">
        <select name="perpage" id="input-perpage-peserta" class="form-select flex-shrink-1 input-perpage">
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
      <div id="list-mahasiswa" class="list-mahasiswa border rounded mb-3">&nbsp;</div>
      <div class="pagination-peserta mb-3"></div>
      <form id="form-print-bapresensi" target="_blank" method="post" class="p-3 border rounded text-end bg-light">
        <input type="hidden" name="tahun">
        <input type="hidden" name="semester">
        <input type="hidden" name="kdmk">
        <input type="hidden" name="kurikulum">
        <input type="hidden" name="nama">
        <button class="bt-refresh btn btn-success text-light"><i class="bi bi-arrow-repeat"></i> Refresh</button>
        <button class="bt-print btn btn-primary"><i class="bi bi-printer"></i> Print Berita Acara Perkuliahan dan Presensi</button>
      </form>
      <form id="form-pemrogram">
        <input type="hidden" name="tahun">
        <input type="hidden" name="semester">
        <input type="hidden" name="kdmk">
        <input type="hidden" name="kurikulum">
        <h4 class="fs-5 mt-4">Pemrogram Matakuliah</h4>
        <div class="input-group mb-3">
          <select name="perpage" id="input-perpage-pemrogram" class="form-select flex-shrink-1 input-perpage">
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
        <div id="list-mahasiswa-pemrogram" class="list-mahasiswa-pemrogram border rounded mb-3">&nbsp;</div>
        <div class="pagination-peserta-pemrogram"></div>
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