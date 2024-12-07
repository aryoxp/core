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




  <p>Telah diterima pembayaran dari: 
    <span class="text-primary"><?php echo $mahasiswa->namam;  ?> 
      <span class="text-muted">
        <?php echo !empty($mahasiswa->nim) ? 'NIM '.$mahasiswa->nim : 'NRM '.$mahasiswa->nrm; ?>
      </span>
    </span>
  </p>
  <!-- <p><span class="text-primary">Transaksi tanggal:</span> <?php echo date('d/m/Y', $date); ?></p> -->

  <table class="table">
    <thead>
      <th>No</th>
      <th>Kode</th>
      <th>Tanggal</th>
      <th>Pembayaran</th>
      <th>Nominal</th>
      <th>Keterangan</th>
    </thead>
  <?php 
    $total = 0;
    $no = 1;
    foreach($transaksis as $r) { // var_dump($r);
      $total += (int) $r->nominal;
      $nominal = format($r->nominal);
      echo '<tr>';
      echo '<td class="text-end">'.$no++.'</td>';
      echo '<td class="text-center">TR-'.$r->kakunkredit.'-'.$r->kakundebit.'-'.$r->no.'</td>';
      echo '<td class="text-center">'.$r->tanggal.'</td>';
      echo '<td class="">'.$r->pembayaran.'</td>';
      echo '<td class="text-end">'.format($r->nominal).'</td>';
      echo '<td class="text-end text-nowrap">'.$r->keterangan.'</td>';
      echo '<tr>';
    }
    echo '<tr><td colspan="4" class="text-end"><strong>Total: </strong></td><td class="text-end"><strong>'.format($total).'</strong></td><td></td></tr>';
    echo '<tr><td colspan="6">Terbilang: '.terbilang($total).' Rupiah</td></tr>';
    for($i = 0; $i <= 5-$no; $i++)
      echo '<tr><td colspan="6" class="border-0">&nbsp;</td></tr>';
  ?>
  </table>

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


  <img src="<?php echo $this->asset('logo-whn.png', 'admin/module/wmon/asset/image/'); ?>"
    class="mb-5 mt-4" style="width:150pt;">

  <table class="w-100">
    <tr><td class="col-7">
    <h3 class="mb-4"><i class="bi bi-cash-coin mx-2 text-primary"></i> 
      Kuitansi
    </h3>
    </td>
    <td class="col-5 text-end text-danger"><span class="p-2 border rounded me-3">Arsip Institusi</span></td>
    </tr>
  </table>

  <p>Telah diterima pembayaran dari: 
    <span class="text-primary"><?php echo $mahasiswa->namam;  ?> 
      <span class="text-muted">
        <?php echo !empty($mahasiswa->nim) ? 'NIM '.$mahasiswa->nim : 'NRM '.$mahasiswa->nrm; ?>
      </span>
    </span>
  </p>
  <!-- <p><span class="text-primary">Transaksi tanggal:</span> <?php echo date('d/m/Y', $date); ?></p> -->

  <table class="table">
    <thead>
      <th>No</th>
      <th>Kode</th>
      <th>Tanggal</th>
      <th>Pembayaran</th>
      <th>Nominal</th>
      <th>Keterangan</th>
    </thead>
  <?php 
    $total = 0;
    $no = 1;
    foreach($transaksis as $r) { // var_dump($r);
      $total += (int) $r->nominal;
      $nominal = format($r->nominal);
      echo '<tr>';
      echo '<td class="text-end">'.$no++.'</td>';
      echo '<td class="text-center">TR-'.$r->kakunkredit.'-'.$r->kakundebit.'-'.$r->no.'</td>';
      echo '<td class="text-center">'.$r->tanggal.'</td>';
      echo '<td class="">'.$r->pembayaran.'</td>';
      echo '<td class="text-end">'.format($r->nominal).'</td>';
      echo '<td class="text-end">'.$r->keterangan.'</td>';
      echo '<tr>';
    }
    echo '<tr><td colspan="4" class="text-end"><strong>Total: </strong></td><td class="text-end"><strong>'.format($total).'</strong></td><td></td></tr>';
    echo '<tr><td colspan="6">Terbilang: '.terbilang($total).' Rupiah</td></tr>';
    for($i = 0; $i <= 5-$no; $i++)
      echo '<tr><td colspan="6" class="border-0 text-white">&nbsp;</td></tr>';
  ?>
  </table>

  <table class="w-100">
    <tr><td class="col-7">
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