<?php
  function format($nominal) {
    return "Rp " . preg_replace('/(\d)(?=(?:\d{3})+(?!\d))/', '$1.', $nominal);
  }
  function terbilang($nominal) {
    $nominal = (int) $nominal;
    $bilangan = ["", "Satu", "Dua", "Tiga", "Empat",
                    "Lima", "Enam", "Tujuh", "Delapan",
                    "Sembilan", "Sepuluh", "Sebelas"];
    if ($nominal <= 0) return "";
    if ($nominal < 12) return $bilangan[$nominal] . " ";
    else if ($nominal < 20) return terbilang($nominal - 10) . "Belas ";
    else if ($nominal < 100) return terbilang(($nominal / 10)) . "Puluh " . terbilang($nominal % 10);
    else if ($nominal < 200) return "Seratus " . terbilang($nominal - 100);
    else if ($nominal < 1000) return terbilang(($nominal / 100)) . "Ratus " . terbilang($nominal % 100);
    else if ($nominal < 2000) return "Seribu " . terbilang($nominal - 1000);
    else if ($nominal < 1000000) return terbilang(($nominal / 1000)) . "Ribu " . terbilang($nominal % 1000);
    else if ($nominal < 1000000000) return terbilang(($nominal / 1000000)) . "Juta " . terbilang($nominal % 1000000);
    else if ($nominal < 1000000000000) return terbilang(($nominal / 1000000000)) . "Milyar " . terbilang($nominal % 1000000000);
    else return "";
  }
?>

<div class="m-5">

  <img src="<?php echo $this->asset('logo-whn.png', 'admin/module/wmon/asset/image/'); ?>"
    class="mb-5" style="width:150pt;">

  <table class="w-100">
    <tr><td class="col-7">
    <h3 class="mb-4"><i class="bi bi-cash-coin mx-2 text-primary"></i> 
      Kuitansi
    </h3>
    </td>
    <td class="col-5 text-end text-primary"><span class="p-2 border rounded me-3">Arsip Mahasiswa</span></td>
    </tr>
  </table>

  <?php
    $prodi = '-';
    if ($mahasiswa->prodi == 'D3') $prodi = 'D3 Kebidanan';
    if ($mahasiswa->prodi == 'D3F') $prodi = 'D3 Farmasi';
    if ($mahasiswa->prodi == 'MIK') $prodi = 'D4 Manajemen Informasi Kesehatan';
    if ($mahasiswa->prodi == 'FIS') $prodi = 'D4 Fisioterapi';
  ?>

  <p>Telah diterima pembayaran dari:</p>
  <table class="m-3 mb-4">
    <tr><td>Nama</td><td class="pe-2">:</td><td><span class="text-primary"><?php echo $mahasiswa->namam;  ?></span></td><tr>
    <tr><td>&nbsp;</td><td>&nbsp;</td><td><span class="text-muted">
      <?php echo !empty($mahasiswa->nim) ? 'NIM '.$mahasiswa->nim : 'NRM '.$mahasiswa->nrm; ?>
    </span></td></tr>
    <tr><td>Program Studi</td><td>:</td><td><span class="text-primary"><?php echo $prodi;  ?></span></td><tr>
    <tr><td>Tanggal/Jam</td><td>:</td><td><span class="text-primary"><?php echo date('d/m/Y, H:i', strtotime($transaksi->tanggal . " " . $transaksi->jam));  ?></span></td></tr>
    <tr><td class="pe-3">Untuk Pembayaran</td><td>:</td><td><span class="text-primary">Biaya Pendaftaran Mahasiswa Baru</span></td></tr>
    <tr><td>Nominal</td><td>:</td><td><span class="text-primary"><?php echo format($transaksi->nominal); ?></span></td></tr>
    <tr><td>Terbilang</td><td>:</td><td><span class="text-primary"><?php echo terbilang($transaksi->nominal); ?> Rupiah</span></td></tr>
    <tr><td>Keterangan</td><td>:</td><td><span class="text-primary"><?php echo $transaksi->keterangan; ?></span></td></tr>
  </p>
  <!-- <p><span class="text-primary">Transaksi tanggal:</span> <?php echo date('d/m/Y', $date); ?></p> -->


  <table class="w-100 mb-4">
    <tr><td class="col-7 pb-3">
      <p><span class="text-primary">Dicetak tanggal:</span> <?php echo date('d/m/Y H:i'); ?><br>  
        Kuitansi ini merupakan bukti pembayaran yang sah apabila
        terdapat tandatangan dan stempel asli dari institusi
      </p>
    </td>
    <td class="col-5 text-center">Bendahara<br><br>&nbsp;</td>
    </tr>
  </table>

  <hr>


  <div class="mt-5">

  <img src="<?php echo $this->asset('logo-whn.png', 'admin/module/wmon/asset/image/'); ?>"
    class="mb-5" style="width:150pt;">

  <table class="w-100">
    <tr><td class="col-7">
    <h3 class="mb-4"><i class="bi bi-cash-coin mx-2 text-primary"></i> 
      Kuitansi
    </h3>
    </td>
    <td class="col-5 text-end text-danger"><span class="p-2 border rounded me-3">Arsip Institusi</span></td>
    </tr>
  </table>

  <?php
    $prodi = '-';
    if ($mahasiswa->prodi == 'D3') $prodi = 'D3 Kebidanan';
    if ($mahasiswa->prodi == 'D3F') $prodi = 'D3 Farmasi';
    if ($mahasiswa->prodi == 'MIK') $prodi = 'D4 Manajemen Informasi Kesehatan';
    if ($mahasiswa->prodi == 'FIS') $prodi = 'D4 Fisioterapi';
  ?>

  <p>Telah diterima pembayaran dari:</p>
  <table class="m-3 mb-4">
    <tr><td>Nama</td><td class="pe-2">:</td><td><span class="text-primary"><?php echo $mahasiswa->namam;  ?></span></td><tr>
    <tr><td>&nbsp;</td><td>&nbsp;</td><td><span class="text-muted">
      <?php echo !empty($mahasiswa->nim) ? 'NIM '.$mahasiswa->nim : 'NRM '.$mahasiswa->nrm; ?>
    </span></td></tr>
    <tr><td>Program Studi</td><td>:</td><td><span class="text-primary"><?php echo $prodi;  ?></span></td><tr>
    <tr><td>Tanggal/Jam</td><td>:</td><td><span class="text-primary"><?php echo date('d/m/Y, H:i', strtotime($transaksi->tanggal . " " . $transaksi->jam));  ?></span></td></tr>
    <tr><td class="pe-3">Untuk Pembayaran</td><td>:</td><td><span class="text-primary">Biaya Pendaftaran Mahasiswa Baru</span></td></tr>
    <tr><td>Nominal</td><td>:</td><td><span class="text-primary"><?php echo format($transaksi->nominal); ?></span></td></tr>
    <tr><td>Terbilang</td><td>:</td><td><span class="text-primary"><?php echo terbilang($transaksi->nominal); ?> Rupiah</span></td></tr>
    <tr><td>Keterangan</td><td>:</td><td><span class="text-primary"><?php echo $transaksi->keterangan; ?></span></td></tr>
  </p>
  <!-- <p><span class="text-primary">Transaksi tanggal:</span> <?php echo date('d/m/Y', $date); ?></p> -->


  <table class="w-100 mb-4">
    <tr><td class="col-7 pb-3">
      <p><span class="text-primary">Dicetak tanggal:</span> <?php echo date('d/m/Y H:i'); ?><br>  
        Kuitansi ini merupakan bukti pembayaran yang sah apabila
        terdapat tandatangan dan stempel asli dari institusi
      </p>
    </td>
    <td class="col-5 text-center">Bendahara<br><br>&nbsp;</td>
    </tr>
  </table>

  <script>(() => window.print())();</script>

</div>