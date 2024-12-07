<div class="container">
  <div class="row">
    <div class="col">
      <h3 class="m-5 mb-0"><i class="bi bi-123 text-primary me-2"></i> Kurikulum</h3>
    </div>
  </div>
  <div class="row">
    <div class="col m-5">


        <button class="btn btn-sm btn-success text-light mb-4" id="bt-new-kurikulum"><i class="bi bi-plus"></i> Kurikulum Baru</button>
  
          <form class="m-2" id="form-search">
            <div class="input-group mb-3">
              <input type="text" name="keyword" class="form-control input-keyword w-50" placeholder="Search keyword" aria-label="Keyword">
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
          
          <div class="kurikulum-list mb-3"></div>
          <div id="kurikulum-selection" class="mt-1 px-2 mb-3">
            <span class="badge rounded-pill bg-primary bt-select-all" role="button">Select All</span>
            <span class="badge rounded-pill bg-danger bt-unselect-all" role="button">Unselect All</span>
            with selected:
            <button class="btn btn-danger btn-sm bt-delete-selected text-light"><i class="bi bi-trash"></i> Delete</button>
          </div>
          <div class="kurikulum-pagination"></div>
  

  
      <div id="kurikulum-dialog" class="card shadow" style="width: 500px; display:none;">
        <div class="card-header app-card-header">Kurikulum</div>
        <div class="card-body">
          <form id="form-kurikulum" method="post" class="m-3">
            
            <div class="form-group row mb-2">
              <label class="col-4 col-form-label" for="input-tahun">Tahun</label>
              <div class="col-8">
                <input id="input-tahun" name="input-tahun" placeholder="" type="text" class="form-control input-tahun" aria-describedby="input-tahunHelpBlock" required="required">
                <span id="input-tahunHelpBlock" class="form-text text-muted">Tahun kurikulum. Contoh: 2015, 2024</span>
              </div>
            </div>
            
          </form>
          <hr>
          <div class="d-flex justify-content-between">
            <span>&nbsp;</span>
            <!-- <button class="btn-delete btn btn-danger text-light fw-normal me-5"><i class="bi bi-exclamation-triangle"></i> DELETE</button> -->
            <span>
              <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
              <button class="btn-save btn btn-success text-light fw-normal ms-2"><i class="bi bi-save me-2"></i> Save</button>
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>