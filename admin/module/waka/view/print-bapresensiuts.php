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
          <h4><strong>Daftar Presensi<br>Ujian Tengah Semester</strong><br>
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

    <htmlpagefooter name="presensifooter">
      <div class="text-end ffs" style="font-size:10pt;"><span class="text-primary">Halaman</span> {PAGENO}/{nbpg}<div>
    </htmlpagefooter>

    <sethtmlpagefooter name="presensifooter" value="on" />

    <div class="mt-3 fsc">
      <?php echo $matakuliah->kdmk.": ".$matakuliah->namamk . " (".$matakuliah->sks." SKS)"; ?><br> Program Studi
      <?php echo prodi($matakuliah->prodi)." Semester ".semester($kelas->semester)." ".$kelas->tahun."/".(((int)$kelas->tahun)+1)." - Kelas ".$kelas->nama; ?>
    </div>

    <?php $bulans = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']; ?>

    <p class="fs-6 fsc">Dosen pengampu: <?php echo $dosen ?? ''; ?></p>

    <table class="table fsc" style="font-size: 10pt; vertical-align:middle;">
      <thead>
        <tr>
          <th class="text-center" style="vertical-align:middle;">No</th>
          <th class="text-center" style="vertical-align:middle;">NIM</th>
          <th class="text-center" style="vertical-align:middle;">Nama</th>
          <th colspan="2" class="text-center">Tanda Tangan</th>
        </tr>
      </thead>
      <tbody>
        <?php $no = 1; foreach($mahasiswas as $m): ?>
        <tr class="fs-6">
          <td style="vertical-align:middle;" class="text-center py-3"><?php echo $no; ?></td>
          <td style="vertical-align:middle;" class="text-center"><?php echo $m->nim; ?></td>
          <td style="vertical-align:middle;" class="text-nowrap"><?php echo $m->namam; ?></td>
          <td class="pt-4" style="vertical-align:middle;width:100px; padding-top:10px; padding-bottom:10px;"><?php echo ($no%2==0) ? '&nbsp;': $no; ?></td>
          <td class="pt-4" style="vertical-align:middle;width:100px;"><?php echo ($no%2==1) ? '&nbsp;': $no; ?></td>
        </tr>
        <?php $no++; endforeach; ?>
      </tbody>
    </table>

    <!-- <p class="fs-6 fsc"><span class="text-primary">Dicetak tanggal:</span> <?php echo date('d/m/Y H:i'); ?></p> -->
  </div>



  <!-- <pagebreak orientation="L" size="L" sheet-size="A4" resetpagenumber="1" footer="html_presensi-footer" />
<pagebreak orientation="L" size="L" resetpagenumber="1" /> -->

  <pagebreak resetpagenum="1" odd-footer-name="presensifooter" />

  <sethtmlpagefooter name="presensifooter" value="on" />

  <div class="ffs">
    <div class="mt-3 fsc mb-3">
      <table width="100%">
        <tr class="row">
          <td class="col-6">
            <img src="http://localhost/core/admin/module/wmon/asset/image/logo-whn.png" style="width:150pt;">
          </td>
          <td class="col-6 ffs">

          </td>
        </tr>
      </table>
      <h4 class="mt-5"><strong>Berita Acara Ujian Tengah Semester</strong><br>
        Politeknik Kesehatan Wira Husada Nusantara
      </h4>
    </div>
    <div class="mt-5">
      <p>Berita acara ini menerangkan telah diselenggarakannya Ujian Tengah Semester (UTS) 
        mata kuliah <strong><?php echo $matakuliah->namamk; ?></strong> (<?php echo $matakuliah->kdmk; ?>) 
        semester <?php echo semester($kelas->semester); ?> <?php echo $kelas->tahun."/".(((int)$kelas->tahun)+1); ?> 
        untuk Program Studi <?php echo prodi($matakuliah->prodi); ?> 
        pada: </p>
    </div>
    <table class="m-4">
      <tr><td>Kelas</td><td>: <?php echo $kelas->nama; ?> </td></tr>
      <tr><td>Hari</td><td>: _________________________ </td></tr>
      <tr><td>Tanggal</td><td>: _________________________ </td></tr>
      <tr><td>Pukul</td><td>: _________________________ s.d. _________________________</td></tr>
      <tr><td>Jumlah mahasiswa sesuai presensi</td><td>: _________________________ </td></tr>
      <tr><td>Jumlah mahasiswa hadir</td><td>: _________________________ </td></tr>
      <tr><td>Jumlah mahasiswa tidak hadir</td><td>: _________________________ </td></tr>
    </table>
    <div><p>di kampus Politeknik Kesehatan Wira Husada Nusantara, Jl. Kecubung No.2 Tlogomas Malang. Demikian berita acara ini dibuat agar dapat digunakan seperlunya.</p></div>
    <p class="ffs mt-5"><strong>Pengawas</strong></p>
    <table class="table table-bordered ffs">
      <tr><th class="text-center" style="width:50px;">No.</th><th class="text-center" style="width:300px;">Nama</th>
      <th class="text-center" style="width:250px;">NIP</th><th class="text-center" style="width:200px;">Tanda Tangan</th></tr>
      <tr><td class="text-center">1.</td><td style="padding:10px;">&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
      <tr><td class="text-center">2.</td><td style="padding:10px;">&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
    </table>
  </div>

</body>

</html>