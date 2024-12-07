<div class="container mb-5">

  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-book mx-2 text-primary"></i> 
        Buku Besar <small class="text-muted fw-light">Periode</small>
      </h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <form id="form-search">
        <div class="input-group mb-3">
          <select name="kode" class="form-select"></select>
          <input type="text" name="tgmulai" class="form-control">
          <input type="text" name="tgsampai" class="form-control">
          <button class="btn btn-secondary bt-search"><i class="bi bi-search"></i></button>
          <div class="invalid-feedback">Pilih tanggal laporan.</div>
        </div>
      </form>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <div id="list-transaksi" class="mb-3 overflow-auto" style="max-height: 400px;">
      </div>
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