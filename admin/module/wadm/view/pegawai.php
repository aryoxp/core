<div class="container">
  <div class="row m-5">
    <div class="col">

      <h3 class="mb-4"><i class="bi bi-people-fill text-primary me-2"></i> Pegawai</h3>

      <form id="form-search" class="mb-3">
        <div class="input-group mb-3">
          <input type="text" name="keyword" class="form-control w-50 input-keyword" placeholder="Search keyword"
            aria-label="Keyword">
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
        <div class="pegawai-list mb-3"></div>
        <div class="pegawai-pagination"></div>
      </form>


      <div class="p-3 border rounded bg-light text-end">
        <span class="btn btn-sm btn-primary bt-print"><i class="bi bi-printer"></i> Print</span>
      </div>


    </div>
  </div>
</div>