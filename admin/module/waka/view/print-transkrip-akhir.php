<?php
if(!function_exists('prodi')) {function prodi($p) {
  if ($p == 'D3') return "Kebidanan";
  if ($p == 'D3F') return "Farmasi";
  if ($p == 'MIK') return "Manajemen Informasi Kesehatan";
  if ($p == 'FIS') return "Fisioterapi";
}}
if(!function_exists('semester')) {function semester($s) {
  if ($s == 1) return "Ganjil";
  if ($s == 2) return "Genap";
  if ($s == 3) return "Ganjil Pendek";
  if ($s == 4) return "Genap Pendek";
}}
if(!function_exists('roman')) {function roman($number) {
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
}}
if(!function_exists('predikat')) {function predikat($ipk) {
  if($ipk > 3.5) return "Cumlaude";
  if($ipk > 3) return "Sangat memuaskan";
  return "Memuaskan";
}}
if(!function_exists('bulan')) {function bulan($m) {
  switch($m) {
    case 1: return "Januari";
    case 2: return "Februari";
    case 3: return "Maret";
    case 4: return "April";
    case 5: return "Mei";
    case 6: return "Juni";
    case 7: return "Juli";
    case 8: return "Agustus";
    case 9: return "September";
    case 10: return "Oktober";
    case 11: return "November";
    case 12: return "Desember";
  }
  return "";
}}
if(!function_exists('tanggal')) {function tanggal($ymd) {
  $ymd = array_reverse(explode("-", $ymd));
  $d = (int) $ymd[0];
  $m = (int) $ymd[1];
  $y = (int) $ymd[2];
  return $d . " " . bulan($m) . " " . $y;
}}
?>

<style>
  @media print {
    .page-break {
      display: block;
      break-before: always;
      page-break-before: always;
    }
  }
</style>

<div class="<?php if (isset($pb)) echo 'page-break'; ?>">
  <img src="<?php echo $this->asset('logo-whn.png', 'admin/module/waka/asset/image/'); ?>" class="mb-5"
    style="width:150pt;">
  <h3 class="m-0 mb-5 text-center ffs fw-bold">
    <span class="text-uppercase">Transkrip Akademik</span>
    <br><span class="fw-normal" style="font-size:13pt">No. <?php echo $akademik->pin; ?></span>
  </h3>
  
  <table class="table table-borderless ffs">
    <tr>
      <td style="width:18%;">Nama</td>
      <td style="width:40%;">: <?php echo $mahasiswa->namam; ?></td>
      <td style="width:12%;">Program Studi</td>
      <td style="width:30%;">: <?php echo prodi($mahasiswa->prodi); ?></td>
    </tr>
    <tr>
      <td>NIM</td>
      <td>: <?php echo $mahasiswa->nim; ?></td>
      <td>Jenjang</td>
      <td>: <?php
            if ($mahasiswa->prodi == "D3") echo "Diploma III";
            if ($mahasiswa->prodi == "D3F") echo "Diploma III";
            if ($mahasiswa->prodi == "MIK") echo "Diploma IV";
            if ($mahasiswa->prodi == "FIS") echo "Diploma IV";
            ?></td>
    <tr>
      <td>Tempat/Tanggal Lahir</td>
      <td>: <?php echo $mahasiswa->tplahir . ", " . tanggal($mahasiswa->tglahir); ?></td>
      <td></td>
      <td></td>
    </tr>
  
  
  </table>
  
  <table class="table table-bordered fsc">
    <thead>
      <tr>
        <th class="text-center border" style="vertical-align:middle">No</th>
        <th class="text-center border" style="vertical-align:middle">Kode</th>
        <th class="text-center border" style="vertical-align:middle">Matakuliah</th>
        <th class="text-center border" style=" width:30px;">SKS</th>
        <th class="text-center border" style=" width:30px;vertical-align:middle">Nilai</th>
        <!-- <th class="text-center" style=" width:70px;">Bobot (N)</th> -->
        <th class="text-center border" style="vertical-align:middle">K&times;N</th>
  
        <th class="text-center" style="vertical-align:middle; width: 0px; border-top: 0;"></th>
  
        <th class="text-center border" style="vertical-align:middle">No</th>
        <th class="text-center border" style="vertical-align:middle">Kode</th>
        <th class="text-center border" style="vertical-align:middle">Matakuliah</th>
        <th class="text-center border" style=" width:30px;">SKS</th>
        <th class="text-center border" style=" width:30px;vertical-align:middle">Nilai</th>
        <!-- <th class="text-center" style=" width:70px;">Bobot (N)</th> -->
        <th class="text-center border" style="width:30px; vertical-align:middle">K&times;N</th>
      </tr>
    </thead>
    <tbody>
      <?php
          $semester = 0;
          $sem = 0;
          $jsks = 0;
          $jnxk = 0;
          $half = floor((count($matakuliahs)/2));
          for($i = 0; $i < floor(count($matakuliahs)/2); $i++) :
            $matakuliah = $matakuliahs[$i];
            $nxk = $matakuliah->sks * $matakuliah->bobotnilai;
            $jsks += $matakuliah->sks;
            $jnxk += $nxk;
  
            $matakuliah2 = $matakuliahs[$half + $i];
            $nxk2 = $matakuliah2->sks * $matakuliah2->bobotnilai;
            $jsks += $matakuliah2->sks;
            $jnxk += $nxk2;
            ?>
      <tr>
        <td class="text-center align-middle border"><?php echo ($i+1); ?></td>
        <td class="text-center align-middle border"><?php echo $matakuliah->kdmk; ?></td>
        <td class="text-primary align-middle border"><?php echo $matakuliah->namamk; ?></td>
        <td class="text-center align-middle border"><?php echo $matakuliah->sks; ?></td>
        <td class="text-center align-middle border"><?php echo $matakuliah->nilai; ?></td>
        <!-- <td class="text-center nilai align-middle"><?php echo $matakuliah->bobotnilai; ?></td> -->
        <td class="text-center align-middle border"><?php echo $nxk; ?></td>
  
        <th class="text-center" style="vertical-align:middle;"></th>
  
        <td class="text-center align-middle border"><?php echo ($half + $i+1); ?></td>
        <td class="text-center align-middle border"><?php echo $matakuliah2->kdmk; ?></td>
        <td class="text-primary align-middle border"><?php echo $matakuliah2->namamk; ?></td>
        <td class="text-center align-middle border"><?php echo $matakuliah2->sks; ?></td>
        <td class="text-center align-middle border"><?php echo $matakuliah2->nilai; ?></td>
        <!-- <td class="text-center nilai align-middle"><?php echo $matakuliah2->bobotnilai; ?></td> -->
        <td class="text-center align-middle border"><?php echo $nxk2; ?></td>
      </tr>
      <?php endfor; ?>
      <?php $ipk = round($jnxk/$jsks, 3); ?>
    </tbody>
  </table>
  
  <p class="fw-bold" style="line-height:1.7">Judul Karya Tulis Ilmiah:<br>
    <span class="fw-normal"><?php echo $akademik->judulta; ?></span>
  </p>
  
  <table class="ffs mt-5">
    <tr>
      <td>Jumlah SKS</td>
      <td>: <?php echo $jsks; ?> SKS</td>
      <td rowspan="4" style="width:70px;"></td>
      <td rowspan="4" class="align-top px-5">
        Dinyatakan LULUS<br>dari Politeknik Kesehatan Wira Husada Nusantara<br>pada tanggal
        <?php echo tanggal($akademik->tglulus); ?></td>
    </tr>
    <tr>
      <td>Jumlah SKS x Nilai (KxN)</td>
      <td>: <?php echo $jnxk; ?></td>
    </tr>
    <tr>
      <td class="pe-3">Indeks Prestasi Kumulatif (IPK)</td>
      <td>: <?php echo $ipk; ?></td>
    </tr>
    <tr>
      <td>Predikat</td>
      <td>: <?php echo predikat($ipk); ?></td>
    </tr>
  </table>
  
  <table class="ffs mt-3" style="width:100%">
    <tr>
      <td style="width:50%"></td>
      <td class="text-center" style="line-height:1.5">
        <p class="fw-bold">Malang, <?php echo tanggal($akademik->tglulus); ?><br>
          Direktur<br><br><br><br><br><br>Donna Dwinita Adelia, MMRS</p>
      </td>
    </tr>
  </table>
</div>
