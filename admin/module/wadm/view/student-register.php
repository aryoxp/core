<div class="container">

  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-person-plus-fill me-2 text-primary"></i> Pendaftaran Mahasiswa</h3>
    </div>
  </div>

  <form id="form-registrasi" class="needs-validation" novalidate>
    <div class="row m-5">
      <div class="col">
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Program</h1>
        <hr>
        <div class="form-group row mb-4">
          <label for="input-angkatan" class="col-4 col-form-label text-primary">Tahun Angkatan</label>
          <div class="col-8">
            <input id="input-angkatan" name="input-angkatan" type="text" class="form-control" required="required">
            <div class="invalid-feedback">Masukkan tahun angkatan.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label class="col-4 col-form-label text-primary">Program Studi</label>
          <div class="col-8">
            <div class="form-check">
              <input name="input-prodi" id="input-prodi_0" type="radio" class="form-check-input" value="D3"
                required="required">
              <label for="input-prodi_0" class="form-check-label">D3 Kebidanan</label>
            </div>
            <div class="form-check">
              <input name="input-prodi" id="input-prodi_1" type="radio" class="form-check-input" value="D3F"
                required="required">
              <label for="input-prodi_1" class="form-check-label">D3 Farmasi</label>
            </div>
            <div class="form-check">
              <input name="input-prodi" id="input-prodi_2" type="radio" class="form-check-input" value="MIK"
                required="required">
              <label for="input-prodi_2" class="form-check-label">D4 Manajemen Informasi Kesehatan</label>
            </div>
            <div class="form-check">
              <input name="input-prodi" id="input-prodi_3" type="radio" required="required" class="form-check-input"
                value="FIS">
              <label for="input-prodi_3" class="form-check-label">D4 Fisioterapi</label>
              <div class="invalid-feedback">Pilih program studi.</div>
            </div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label class="col-4 text-primary">Semester</label>
          <div class="col-8">
            <div class="form-check form-check-inline">
              <input name="input-semester" id="input-semester_0" type="radio" required="required"
                class="form-check-input" value="1">
              <label for="input-semester_0" class="form-check-label">Ganjil</label>
            </div>
            <div class="form-check form-check-inline">
              <input name="input-semester" id="input-semester_1" type="radio" required="required"
                class="form-check-input" value="2">
              <label for="input-semester_1" class="form-check-label">Genap</label>
            </div>
            <input type="radio" name="input-semester" class="d-none" required>
            <div class="invalid-feedback">Masukkan semester masuk.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-paket" class="col-4 col-form-label text-primary">Paket Pendidikan</label>
          <div class="col-8">
            <select id="input-paket" name="input-paket" class="form-select" aria-describedby="input-paketHelpBlock">
              <option value="0">D3</option>
              <option value="1">D3 Kebidanan dan D4 Bidan Pendidik</option>
              <option value="9" selected="selected">Reguler</option>
            </select>
            <span id="input-paketHelpBlock" class="form-text text-muted">Paket Pendidikan</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label class="col-4 text-primary">Tingkat Sekolah Asal</label>
          <div class="col-8">
            <div class="form-check form-check-inline">
              <input name="input-tingkatasal" id="input-tingkatasal_0" type="radio" class="form-check-input" value="0"
                required="required">
              <label for="input-tingkatasal_0" class="form-check-label">SMA/SPK/Sederajat</label>
            </div>
            <div class="form-check form-check-inline">
              <input name="input-tingkatasal" id="input-tingkatasal_1" type="radio" class="form-check-input" value="1"
                required="required">
              <label for="input-tingkatasal_1" class="form-check-label">P2B/D1</label>
            </div>
            <input type="radio" name="input-tingkatasal" class="d-none" required>
            <div class="invalid-feedback">Pilih tingkat sekolah asal.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="select" class="col-4 col-form-label text-primary">Gelombang Pendaftaran</label>
          <div class="col-8">
            <select id="input-gelombang" name="select" class="form-select">
              <option value="0">Gelombang 0</option>
              <option value="1" selected="selected">Gelombang 1</option>
              <option value="2">Gelombang 2</option>
              <option value="3">Gelombang 3</option>
              <option value="4">Gelombang 4</option>
            </select>
            <div class="invalid-feedback">Pilih gelombang pendaftaran.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-status" class="col-4 col-form-label text-primary">Status</label>
          <div class="col-8">
            <select id="input-status" name="input-status" class="form-select" aria-describedby="input-statusHelpBlock">
              <option value="0">Calon Mahasiswa Baru</option>
              <option value="1">Aktif</option>
              <option value="2">Lulus</option>
              <option value="3">Keluar</option>
              <option value="4">Pindah</option>
              <option value="5">Transfer dari Luar</option>
            </select>
            <span id="input-statusHelpBlock" class="form-text text-muted">Status pendaftaran mahasiswa</span>
            <div class="invalid-feedback">Pilih status mahasiswa.</div>
          </div>
        </div>

        <h1 class="fs-4 fw-lighter my-3 text-secondary">Identitas Diri</h1>
        <hr>
        <div class="form-group row mb-4">
          <label class="col-4 col-form-label text-primary" for="input-nama">Nama</label>
          <div class="col-8">
            <input id="input-nama" name="input-nama" type="text" class="form-control"
              aria-describedby="input-namaHelpBlock" required="required">
            <span id="input-namaHelpBlock" class="form-text text-muted">Nama (calon) mahasiswa dituliskan dengan
              Title Case <br /> Samakan ejaan dengan nama yang tertera pada ijazah sekolah sebelumnya. <br>Contoh:
              Natalie Nusantara Hore</span>
            <div class="invalid-feedback">Nama mahasiswa harus diisi.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-tplahir" class="col-4 col-form-label text-primary">Tempat/Tanggal Lahir</label>
          <div class="col-8">
            <div class="input-group">
              <input id="input-tplahir" name="input-tplahir" type="text" class="form-control" required="required">
              <input id="input-tglahir" name="input-tglahir" type="text" class="form-control" required="required">
              <div class="invalid-feedback">Tempat dan tanggal lahir harus diisi.</div>
            </div>
            <div class="text-end">
              <span id="input-namaHelpBlock" class="form-text text-muted">Format tanggal lahir: dd/mm/yyyy</span>
            </div>
          </div>
        </div>

        <div class="form-group row mb-4">
          <label for="input-nikpaspor" class="col-4 col-form-label text-primary">NIK/No. Paspor</label>
          <div class="col-8">
            <input id="input-nikpaspor" name="input-nikpaspor" type="text" class="form-control"
              aria-describedby="input-nikpasporHelpBlock" required="required">
            <div class="invalid-feedback">NIK atau nomor paspor harus diisi.</div>
            <span id="input-nikpasporHelpBlock" class="form-text text-muted">NIK atau Nomor Paspor</span>
          </div>
        </div>

      </div>
      <div class="border rounded p-3 bg-light text-end">
        <button class="btn btn-primary" type="submit">Submit Form</button>
      </div>
    </div>
  </form>
</div>