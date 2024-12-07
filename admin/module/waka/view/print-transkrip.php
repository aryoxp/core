<?php
function prodi($p) {
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
function predikat($ipk) {
  if($ipk > 3.5) return "Cumlaude";
  if($ipk > 3) return "Sangat memuaskan";
  return "Memuaskan";
}
?>

  <img src=" <?php echo $this->asset('logo-whn.png', 'admin/module/waka/asset/image/'); ?>" class="mb-5"
    style="width:150pt;">
    <h3 class="m-0 mb-4 text-center ffs fw-bold">Transkrip Akademik</h3>

    <table class="table table-borderless fsc">
      <tr>
        <td style="width:100px;">Nama</td>
        <td>: <?php echo $mahasiswa->namam; ?></td>
      </tr>
      <tr>
        <td>NIM</td>
        <td>: <?php echo $mahasiswa->nim; ?></td>
      </tr>
      <tr>
        <td>Program Studi</td>
        <td>: <?php echo prodi($mahasiswa->prodi); ?></td>
      </tr>
    </table>

    <table class="table table-bordered fsc">
      <thead>
        <tr>
          <th class="text-center" style="">No</th>
          <th class="text-center" style="">Kode</th>
          <th class="text-center" style="">Matakuliah</th>
          <th class="text-center" style=" width:60px;">SKS (K)</th>
          <th class="text-center" style=" width:50px;">Nilai</th>
          <th class="text-center" style=" width:70px;">Bobot (N)</th>
          <th class="text-center" style="vertical-align:middle">K&times;N</th>
        </tr>
      </thead>
      <tbody>
        <?php 
        $semester = 0;
        $sem = 0;
        $jsks = 0;
        $jnxk = 0;
        for($i = 0; $i < count($matakuliahs); $i++) : 
          $matakuliah = $matakuliahs[$i];
          $nxk = $matakuliah->sks * $matakuliah->bobotnilai;
          $jsks += $matakuliah->sks;
          $jnxk += $nxk;
          echo $matakuliah->semesterke;
          if ($semester != $matakuliah->semesterke) {
            $semester = $matakuliah->semesterke;
            echo '<tr><th colspan="7">SEMESTER '.roman($semester).'</th></tr>';
          }
          ?>
          <tr>
          <td class="text-center align-middle"><?php echo ($i+1); ?></td>
          <td class="text-center align-middle"><?php echo $matakuliah->kdmk; ?></td> 
          <td class="text-primary align-middle"><?php echo $matakuliah->namamk; ?></td> 
          <td class="text-center align-middle"><?php echo $matakuliah->sks; ?></td> 
          <td class="text-center align-middle"><?php echo $matakuliah->nilai; ?></td> 
          <td class="text-center nilai align-middle"><?php echo $matakuliah->bobotnilai; ?></td>
          <td class="text-center align-middle"><?php echo $nxk; ?></td>
          </tr>
      <?php endfor; ?>
      <?php $ipk = round($jnxk/$jsks, 3); ?>
      </tbody>
    </table>

    <table class="fsc">
      <tr><td>Jumlah SKS</td><td>: <?php echo $jsks; ?> SKS</td></tr>
      <tr><td>Jumlah SKS x Nilai (KxN)</td><td>:  <?php echo $jnxk; ?></td></tr>
      <tr><td>Indeks Prestasi Kumulatif (IPK)</td><td>: <?php echo $ipk; ?></td></tr>
      <tr><td>Predikat</td><td>: <?php echo predikat($ipk); ?></td></tr>
    </table>

    <table class="fsc mt-3" style="width:100%">
      <tr><td style="width:50%"></td><td class="text-center">Penasihat Akademik</td></tr>
      <tr><td></td><td class="text-center"><span class="pt-5 d-block" style="padding-top:50px;"><br><br><br><?php echo $mahasiswa->namapa ? "($mahasiswa->namapa)" : '&nbsp;';?></span></td></tr>
    </table>
    
    <p class="fsc mt-3 text-muted" style="font-size:10pt">Dokumen transkrip ini tidak sah tanpa tandatangan dan stempel asli dari institusi.
      <br>Dokumen transkrip ini bukan transkrip nilai yang merepresentasikan prestasi akademik atas kelulusan mahasiswa.</p>
    <p class="fsc my-3"><span class="text-primary">Dicetak tanggal:</span> <?php echo date('d/m/Y H:i'); ?></p>

