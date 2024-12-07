<style>
  @media print {
    .page-break {
      display: block;
      break-before: always;
      page-break-before: always;
    }
  }
</style>
<?php // if (!isset($num)) $num=0; ?>
<div class="m-5 <?php if (isset($pb)) echo 'page-break'; ?>">

  <?php // var_dump($mahasiswa, $khs, $matakuliahs); 
    if (!function_exists('semester')){
      function semester($sem) {
        if ($sem == 1) return "Ganjil";
        if ($sem == 2) return "Genap";
        if ($sem == 3) return "Ganjil Pendek";
        if ($sem == 4) return "Genap Pendek";
      }
    }
  ?>

  <?php // var_dump($mahasiswa); ?>

  <img src="<?php echo $this->asset('logo-whn.png', 'admin/module/waka/asset/image/'); ?>"
    class="mb-5" style="width:150pt;">
  <h3 class="mb-4"><i class="bi bi-card-checklist mx-2 text-primary"></i> 
    Kartu Hasil Studi
  </h3>

  <table class="table table-borderless">
    <tr>
      <td>Nama</td><td>: <?php echo $mahasiswa->namam; ?></td>
      <td style="width: 30%">&nbsp;</td>
      <td>Semester</td><td>: <?php echo semester($semester); ?></td>
    </tr>
    <tr>
      <td>NIM</td><td>: <?php echo $mahasiswa->nim; ?></td>
      <td>&nbsp;</td>
      <td>Tahun Akademik</td><td>: <?php echo ((int)$tahun) . "/" . ((int)$tahun) + 1; ?></td>
    </tr>
  </table>

  <!-- <?php $date = strtotime($tanggal); ?> -->

  <table class="table">
    <thead>
      <th class="text-center">No</th>
      <th class="text-center">Kode</th>
      <th>Matakuliah</th>
      <th class="text-center">SKS (K)</th>
      <th class="text-center">Nilai</th>
      <th class="text-center">Bobot Nilai (N)</th>
      <th class="text-center">K&times;N</th>
    </thead>
  <?php 
    $total = 0;
    $no = 1;
    $tnk = 0;
    $skslulus = 0;
    foreach($matakuliahs as $mk) {
      $total += (int)$mk->sks;
      $tnk += ($mk->sks * $mk->bobotnilai);
      if ($mk->bobotnilai > 0) $skslulus += (int)$mk->sks;
      echo '<tr>';
      echo '<td class="text-center">'.$no++.'</td>';
      echo '<td class="text-center">'.$mk->kdmk.'</td>';
      echo '<td class="">'.$mk->namamk.'</td>';
      echo '<td class="text-center" style="width:50px;">'.$mk->sks.'</td>';
      echo '<td class="text-center" style="width:50px;">'.$mk->nilai.'</td>';
      echo '<td class="text-center" style="width:100px;">'.$mk->bobotnilai.'</td>';
      echo '<td class="text-center" style="width:50px;">'.$mk->sks * $mk->bobotnilai.'</td>';
      echo '<tr>';
    }
    echo '<tr><td colspan="3" class="text-end"><strong>Total: </strong></td><td class="text-center"><strong>'.$total.'</strong></td>';
    echo '<td>&nbsp;</td><td>&nbsp;</td><td class="text-center"><strong>'.$tnk.'</strong></td></tr>';
  ?>
  </table>

  <table class="mt-5" style="width: 100%">
    <tr><td class="align-top">Jumlah SKS yang ditempuh pada semester ini: <?php echo $total; ?> SKS<br>
Jumlah SKS yang lulus pada semester ini: <?php echo $skslulus; ?> SKS<br>
Indeks Prestasi (IP) semester ini: <?php echo number_format($tnk/$total, 3, ',', '.'); ?></td>
    <td class="text-center">Penasehat Akademik
      <div style="margin-top:2cm;"><?php  echo ($mahasiswa->namapa) ? "($mahasiswa->namapa)" : "(Penasehat Akademik)"; ?></div></td></tr>
  </table>

  <p><span class="text-primary">Dicetak tanggal:</span> <?php echo date('d/m/Y H:i'); ?></p>

  <script>(() => window.print())();</script>

</div>