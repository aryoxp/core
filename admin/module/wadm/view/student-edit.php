<div class="container mb-5">

  <div class="row">
    <div class="col">
      <h3 class="mt-4 mx-3"><i class="bi bi-person-fill mx-2 text-primary"></i> Data Mahasiswa</h3>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-12 col-md-8 mx-5">

      <form method="post" id="form-identitas-diri" class="needs-validation" novalidate>
        <h1 class="fs-4 fw-lighter my-3 text-danger" id="input-nrm" data-nrm="<?php echo $mahasiswa->nrm; ?>">NRM <?php echo $mahasiswa->nrm; ?></h1>
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Identitas Diri</h1><hr>
        <div class="form-group row mb-4">
          <label class="col-4 col-form-label text-primary" for="input-nama">Nama</label>
          <div class="col-8">
            <input id="input-nama" name="input-nama" type="text" class="form-control"
              aria-describedby="input-namaHelpBlock" required="required">
            <span id="input-namaHelpBlock" class="form-text text-muted">Nama (calon) mahasiswa dituliskan dengan
              Title Case <br/> Samakan ejaan dengan nama yang tertera pada ijazah sekolah sebelumnya. <br>Contoh: Natalie Nusantara Hore</span>
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
          <label class="col-4 text-primary">Golongan Darah</label>
          <div class="col-8">
            <div class="form-check form-check-inline">
              <input name="input-goldarah" id="input-goldarah_0" type="radio" class="form-check-input"
                value="A" required="required">
              <label for="input-goldarah_0" class="form-check-label">A</label>
            </div>
            <div class="form-check form-check-inline">
              <input name="input-goldarah" id="input-goldarah_1" type="radio" class="form-check-input"
                value="B" required="required">
              <label for="input-goldarah_1" class="form-check-label">B</label>
            </div>
            <div class="form-check form-check-inline">
              <input name="input-goldarah" id="input-goldarah_2" type="radio" class="form-check-input"
                value="AB" required="required">
              <label for="input-goldarah_2" class="form-check-label">AB</label>
            </div>
            <div class="form-check form-check-inline">
              <input name="input-goldarah" id="input-goldarah_3" type="radio" class="form-check-input"
                value="O" required="required">
              <label for="input-goldarah_3" class="form-check-label">O</label>
            </div>
            <input name="input-goldarah" type="radio" class="d-none" required="required">
            <div class="invalid-feedback">Golongan darah harus dipilih.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-kdagama" class="col-4 col-form-label text-primary">Agama</label>
          <div class="col-8">
            <select id="input-kdagama" name="input-kdagama" class="form-select" required="required"></select>
            <div class="invalid-feedback">Agama harus dipilih.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label class="col-4 text-primary">Status Pernikahan</label>
          <div class="col-8">
            <div class="form-check form-check-inline">
              <input name="input-statnikah" id="input-statnikah_0" type="radio" class="form-check-input"
                value="0" required="required">
              <label for="input-statnikah_0" class="form-check-label">Belum Menikah</label>
            </div>
            <div class="form-check form-check-inline">
              <input name="input-statnikah" id="input-statnikah_1" type="radio" class="form-check-input"
                value="1" required="required">
              <label for="input-statnikah_1" class="form-check-label">Menikah</label>
            </div>
            <input name="input-statnikah" type="radio" class="d-none" required="required">
            <div class="invalid-feedback">Status pernikahan harus dipilih.</div>
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
        <div class="form-group row mb-4">
          <label for="input-telp" class="col-4 col-form-label text-primary">Nomor telepon/HP</label>
          <div class="col-8">
            <input id="input-telp" name="input-telp" type="text" class="form-control"
              aria-describedby="input-telpHelpBlock" required="required">
            <div class="invalid-feedback">Nomor telepon atau HP harus diisi.</div>
            <span id="input-telpHelpBlock" class="form-text text-muted">Nomor telepon atau HP mahasiswa</span>
          </div>
        </div>
        <div class="my-5 p-3 border rounded-2 bg-light text-end">
          <button class="btn btn-sm btn-primary bt-update">
            <i class="bi bi-list"></i><i class="bi bi-check-lg"></i> Update
          </button>
        </div>
      </form>

      <form method="post" id="form-alamat" class="needs-validation" novalidate>
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Alamat</h1><hr>
        <h2 class="fs-5 fw-lighter my-3 text-secondary">Asal Daerah</h2>
        <div class="form-group row mb-4">
          <label for="input-alamatasal" class="col-4 col-form-label text-primary">Alamat Asal Daerah</label> 
          <div class="col-8">
            <textarea id="input-alamatasal" name="input-alamatasal" cols="40" rows="3" class="form-control" style="height:100px;" aria-describedby="input-alamatasalHelpBlock"></textarea> 
            <span id="input-alamatasalHelpBlock" class="form-text text-muted">Isikan dengan alamat lengkap asal daerah, tanpa Kota/Kabupaten dan Propinsi</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-propasal" class="col-4 col-form-label text-primary">Propinsi Asal Daerah</label> 
          <div class="col-8">
            <select id="input-propasal" name="input-propasal" class="form-select" aria-describedby="input-propasalHelpBlock"></select> 
            <span id="input-propasalHelpBlock" class="form-text text-muted">Pilih propinsi asal daerah</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-kotaasal" class="col-4 col-form-label text-primary">Kota/Kabupaten Asal Daerah</label> 
          <div class="col-8">
            <select id="input-kotaasal" name="input-kotaasal" class="form-select" aria-describedby="input-kotaasalHelpBlock"></select> 
            <span id="input-kotaasalHelpBlock" class="form-text text-muted">Pilih kota asal daerah</span>
          </div>
        </div> 
        <hr>
        <h2 class="fs-5 fw-lighter my-3 text-secondary">Alamat Tinggal di Malang</h2>
        <div class="form-group row mb-4">
          <label for="input-alamat" class="col-4 col-form-label text-primary">Alamat di Malang</label> 
          <div class="col-8">
            <textarea id="input-alamat" name="input-alamat" cols="40" rows="3" class="form-control" style="height:100px;" aria-describedby="input-alamatasalHelpBlock"></textarea> 
            <span id="input-alamatHelpBlock" class="form-text text-muted">Isikan dengan alamat tinggal lengkap di area Malang, tanpa Kota/Kabupaten dan Propinsi</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-prop" class="col-4 col-form-label text-primary">Propinsi</label> 
          <div class="col-8">
            <select id="input-prop" name="input-prop" class="form-select" aria-describedby="input-propHelpBlock" disabled></select> 
            <span id="input-propHelpBlock" class="form-text text-muted">Pilih propinsi Jawa Timur</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-kota" class="col-4 col-form-label text-primary">Kota/Kabupaten di Malang</label> 
          <div class="col-8">
            <select id="input-kota" name="input-kota" class="form-select" aria-describedby="input-kotaHelpBlock"></select> 
            <span id="input-kotaHelpBlock" class="form-text text-muted">Pilih kota di Area Malang</span>
          </div>
        </div> 
        <div class="my-5 p-3 border rounded-2 bg-light text-end">
          <button class="btn btn-sm btn-primary">
            <i class="bi bi-list"></i><i class="bi bi-check-lg"></i> Update
          </button>
        </div>
      </form>

      <form method="post" id="form-sekolah-asal" class="needs-validation" novalidate>
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Sekolah Asal</h1><hr>
        <div class="form-group row mb-4">
          <label for="input-propsekolah" class="col-4 col-form-label text-primary">Propinsi Sekolah Asal Daerah</label> 
          <div class="col-8">
            <select id="input-propsekolah" name="input-propsekolah" class="form-select" aria-describedby="input-propsekolahHelpBlock"></select> 
            <span id="input-propsekolahHelpBlock" class="form-text text-muted">Pilih propinsi sekolah asal daerah</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-kotasekolah" class="col-4 col-form-label text-primary">Kota/Kabupaten Asal Daerah</label> 
          <div class="col-8">
            <select id="input-kotasekolah" name="input-kotasekolah" class="form-select" aria-describedby="input-kotasekolahHelpBlock"></select> 
            <span id="input-kotasekolahHelpBlock" class="form-text text-muted">Pilih kota sekolah asal daerah</span>
          </div>
        </div> 
        <div class="form-group row mb-4">
          <label for="input-asalsekolah" class="col-4 col-form-label text-primary">Nama Sekolah</label> 
          <div class="col-8">
            <input id="input-asalsekolah" name="input-asalsekolah" type="text" class="form-control">
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-jurusan" class="col-4 col-form-label text-primary">Jurusan</label> 
          <div class="col-8">
            <input id="input-jurusan" name="input-jurusan" type="text" class="form-control">
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-thlulus" class="col-4 col-form-label text-primary">Tahun Kelulusan</label> 
          <div class="col-8">
            <input id="input-thlulus" name="input-thlulus" type="text" class="form-control">
          </div>
        </div>
        <div class="my-5 p-3 border rounded-2 bg-light text-end">
          <button class="btn btn-sm btn-primary bt-update">
            <i class="bi bi-list"></i><i class="bi bi-check-lg"></i> Update
          </button>
        </div>
      </form>

      <form method="post" id="form-ortu" class="needs-validation" novalidate>
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Orang Tua/Wali</h1><hr>
        <div class="form-group row mb-4">
          <label for="input-namaortu" class="col-4 col-form-label text-primary">Nama Lengkap</label> 
          <div class="col-8">
            <input id="input-namaortu" name="input-namaortu" type="text" class="form-control">
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-pekerjaanortu" class="col-4 col-form-label text-primary">Pekerjaan</label> 
          <div class="col-8">
            <input id="input-pekerjaanortu" name="input-pekerjaanortu" type="text" class="form-control">
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-telportu" class="col-4 col-form-label text-primary">Nomor Telepon/HP</label> 
          <div class="col-8">
            <input id="input-telportu" name="input-telportu" type="text" class="form-control">
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-alamatortu" class="col-4 col-form-label text-primary">Alamat</label> 
          <div class="col-8">
            <textarea id="input-alamatortu" name="input-alamatortu" cols="40" rows="3" style="height:100px" class="form-control" aria-describedby="input-alamatortuHelpBlock"></textarea> 
            <span id="input-alamatortuHelpBlock" class="form-text text-muted">Masukkan alamat lengkap orang tua/wali beserta informasi Kota/Kabupaten, Propinsi, dan Kode Pos untuk kepentingan surat menyurat.</span>
          </div>
        </div> 
        <div class="my-5 p-3 border rounded-2 bg-light text-end">
          <button class="btn btn-sm btn-primary bt-update">
            <i class="bi bi-list"></i><i class="bi bi-check-lg"></i> Update
          </button>
        </div>
      </form>

      <form method="post" id="form-program" class="needs-validation" novalidate>
        <fieldset disabled>
          <h1 class="fs-4 fw-lighter my-3 text-secondary">Program</h1><hr>
          <div class="form-group row mb-4">
            <label for="input-angkatan" class="col-4 col-form-label text-primary">Tahun Angkatan</label>
            <div class="col-8">
              <input id="input-angkatan" name="input-angkatan" type="text" class="form-control" required="required" disabled>
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
                <input name="input-prodi" id="input-prodi_3" type="radio" required="required"
                  class="form-check-input" value="FIS">
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
                  class="form-check-input" value="1" disabled>
                <label for="input-semester_0" class="form-check-label">Ganjil</label>
              </div>
              <div class="form-check form-check-inline">
                <input name="input-semester" id="input-semester_1" type="radio" required="required"
                  class="form-check-input" value="2" disabled>
                <label for="input-semester_1" class="form-check-label">Genap</label>
              </div>
              <input type="radio" name="input-semester" class="d-none" required>
              <div class="invalid-feedback">Masukkan semester masuk.</div>
            </div>
          </div>
          <div class="form-group row mb-4">
            <label for="input-paket" class="col-4 col-form-label text-primary">Paket Pendidikan</label>
            <div class="col-8">
              <select id="input-paket" name="input-paket" class="form-select" aria-describedby="input-paketHelpBlock" disabled>
                <option value="0">D3</option>
                <option value="1">D3 Kebidanan dan D4 Bidan Pendidik</option>
                <option value="9">Reguler</option>
              </select>
              <span id="input-paketHelpBlock" class="form-text text-muted">Paket Pendidikan</span>
            </div>
          </div>
          <div class="form-group row mb-4">
            <label class="col-4 text-primary">Tingkat Sekolah Asal</label>
            <div class="col-8">
              <div class="form-check form-check-inline">
                <input name="input-tingkatasal" id="input-tingkatasal_0" type="radio" class="form-check-input"
                  value="0" required="required" disabled>
                <label for="input-tingkatasal_0" class="form-check-label">SMA/SPK/Sederajat</label>
              </div>
              <div class="form-check form-check-inline">
                <input name="input-tingkatasal" id="input-tingkatasal_1" type="radio" class="form-check-input"
                  value="1" required="required" disabled>
                <label for="input-tingkatasal_1" class="form-check-label">P2B/D1</label>
              </div>
              <input type="radio" name="input-tingkatasal" class="d-none" required>
              <div class="invalid-feedback">Pilih tingkat sekolah asal.</div>
            </div>
          </div>
          <div class="form-group row mb-4">
            <label for="select" class="col-4 col-form-label text-primary">Gelombang Pendaftaran</label>
            <div class="col-8">
              <select id="input-gelombang" name="input-gelombang" class="form-select">
                <option value="0">Gelombang 0</option>
                <option value="1">Gelombang 1</option>
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
              <select id="input-status" name="input-status" class="form-select"
                aria-describedby="input-statusHelpBlock">
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
        </fieldset>
        <div class="my-5 p-3 border rounded-2 bg-light text-end">
          <span class="btn btn-sm btn-warning bt-enable-edit"><i class="bi bi-pencil-fill"></i> Edit</span>
          <button class="btn btn-sm btn-primary bt-update disabled">
            <i class="bi bi-list"></i><i class="bi bi-check-lg"></i> Update
          </button>
        </div>
      </form>

      <form method="post" id="form-pembayaran-pendaftaran" class="needs-validation" novalidate>
        <fieldset disabled>
          <h1 class="fs-4 fw-lighter my-3 text-secondary">Pembayaran Biaya Pendaftaran</h1><hr>
          <div class="form-group row mb-4">
            <label for="input-kakunkredit" class="col-4 col-form-label text-primary">Akun Kredit</label>
            <div class="col-8">
              <select id="input-kakunkredit" name="input-kakunkredit" class="form-select" aria-describedby="input-kakunkreditHelpBlock" disabled="disabled"></select>
              <!-- <span id="input-kakunkreditHelpBlock" class="form-text text-muted my-2 d-block">Jenis Transaksi</span> -->
            </div>
          </div>
          <div class="form-group row mb-4">
            <label for="input-kakundebit" class="col-4 col-form-label text-primary">Akun Debit</label>
            <div class="col-8">
              <select id="input-kakundebit" name="input-kakundebit" class="form-select" aria-describedby="input-kakundebitHelpBlock">
              </select>
              <span id="input-kakundebitHelpBlock" class="form-text text-muted my-2 d-block">Pilih jenis kas tujuan pembayaran. Jika pembayaran biaya pendaftaran dilakukan secara transfer melalui Bank, maka pilih akun debit Bank yang dituju.</span>
            </div>
          </div>
          <div class="form-group row mb-4">
            <label for="input-keterangan" class="col-4 col-form-label text-primary">Catatan/Keterangan</label> 
            <div class="col-8">
              <textarea id="input-keterangan" style="height:70px;" name="input-keterangan" type="number" class="form-control"></textarea>
            </div>
          </div>
          <div class="form-group row mb-4">
            <label for="input-nominal" class="col-4 col-form-label text-primary">Nominal Pembayaran</label> 
            <div class="col-8">
              <input id="input-nominal" name="input-nominal" type="number" class="form-control">
              <div id="input-terbilang" class="text-danger my-2 mx-2"></div>
            </div>
          </div>
        </fieldset>
        <div class="mb-5 p-3 border rounded-2 bg-light text-end container-action-transaksi">
          <span class="btn btn-sm btn-secondary bt-print-kuitansi" style="display:none"><i class="bi bi-printer"></i> Cetak Bukti Pembayaran</span>
          <span class="btn btn-sm btn-warning bt-enable-edit"><i class="bi bi-pencil-fill"></i> Edit</span>
          <button class="btn btn-sm btn-primary bt-bayar disabled">
            <i class="bi bi-list"></i><i class="bi bi-check-lg"></i> Bayar
          </button>
        </div>
      </form>  

    </div>
  </div>
</div>
