<div class="container">
  <div class="row">
    <div class="col">
      <h3 class="m-5 mb-0"><i class="bi bi-book text-primary me-2"></i> Mata Kuliah</h3>
    </div>
  </div>
  <div class="row">
    <div class="col m-5">
      <!-- <div class="card shadow-sm my-3">
        <div class="card-header">
          <button class="btn btn=sm btn-secondary" id="bt-new-matakuliah"><i class="bi bi-plus"></i> Mata Kuliah Baru</button>
        </div>
        <div class="card-body"> -->

        <button class="btn btn-sm btn-success text-light mb-4" id="bt-new-matakuliah"><i class="bi bi-plus"></i> Mata Kuliah Baru</button>
  
          <form class="m-2" id="form-search">
            <div class="input-group mb-3">
              <select name="input-prodi" class="form-select flex-shrink-1 input-prodi">
                <option value="D3">D3 Kebidanan</option>
                <option value="D3F">D3 Farmasi</option>
                <option value="MIK">D4 Manajemen Informasi Kesehatan</option>
                <option value="FIS">D4 Fisioterapi</option>
              </select>
              <select name="input-kurikulum" class="form-select flex-shrink-1 input-kurikulum"></select>
              <input type="text" name="keyword" class="form-control input-keyword" placeholder="Search keyword" aria-label="Keyword">
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
          
          <div class="matakuliah-list mb-3"></div>
          <div id="matakuliah-selection" class="mt-1 px-2 mb-3">
            <span class="badge rounded-pill bg-primary bt-select-all" role="button">Select All</span>
            <span class="badge rounded-pill bg-danger bt-unselect-all" role="button">Unselect All</span>
            with selected:
            <button class="btn btn-danger btn-sm bt-delete-selected text-light"><i class="bi bi-trash"></i> Delete</button>
          </div>
          <div class="matakuliah-pagination"></div>
  
        <!-- </div>
      </div> -->
  
      <div id="matakuliah-dialog" class="card shadow" style="width: 500px; display:none;">
        <div class="card-header app-card-header">Mata Kuliah</div>
        <div class="card-body">
          <form id="form-matakuliah" method="post" class="m-3">
            <div class="form-group row mb-2">
              <label for="input-kurikulum" class="col-4 col-form-label">Kurikulum</label>
              <div class="col-8">
                <select name="input-kurikulum" class="form-select input-kurikulum" aria-describedby="input-kurikulumHelpBlock" required="required"></select>
                <!-- <span id="input-kurikulumHelpBlock" class="form-text text-muted">Kurikulum Mata Kuliah</span> -->
              </div>
            </div>
            <div class="form-group row mb-2">
              <label for="input-prodi" class="col-4 col-form-label">Program Studi</label>
              <div class="col-8">
                <select name="input-prodi" class="form-select flex-shrink-1 input-prodi">
                  <option value="D3">D3 Kebidanan</option>
                  <option value="D3F">D3 Farmasi</option>
                  <option value="MIK">D4 Manajemen Informasi Kesehatan</option>
                  <option value="FIS">D4 Fisioterapi</option>
                </select>
                <!-- <span id="input-prodiHelpBlock" class="form-text text-muted">Kurikulum Mata Kuliah</span> -->
              </div>
            </div>
            <div class="form-group row mb-2">
              <label class="col-4 col-form-label" for="input-kdmk">Kode</label>
              <div class="col-8">
                <input id="input-kdmk" name="input-kdmk" placeholder="" type="text" class="form-control input-kdmk" aria-describedby="input-kdmkHelpBlock" required="required">
                <span id="input-kdmkHelpBlock" class="form-text text-muted">Contoh: BD401, BD203, atau BD504</span>
              </div>
            </div>
            <div class="form-group row mb-2">
              <label for="input-namamk" class="col-4 col-form-label">Nama</label>
              <div class="col-8">
                <input id="input-namamk" name="input-namamk" placeholder="" type="text" class="form-control input-namamk" required="required">
                <span id="input-namamkHelpBlock" class="form-text text-muted">Tuliskan secara Title Case, contoh: Pendidikan Pancasila</span>
              </div>
            </div>
            <div class="row mb-2">
              <label for="input-sks" class="col-4 col-form-label">SKS</label>
              <div class="col-8">
                <select id="input-sks" name="input-sks" class="form-select form-control-sm" aria-describedby="input-sksHelpBlock" required="required">
                  <option value="1">1 SKS</option>
                  <option value="2">2 SKS</option>
                  <option value="3">3 SKS</option>
                  <option value="4">4 SKS</option>
                  <option value="5">5 SKS</option>
                  <option value="6">6 SKS</option>
                  <option value="7">7 SKS</option>
                  <option value="8">8 SKS</option>
                </select>
                <span id="input-sksHelpBlock" class="form-text text-muted">Jumlah SKS matakuliah ini.</span>
              </div>
            </div>
            <div class="form-group row mb-2">
              <label for="input-mkname" class="col-4 col-form-label">Nama (English)</label>
              <div class="col-8">
                <input id="input-mkname" name="input-mkname" placeholder="" type="text" class="form-control" required="required">
                <span id="input-kodeHelpBlock" class="form-text text-muted">Tuliskan secara Title Case, contoh: Indonesian Language</span>
              </div>
            </div>
          </form>
          <hr>
          <div class="d-flex justify-content-between">
            <span>&nbsp;</span>
            <!-- <button class="btn-delete btn btn-danger text-light fw-normal me-5"><i class="bi bi-exclamation-triangle"></i> DELETE</button> -->
            <span>
              <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
              <button class="btn-save btn btn-success text-light fw-normal ms-2">Save</button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div id="matakuliah-detail" class="col-sm-12 col-md-6">
      <div class="card shadow-sm my-3">
        <div class="card-header">Mata Kuliah</div>
        <div class="card-body content">
          <em>Pilih salah satu matakuliah untuk melihat detail informasi matakuliah.</em>
        </div>
      </div>
    </div> -->
  </div>
</div>