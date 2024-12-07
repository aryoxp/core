<div class="m-5">

  <?php // var_dump($mahasiswa, $krs, $matakuliahs); 
    function semester($sem) {
      if ($sem == 1) return "Ganjil";
      if ($sem == 2) return "Genap";
      if ($sem == 3) return "Ganjil Pendek";
      if ($sem == 4) return "Genap Pendek";
    }
  
  ?>

  <!-- <div class="row">
  <div class="col"> -->
  <img src="<?php echo $this->asset('logo-whn.png', 'admin/module/waka/asset/image/'); ?>"
    class="mb-5" style="width:150pt;">
  <h3 class="mb-4"><i class="bi bi-card-checklist mx-2 text-primary"></i> 
    Kartu Rencana Studi
  </h3>

  <table class="table table-borderless">
    <tr>
      <td>Nama</td><td>: <?php echo $mahasiswa->namam; ?></td>
      <td style="width: 30%">&nbsp;</td>
      <td>Semester</td><td>: <?php echo semester($krs->semester); ?></td>
    </tr>
    <tr>
      <td>NIM</td><td>: <?php echo $mahasiswa->nim; ?></td>
      <td>&nbsp;</td>
      <td>Tahun Akademik</td><td>: <?php echo ((int)$krs->tahun) . "/" . ((int)$krs->tahun) + 1; ?></td>
    </tr>
  </table>

  <!-- <?php $date = strtotime($tanggal); ?> -->

  <table class="table">
    <thead>
      <th class="text-center">No</th>
      <th class="text-center">Kode</th>
      <th>Matakuliah</th>
      <th class="text-center">SKS</th>
    </thead>
  <?php 
    $total = 0;
    $no = 1;
    foreach($matakuliahs as $mk) {
      $total += (int)$mk->sks;
      echo '<tr>';
      echo '<td class="text-center">'.$no++.'</td>';
      echo '<td class="text-center">'.$mk->kdmk.'</td>';
      echo '<td class="">'.$mk->namamk.'</td>';
      echo '<td class="text-center w-10">'.$mk->sks.'</td>';
      echo '<tr>';
    }
    echo '<tr><td colspan="3" class="text-end"><strong>Total: </strong></td><td class="text-center"><strong>'.$total.' SKS</strong></td></tr>';
  ?>
  </table>

  <p><span class="text-primary">Dicetak tanggal:</span> <?php echo date('d/m/Y H:i'); ?></p>


  <script>(() => window.print())();</script>

</div>