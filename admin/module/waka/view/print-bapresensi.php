<html>

<head></head>

<body>
  <div>
    <table width="100%">
      <tr class="row">
        <td class="col-6">
          <img src="http://localhost/core/admin/module/wmon/asset/image/logo-whn.png" style="width:150pt;">
        </td>
        <td class="col-6 text-end ffs">
          <h4><strong>Berita Acara Perkuliahan</strong><br>
            Politeknik Kesehatan Wira Husada Nusantara
          </h4>
        </td>
      </tr>
    </table>

    <?php function prodi($p) {
    if ($p == 'D3') return "D3 Kebidanan";
    if ($p == 'D3F') return "D3 Farmasi";
    if ($p == 'MIK') return "D4 Manajemen Informasi Kesehatan";
    if ($p == 'FIS') return "D4 Fisioterapi";
  }
  function semester($s) {
    if ($s == 1) return "Ganjil";
    if ($s == 2) return "Genap";
    if ($s == 3) return "Ganjil Pendek";
    if ($s == 4) return "Genap Pendek";
  }
  function roman($number) {
    $map = array('M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400, 'C' => 100, 'XC' => 90, 'L' => 50, 'XL' => 40, 'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1);
    $returnValue = '';
    while ($number > 0) {
      foreach ($map as $roman => $int) {
        if($number >= $int) {
          $number -= $int;
          $returnValue .= $roman;
          break;
        }
      }
    }
    return $returnValue;
  }
  ?>

    <div class="mt-3 fsc">
      <?php echo $matakuliah->kdmk.": ".$matakuliah->namamk . " (".$matakuliah->sks." SKS)"; ?><br>
      Program Studi
      <?php echo prodi($matakuliah->prodi)." Semester ".semester($kelas->semester)." ".$kelas->tahun."/".(((int)$kelas->tahun)+1)." - Kelas ".$kelas->nama; ?>
    </div>

    <?php $bulans = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']; ?>

    <p class="fs-6 fsc">Dosen pengampu: <?php echo $dosen ?? ''; ?></p>

    <table class="table table-bordered fsc" style="font-size: 10pt; vertical-align:middle;">
      <thead>
        <tr>
          <th rowspan="2" class="text-center" style="vertical-align:middle;">Pert. Ke-</th>
          <th rowspan="2" style="vertical-align:middle;">Tanggal</th>
          <th colspan="2" class="text-center">Jam</th>
          <th rowspan="2" class="text-center" style="vertical-align:middle; width: 400px;">Topik Pembahasan</th>
          <th rowspan="2" class="text-center" style="vertical-align:middle;">Jumlah<br>Kehadiran</th>
          <th rowspan="2" style="vertical-align:middle;">Paraf</th>
        </tr>
        <tr>
          <th class="text-center" style="width:60px;">Mulai</th>
          <th class="text-center" style="width:60px;">Selesai</th>
        </tr>
      </thead>
      <tbody>
        <?php for($i=0; $i<16; $i++): ?>
        <tr class="fs-6" style="height:100px;">
          <td style="vertical-align:middle" class="text-center"><?php echo roman($i+1); ?></td>
          <?php for($x=0; $x<6; $x++): ?>
          <td style="padding-top:15px;">&nbsp;<br>&nbsp;</td>
          <?php endfor; ?>
        </tr>
        <?php endfor; ?>
      </tbody>
    </table>
    <p class="fs-6 fsc"><span class="text-primary">Dicetak tanggal:</span> <?php echo date('d/m/Y H:i'); ?></p>
  </div>


  <htmlpagefooter name="presensifooter">
    <div class="text-end ffs" style="font-size:10pt;"><span class="text-primary">Halaman</span> {PAGENO}/{nbpg}<div>
  </htmlpagefooter>
  <!-- <pagebreak orientation="L" size="L" sheet-size="A4" resetpagenumber="1" footer="html_presensi-footer" />
<pagebreak orientation="L" size="L" resetpagenumber="1" /> -->

  <pagebreak orientation="landscape" resetpagenum="1" odd-footer-name="presensifooter" />

  <sethtmlpagefooter name="presensifooter" value="on" />

  <div>
    <div class="mt-3 fsc mb-3">
      <h4><strong>Daftar Hadir Mahasiswa</strong><br>
        Politeknik Kesehatan Wira Husada Nusantara
      </h4>
      <div>
        Program Studi
        <?php echo prodi($matakuliah->prodi)." Semester ".semester($kelas->semester)." ".$kelas->tahun."/".(((int)$kelas->tahun)+1); ?>
      </div>
      <?php echo $matakuliah->kdmk.": ".$matakuliah->namamk . " (".$matakuliah->sks." SKS)"." - Kelas ".$kelas->nama; ?>
    </div>
    <table class="table table-bordered fsc" style="font-size: 10pt; vertical-align:middle;">
      <thead>
        <tr>
          <th rowspan="3" class="text-center" style="vertical-align:middle;">No</th>
          <th rowspan="3" class="text-center" style="vertical-align:middle;">NIM</th>
          <th rowspan="3" class="text-center" style="vertical-align:middle;">Nama</th>
          <th colspan="16" style="vertical-align:middle;">Pertemuan</th>
        </tr>
        <tr>
          <?php for($i=0; $i<16; $i++): ?>
          <td style="width:60px;" class="text-center"><?php echo roman($i+1); ?></td>
          <?php endfor; ?>
        </tr>
        <tr>
          <th colspan="16" style="vertical-align:middle;">Tanda Tangan/Paraf</th>
        </tr>
      </thead>
      <tbody>
        <?php $no = 1; foreach($mahasiswas as $m): ?>
        <tr class="fs-6">
          <td style="vertical-align:middle" class="text-center py-3"><?php echo $no++; ?></td>
          <td style="vertical-align:middle" class="text-center"><?php echo $m->nim; ?></td>
          <td style="vertical-align:middle;" class="text-nowrap"><?php echo $m->namam; ?></td>
          <?php for($x=0; $x<16; $x++): ?>
          <td>&nbsp;</td>
          <?php endfor; ?>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>

</body>

</html>