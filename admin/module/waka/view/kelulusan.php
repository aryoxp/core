<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-mortarboard-fill mx-2 text-primary"></i> Kelulusan</h3>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <form class="form" id="form-search">
        <div class="input-group mb-3">
          <input type="text" name="keyword" class="form-control w-50 input-keyword"
            placeholder="Masukkan Nama, NIM, atau NRM" aria-label="Keyword">
          <button class="btn btn-secondary bt-search"><i class="bi bi-search"></i></button>
          <div class="invalid-feedback">Gunakan keyword dengan panjang minimal 3 karakter.</div>
        </div>
        <div class="ms-3 text-muted">Mahasiswa yang belum memiliki NRM dan NIM tidak ditampilkan.</div>
      </form>
    </div>
  </div>

  <div class="row m-5">
    <div class="col overflow-auto" style="max-height:400px;">
      <table class="table">
        <thead>
          <tr class="bg-light" style="position:sticky;top:0;">
            <!-- <th>NRM</th> -->
            <th>NIM</th>
            <th>Nama (Program Studi)</th>
            <th>Tempat Lahir</th>
            <th>Lahir</th>
            <th>Masuk</th>
            <th>Lulus</th>
            <th>SKS</th>
            <th>IPK</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody class="list-mahasiswa overflow-auto" id="list-mahasiswa" style="max-height:400px;">
        </tbody>
      </table>
    </div>
  </div>

  <div class="row m-5">
    <div class="col">
      <div id="selected-mahasiswa"
        class="px-4 border border-primary rounded bg-primary-subtle d-flex justify-content-between align-items-center">
      </div>
    </div>
  </div>

  <div class="row m-5">
    <div class="col-md-5 col-sm-12">
      <h1 class="fs-4 fw-lighter my-3 text-secondary">Mahasiswa Lulus</h1>
      <div id="list-mahasiswa-lulus" class="rounded-2 border border-1 mb-3 overflow-auto" style="max-height: 300px;"></div>
      <div id="lulus-selection" class="mt-1 px-2 my-3">
        <span class="badge rounded-pill bg-primary bt-select-all" role="button">Select All</span>
        <span class="badge rounded-pill bg-danger bt-unselect-all" role="button">Unselect All</span>
        with selected:
        <button class="btn btn-success btn-sm bt-daftarkan text-light">Daftarkan <i class="bi bi-box-arrow-in-right"></i></button>
      </div>
    </div>
    <div class="col-md-7 col-sm-12">
      <h1 class="fs-4 fw-lighter my-3 text-secondary">Wisuda</h1>
      <form method="post" id="wisuda" class="mb-3">
        <div class="input-group">
          <select name="tgwisuda" class="form-select"></select>
          <button class="btn btn-success text-light bt-refresh-tgwisuda"><i class="bi bi-arrow-clockwise"></i></button>
          <button class="btn btn-danger text-light bt-delete-tgwisuda"><i class="bi bi-x-lg"></i></button>
          <input type="text" name="tgwisuda" class="form-control"/>
          <button class="btn btn-success text-light bt-create-tgwisuda"><i class="bi bi-plus-lg"></i></button>
        </div>
      </form>
      <div id="list-mahasiswa-wisuda" class="rounded-2 border border-1 mb-3 overflow-auto" style="max-height: 300px;"></div>
      <div id="wisuda-selection" class="mt-1 px-2 my-3">
        <span class="badge rounded-pill bg-primary bt-select-all" role="button">Select All</span>
        <span class="badge rounded-pill bg-danger bt-unselect-all" role="button">Unselect All</span>
        with selected:
        <button class="btn btn-danger btn-sm bt-keluarkan text-light"><i class="bi bi-box-arrow-left"></i> Keluarkan</button>
      </div>
      <form method="post" id="print-transkrip-ijazah" target="_blank">
        <div class="mb-3 p-3 border rounded-2 bg-light text-end container-action-print">
          <span class="btn btn-sm btn-primary bt-print-transkrip"><i class="bi bi-printer me-2"></i>
            Cetak Transkrip</span>
          <span class="btn btn-sm btn-primary bt-print-ijazah"><i class="bi bi-printer me-2"></i>
            Cetak ijazah</span>
        </div>
      </form>
    </div>
  </div>
</div>

<form id="akademik" method="post" class="bg-white p-4 border rounded shadow" style="display:none;">
  <input type="hidden" name="nrm" />
  <h4 class="info-nrm mb-3">NRM</h4>
  <div class="row mb-2">
    <label for="input-namam" class="col-2 col-form-label">Nama Lengkap</label>
    <div class="col-10">
      <div class="input-group">
        <input id="input-namam" name="namam" type="text" class="form-control" aria-describedby="input-namamHelpBlock">
        <button class="btn btn-success text-light bt-save">
          <i class="bi bi-floppy"></i>
        </button>
      </div>
      <span id="input-namamHelpBlock" class="form-text text-muted">Nama lengkap tanpa gelar, sesuai ijazah sebelumnya.</span>
    </div>
  </div>
  <div class="row mb-2">
    <label class="col-2 col-form-label" for="input-nim">NIM</label>
    <div class="col-4">
      <div class="input-group">
        <input id="input-nim" name="nim" type="text" class="form-control">
        <button class="btn btn-success text-light bt-save">
          <i class="bi bi-floppy"></i>
        </button>
      </div>
    </div>
    <label for="input-tgmasuk" class="col-2 col-form-label">Tanggal Masuk</label>
    <div class="col-4">
      <div class="input-group">
        <input id="input-tgmasuk" name="tgmasuk" type="text" aria-describedby="input-tgmasukHelpBlock"
          class="form-control">
        <button class="btn btn-success text-light bt-save"><i class="bi bi-floppy"></i></button>
        <button class="btn btn-danger text-light bt-clear"><i class="bi bi-eraser"></i></button>
      </div>
      <span id="input-tgmasukHelpBlock" class="form-text text-muted">Tanggal masuk diterima</span>
    </div>
  </div>
  <div class="row mb-2">
    <label for="input-status" class="col-2 col-form-label">Status</label>
    <div class="col-4">
      <div class="input-group">
        <select id="input-status" name="status" class="form-select">
          <option value="0">Calon Mahasiswa Baru</option>
          <option value="1">Aktif</option>
          <option value="2">Lulus</option>
          <option value="3">Mengundurkan Diri</option>
          <option value="4">Pindah</option>
        </select>
        <button class="btn btn-success text-light bt-save">
          <i class="bi bi-floppy"></i>
        </button>
      </div>
    </div>
    <label for="input-tglulus" class="col-2 col-form-label">Tanggal Lulus</label>
    <div class="col-4">
      <div class="input-group">
        <input id="input-tglulus" name="tglulus" type="text" class="form-control"
          aria-describedby="input-tglulusHelpBlock">
        <button class="btn btn-success text-light bt-save"><i class="bi bi-floppy"></i></button>
        <button class="btn btn-danger text-light bt-clear"><i class="bi bi-eraser"></i></button>
      </div>
      <span id="input-tglulusHelpBlock" class="form-text text-muted">Tanggal dinyatakan lulus</span>
    </div>
  </div>

  <div class="row mb-2">
    <label for="input-tplahir" class="col-2 col-form-label">Tempat Lahir</label>
    <div class="col-4">
      <div class="input-group">
        <input id="input-tplahir" name="tplahir" type="text" class="form-control"
          aria-describedby="input-tplahirHelpBlock">
        <button class="btn btn-success text-light bt-save">
          <i class="bi bi-floppy"></i>
        </button>
      </div>
      <span id="input-tplahirHelpBlock" class="form-text text-muted">Tempat/Kota Kelahiran</span>
    </div>
    <label for="input-tglahir" class="col-2 col-form-label">Tanggal Lahir</label>
    <div class="col-4">
      <div class="input-group">
        <input id="input-tglahir" name="tglahir" type="text" class="form-control"
          aria-describedby="input-tglahirHelpBlock" data-date-format="yyyy-mm-dd">
        <button class="btn btn-success text-light bt-save"><i class="bi bi-floppy"></i></button>
        <button class="btn btn-danger text-light bt-clear"><i class="bi bi-eraser"></i></button>
      </div>
      <span id="input-tglahirHelpBlock" class="form-text text-muted">Tanggal kelahiran</span>
    </div>
  </div>
  <div class="row">
    <div class="col-6">
      <div class="form-floating">
        <textarea id="input-judulta" name="judulta" cols="40" class="form-control"
          aria-describedby="input-judultaHelpBlock" style="height:100px;"></textarea>
        <label for="input-judulta" class="">Judul Tugas Akhir</label>
      </div>
      <div class="text-end my-2">
        <button class="btn btn-success text-light bt-save">
          <i class="bi bi-floppy"></i> Save
        </button>
      </div>
    </div>
    <div class="col-6">
      <div class="form-floating">
        <textarea id="input-abstrakta" name="abstrakta" cols="40" class="form-control"
          aria-describedby="input-abstraktaHelpBlock" style="height:100px;"></textarea>
        <label for="input-abstrakta" class="">Abstrak Tugas Akhir</label>
      </div>
      <div class="text-end my-2">
        <button class="btn btn-success text-light bt-save">
          <i class="bi bi-floppy"></i> Save
        </button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col text-end">
      <hr>
      <button class="btn btn-outline-secondary border bt-close">Close</button>
    </div>
  </div>
</form>

<!-- <div id="nim-dialog" class="card shadow" style="width: 500px; display:none;">
  <div class="card-header app-card-header">NIM Mahasiswa</div>
  <div class="card-body">
    <form>
      
      <div class="row mb-2">
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