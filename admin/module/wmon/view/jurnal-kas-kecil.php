<div class="container mb-5">

  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-book mx-2 text-primary"></i> 
        Jurnal Kas Kecil <small class="text-muted fw-light">Bulanan</small>
      </h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <form id="form-search">
        <div class="input-group mb-3">
          <label class="form-control border me-auto bg-secondary-subtle">Bulan</label>
          <select name="bulan" class="form-select input-bulan">
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
          <select name="tahun" class="form-select input-tahun"></select>
          <select name="perpage" class="form-select flex-shrink-1 input-perpage border-primary">
            <option value="1">1</option>
            <option value="5" selected="">5</option>
            <option value="10">10</option>
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

  <div class="row m-5">
    <form id="form-print" method="post" target="_blank" class="col">
      <input type="hidden" name="bulan">
      <input type="hidden" name="tahun">
      <input type="hidden" name="col">
      <input type="hidden" name="order">
      <div class="border rounded bg-light p-3 text-end">
        <button class="btn btn-primary bt-print"><i class="bi bi-printer"></i> Print</button>
      </div>
    </form>
  </div>

</div>