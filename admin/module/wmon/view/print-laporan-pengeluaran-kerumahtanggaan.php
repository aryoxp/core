<div class="m-5">

  <!-- <div class="row">
  <div class="col"> -->
  <img src="<?php echo $this->asset('logo-whn.png', 'admin/module/wmon/asset/image/'); ?>"
    class="mb-5" style="width:150pt;">
  <h3 class="mb-4"><i class="bi bi-cash-coin mx-2 text-primary"></i> 
    Laporan Pengeluaran Kerumahtanggaan <small class="text-muted fw-light">Harian</small>
  </h3>

  <?php // var_dump($laporan); 
    $date = strtotime($tanggal);
    function format($nominal) {
      return "Rp " . preg_replace('/(\d)(?=(?:\d{3})+(?!\d))/', '$1.', $nominal);
    }
  ?>

  <p><span class="text-primary">Transaksi tanggal:</span> <?php echo date('d/m/Y', $date); ?></p>

  <table class="table">
    <thead>
      <th>No</th><th>Pengeluaran</th>
      <th>Kas</th>
      <th>Keterangan</th>
      <th>Nominal</th>
    </thead>
  <?php 
    $total = 0;
    foreach($laporan->transaksi as $r) {
      $total += $r->nominal;
      $nominal = format($r->nominal);
      echo '<tr>';
      echo '<td>'.$r->no.'</td>';
      echo '<td>'.$r->pengeluaran.' - ';
      echo '<span class="text-primary">'.$r->kakundebit.'</span></td>';
      echo '<td class="text-center text-nowrap  w-10">'.$r->kakunkredit.'</td>';
      echo '<td class="w-10">'.$r->keterangan.'</td>';
      echo '<td class="text-nowrap text-end">'.$nominal.'</td>';
      echo '<tr>';
    }
    echo '<tr><td colspan="4" class="text-end"><strong>Total: </strong></td><td class="text-end"><strong>'.format($total).'</strong></td></tr>';
  ?>
  </table>

  <p><span class="text-primary">Dicetak tanggal:</span> <?php echo date('d/m/Y H:i'); ?></p>


  <script>(() => window.print())();</script>

</div>