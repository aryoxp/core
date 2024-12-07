<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-person-fill mx-2 text-primary"></i> Data Pegawai</h3>
    </div>
  </div>
  <div class="row m-5">
    <div class="col">
      <form method="post" id="form-identitas-diri" class="needs-validation" novalidate>
        <h1 class="fs-4 fw-lighter my-3 text-danger" id="input-nip" data-nip="<?php echo $pegawai->nip; ?>">NIP
          <?php echo $pegawai->nip; ?></h1>
        <h1 class="fs-4 fw-lighter my-3 text-secondary">Identitas Diri</h1>
        <hr>
        <div class="form-group row mb-4">
          <label class="col-4 col-form-label text-primary" for="input-nama">Nama</label>
          <div class="col-8">
            <input id="input-nama" name="input-nama" type="text" class="form-control"
              aria-describedby="input-namaHelpBlock" required="required">
            <span id="input-namaHelpBlock" class="form-text text-muted">Nama pegawai. Contoh: Natalie Nusantara
              Hore</span>
            <div class="invalid-feedback">Nama pegawai harus diisi.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-tp_lahir" class="col-4 col-form-label text-primary">Tempat/Tanggal Lahir</label>
          <div class="col-8">
            <div class="input-group">
              <input id="input-tp_lahir" name="input-tp_lahir" type="text" class="form-control" required="required">
              <input id="input-tg_lahir" name="input-tg_lahir" type="text" class="form-control" required="required">
              <div class="invalid-feedback">Tempat dan tanggal lahir harus diisi.</div>
            </div>
            <div class="text-end">
              <span id="input-namaHelpBlock" class="form-text text-muted">Format tanggal lahir: dd/mm/yyyy</span>
            </div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label class="col-4 text-primary">Jenis Kelamin</label>
          <div class="col-8">
            <div class="form-check form-check-inline">
              <input name="input-j_kelamin" id="input-j_kelamin_0" type="radio" class="form-check-input" value="L"
                required="required">
              <label for="input-j_kelamin_0" class="form-check-label">Laki-laki</label>
            </div>
            <div class="form-check form-check-inline">
              <input name="input-j_kelamin" id="input-j_kelamin_1" type="radio" class="form-check-input" value="P"
                required="required">
              <label for="input-j_kelamin_1" class="form-check-label">Perempuan</label>
            </div>
            <input name="input-j_kelamin" type="radio" class="d-none" required="required">
            <div class="invalid-feedback">Jenis kelamin harus dipilih.</div>
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
              <input name="input-status" id="input-status_0" type="radio" class="form-check-input" value="0"
                required="required">
              <label for="input-status_0" class="form-check-label">Belum Menikah</label>
            </div>
            <div class="form-check form-check-inline">
              <input name="input-status" id="input-status_1" type="radio" class="form-check-input" value="1"
                required="required">
              <label for="input-status_1" class="form-check-label">Menikah</label>
            </div>
            <input name="input-status" type="radio" class="d-none" required="required">
            <div class="invalid-feedback">Status pernikahan harus dipilih.</div>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-nidn" class="col-4 col-form-label text-primary">NIDN</label>
          <div class="col-8">
            <input id="input-nidn" name="input-nidn" type="text" class="form-control"
              aria-describedby="input-nidnHelpBlock">
            <span id="input-nidnHelpBlock" class="form-text text-muted">Nomor Induk Dosen Nasional (jika
              memiliki).</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-jabatan" class="col-4 col-form-label text-primary">Jabatan</label>
          <div class="col-8">
            <input id="input-jabatan" name="input-jabatan" type="text" class="form-control"
              aria-describedby="input-jabatanHelpBlock">
            <span id="input-jabatanHelpBlock" class="form-text text-muted">Jabatan di institusi.</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-alamat" class="col-4 col-form-label text-primary">Alamat</label>
          <div class="col-8">
            <textarea id="input-alamat" name="input-alamat" cols="40" rows="3" class="form-control"
              style="height:100px;" aria-describedby="input-alamatasalHelpBlock"></textarea>
            <span id="input-alamatHelpBlock" class="form-text text-muted">Isikan dengan alamat tinggal lengkap di area
              Malang, tanpa Kota/Kabupaten dan Propinsi</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-telp1" class="col-4 col-form-label text-primary">Nomor telepon/HP</label>
          <div class="col-8">
            <input id="input-telp1" name="input-telp1" type="text" class="form-control"
              aria-describedby="input-telp1HelpBlock">
            <span id="input-telp1HelpBlock" class="form-text text-muted">Nomor telepon atau HP pegawai</span>
          </div>
        </div>
        <div class="form-group row mb-4">
          <label for="input-telp2" class="col-4 col-form-label text-primary">Nomor telepon/HP (Alternatif)</label>
          <div class="col-8">
            <input id="input-telp2" name="input-telp2" type="text" class="form-control"
              aria-describedby="input-telp2HelpBlock">
            <span id="input-telp2HelpBlock" class="form-text text-muted">Nomor telepon atau HP pegawai</span>
          </div>
        </div>
        <div class="my-5 p-3 border rounded-2 bg-light text-end">
          <button class="btn btn-sm btn-primary bt-update">
            <i class="bi bi-list"></i><i class="bi bi-check-lg"></i> Update
          </button>
        </div>
      </form>
    </div>
  </div>
</div>