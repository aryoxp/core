<?php
if(!function_exists('jenjang')) {function jenjang($p) {
  switch($p) {
    case 'D3':
    case 'D3F': return "Diploma III";
    case 'MIK':
    case 'FIS': return "Diploma IV";
  }
  return "";
}}
if(!function_exists('prodi')) {function prodi($p) {
  if ($p == 'D3') return "Kebidanan";
  if ($p == 'D3F') return "Farmasi";
  if ($p == 'MIK') return "Manajemen Informasi Kesehatan";
  if ($p == 'FIS') return "Fisioterapi";
}}
if(!function_exists('prodien')) {function prodien($p) {
  if ($p == 'D3') return "Midwifery";
  if ($p == 'D3F') return "Pharmacy";
  if ($p == 'MIK') return "Health Information Management";
  if ($p == 'FIS') return "Physiotherapy";
}}
if(!function_exists('gelar')) {function gelar($p) {
  if ($p == 'D3') return "Ahli Madya Kebidanan (A.Md.Keb.)";
  if ($p == 'D3F') return "Ahli Madya Farmasi (A.Md.Far.)";
  if ($p == 'MIK') return "Sarjana Sains Terapan (S.ST.)";
  if ($p == 'FIS') return "Sarjana Sains Terapan (S.ST.)";
}}
if(!function_exists('gelaren')) {function gelaren($p) {
  if ($p == 'D3') return "Professional Midwifery Associate";
  if ($p == 'D3F') return "Professional Pharmacy Associate";
  if ($p == 'MIK') return "Bachelor of Applied Science in Health Information Management";
  if ($p == 'FIS') return "Bachelor of Applied Science in Physiotherapy";
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

tr td {
  padding: 2pt 0pt;
}
</style>

<div class="<?php if (isset($pb)) echo 'page-break'; ?> w-100" style="width:100%">
  <table>
    <tr>
      <td class="align-top">
        <table>
          <tr>
            <td class="align-top">
              <barcode code="https://whn.ac.id/v.php?p=<?php echo !empty($akademik->pin) ? $akademik->pin : '0'; ?>"
                type="QR" class="barcode" size="0.6" error="M" disableborder="1" />
            </td>
          </tr>
          <tr>
            <td class="align-bottom" style="text-rotate:90; font-size:11pt; padding:105mm 0 0 5mm; font-family: ocrb;">
              PIN/<?php echo $akademik->pin . ""; ?>
            </td>
          </tr>
        </table>
      </td>
      <td style="width:26cm;">
        <table style="width:100%;" class="table-borderless">
          <tr>
            <td class="text-center align-top" style="height:3.5cm;">
              <img src="<?php echo $this->asset('logo-whn.png', 'admin/module/waka/asset/image/'); ?>" class="mb-5"
                style="width:150pt;">
            </td>
            <td class="text-end align-top">
              <barcode code="<?php echo $mahasiswa->nrm; ?>" type="C128A" size="0.8" />

              <div class="m-10 p-10 d-block" style="font-family: ocrb;">R/<?php echo $mahasiswa->nrm . "&nbsp;&nbsp;"; ?></div>
            </td>
          </tr>
          <tr>
            <td colspan="2" class="text-center fsc">
              <p>menyatakan bahwa
                <br><span class="subs">to certify</span>
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2" class="text-center">
              <p class="ffn" style="font-size:24pt; padding-top:5mm; line-height:1">
                <?php echo $mahasiswa->namam; ?></p>
            </td>
          </tr>
        </table>

        <table class="table table-borderless fsc align-top m-0 p-0"
          style="font-size: 11pt; margin:0; padding:0; margin-left: 4cm;">
          <tr>
            <td style="width:180px;">NIM<br><span class="subs">Student Identity Number</span></td>
            <td>: <?php echo $mahasiswa->nim; ?></td>
          </tr>
          <tr>
            <td>NIK/Nomor Paspor<br><span class="subs">National ID/Passport Number</span></td>
            <td>: <?php echo $mahasiswa->nikpaspor; ?></td>
          </tr>
          <tr>
            <td>Tempat/Tanggal Lahir<br><span class="subs">Date and Place of Birth</span></td>
            <td>: <?php echo $mahasiswa->tplahir . ", " . tanggal($mahasiswa->tglahir); ?></td>
          </tr>
          <tr>
            <td colspan="2">telah memenuhi seluruh persyaratan akademik pada Program Studi
              <?php echo jenjang($mahasiswa->prodi) . " " . prodi($mahasiswa->prodi); ?>
              <br><span class="subs">has fulfilled all the requirements of
                <?php echo jenjang($mahasiswa->prodi) . " " . prodien($mahasiswa->prodi); ?>
                Program</span>
            </td>
          </tr>
        </table>
        <table class="table table-borderless fsc align-top m-0 p-0"
          style="font-size: 11pt; margin:0; padding:0; margin-left: 4cm;">
          <tr>
            <td>dinyatakan lulus pada tanggal
              <br><span class="subs">declared to have passed the examination on</span>
            </td>
            <td style="padding: 3px 50px;"><span style=""><?php echo tanggal($akademik->tglulus); ?></span></td>
            <td>sehingga kepadanya diberikan ijazah dan gelar
              <br><span class="subs">therefore be granted the diploma and title of</span>
            </td>
          </tr>
          <tr>
            <td colspan="3" class="ffn text-center" style="font-size:24pt; line-height:1.2; padding-right:150px;">
              <?php echo gelar($mahasiswa->prodi); ?>
              <br><span class="subs" style="font-size:14pt">
                <?php echo gelaren($mahasiswa->prodi); ?> </span>
            </td>
          </tr>
          <tr>
            <td colspan="3" class="" style="padding-top: 7pt">
              beserta segala hak, kewajiban, dan wewenang yang melekat pada ijazah dan gelar tersebut
              <br><span class="subs">
                along with all the rights, obligations, and authorities attached to the diploma and aforementioned title
              </span>
            </td>
          </tr>
          Malang Tanggal: 28 Agustus 2023
          <tr>
            <td>Diberikan di: <span>Malang</span>
              <br><span class="subs">Awarded at</span>
            </td>
            <td colspan="2">
              Tanggal: <?php echo tanggal($akademik->tglulus); ?>
              <br><span class="subs">
                Date
              </span>
            </td>
          </tr>
        </table>
        <table class="fsc" style="width:100%; margin: 2mm 2cm 0 4cm;">
          <tr>
            <td class="text-center" style="width:30%; line-height:1.2">
              <p class="fw-bold">
                Ketua Program Studi<br><span class="subs fw-normal">Head of Department</span><br><br><br><br><br>
                Sayuti, S.Pd., S.ST., M.Kes.<br><span class="fw-normal">NIDN 0722048304</span></p>
            </td>
            <td class="text-center" style="width:30%; line-height:1.2"></td>
            <td class="text-center" style="line-height:1.2">
              <p class="fw-bold">
                Direktur<br><span class="subs fw-normal">Director</span><br><br><br><br><br>
                Donna Dwinita Adelia, MMRS<br><span class="fw-normal">NIDN 0708088202</span></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>