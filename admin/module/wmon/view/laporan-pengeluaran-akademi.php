<div class="container mb-5">

  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-book mx-2 text-primary"></i> 
        Laporan Pengeluaran Akademi <small class="text-muted fw-light">Harian</small>
      </h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <form id="form-search">
        <div class="input-group mb-3">
          <label class="form-control border bg-secondary-subtle">Tanggal</label>
          <input type="text" id="input-tanggal" name="tanggal" class="form-control w-50 input-tanggal" placeholder="Tanggal"
            aria-label="Tanggal">
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
          <div class="invalid-feedback">Pilih tanggal laporan.</div>
        </div>
      </form>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <div id="list-transaksi" class="mb-3">
      </div>
      <div class="pagination-transaksi"></div>
    </div>
  </div>

</div>