<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-tags-fill mx-2 text-primary"></i> Penawaran Matakuliah Semester</h3>
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
          <select id="input-tahun" name="input-tahun" class="form-select"></select>
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
    <div class="col">
      <h6>Matakuliah Ditawarkan</h6>
      <div class="list-matakuliah-ditawarkan mb-3"></div>
      <div class="pagination-matakuliah-ditawarkan"></div>
    </div>
  </div>
  <div class="row m-5">
    <form id="form-matakuliah-tidak-ditawarkan" method="post" class="col">
      <h6>Matakuliah Tidak Ditawarkan</h6>
      <div class="input-group my-3">
        <label class="input-group-text">Kurikulum</label> 
        <select id="input-kurikulum" name="input-kurikulum" class="form-select input-kurikulum"></select>
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
      <div class="list-matakuliah-tidak-ditawarkan mb-3"></div>
      <div class="pagination-matakuliah-tidak-ditawarkan"></div>
    </form>
  </div>
</div>
