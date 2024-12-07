<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-card-checklist mx-2 text-primary"></i> Kartu Hasil Studi</h3>
    </div>
  </div>

  <div class="row m-5 mb-4">
    <div class="col">
      <form id="form-search">
        <div class="input-group mb-3">
          <select id="input-prodi" name="input-prodi" style="width:200px;" class="form-select">
            <option value="D3">D3 Kebidanan</option>
            <option value="D3F">D3 Farmasi</option>
            <option value="MIK">D4 Manajemen Informasi Kesehatan</option>
            <option value="FIS">D4 Fisioterapi</option>
          </select>
          <select id="input-tahun" name="input-tahun" class="form-select"><select>
          <select id="input-semester" name="input-semester" class="form-select input-semester">
            <option value="1">Ganjil</option>
            <option value="2">Genap</option>
            <option value="3">Ganjil Pendek</option>
            <option value="4">Genap Pendek</option>
          </select>
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
    </div>
  </div>

  <div class="row m-5">
    <div class="col-md-5 col-sm-12">
      <h1 class="fs-4 fw-lighter my-3 text-secondary">Daftar Mahasiswa Pemrogram</h1>
      <div class="list-mahasiswa overflow-auto border rounded" id="list-mahasiswa" style="max-height:400px;"></div>
      <div id="mahasiswa-selection" class="mt-2 px-2 mb-3">
        <span class="badge rounded-pill bg-primary bt-select-all" role="button">Select All</span>
        <span class="badge rounded-pill bg-secondary bt-unselect-all" role="button">Unselect All</span>
        with selected:
        <button class="btn btn-primary btn-sm bt-print-selected text-light px-3 py-1"><i class="bi bi-printer"></i> Print</button>
      </div>
      <form method="post" id="cetak-khs-selected" target="_blank" class="mt-3"
        action="<?php echo $this->location('m/x/waka/print/khstahunakademikselected'); ?>">
        <input type="hidden" name="prodi">
        <input type="hidden" name="tahun">
        <input type="hidden" name="semester">
        <span class="selected"></span>
      </form>
    </div>
    <div class="col-md-7 col-sm-12">
      <h1 class="fs-4 fw-lighter my-3 text-secondary">KHS <small class="text-muted info-selected-khs"></small></h1>
      <div class="info-khs-mahasiswa p-4 border border-3 rounded bg-light py-3 mb-3"></div>
      <div id="list-matakuliah-khs" class="rounded-2 border border-1">&nbsp;</div>
      <form method="post" id="cetak-khs" target="_blank" class="mt-3"
        action="<?php echo $this->location('m/x/waka/print/khstahunakademik'); ?>">
        <input type="hidden" name="nrm">
        <input type="hidden" name="prodi">
        <input type="hidden" name="tahun">
        <input type="hidden" name="semester">
        <div class="mb-3 p-3 border rounded-2 bg-light text-end container-action-khs">
          <span class="btn btn-sm btn-success text-light bt-refresh"><i class="bi bi-arrow-repeat me-2"></i>
            Refresh</span>
          <span class="btn btn-sm btn-primary bt-print-khs">
            <i class="bi bi-printer me-2"></i> Cetak KHS
          </span>
        </div>
      </form>
    </div>
  </div>
</div>
