<!-- <img src="<?php echo $this->asset('logo-whn.png', 'admin/module/wmon/asset/image/'); ?>" style="width:150pt" class="mb-5">
<p style="font-family: 'Fira Sans Condensed'; font-size: 10pt;"> This is a hello world</p> -->

<img src="http://localhost/core/admin/module/wmon/asset/image/logo-whn.png" style="width:150pt;">
<h3 class="mb-4 ffs"><i class="bi bi-cash-coin mx-2 text-primary"></i> 
  <strong>Jurnal Kas Kecil</strong> <small class="text-muted fw-light" style="font-weight:normal">Bulanan</small>
</h3>

<?php $bulans = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']; ?>

<p class="fs-6 fsc">Transaksi Bulan: <span class="text-primary"><?php echo $bulans[$bulan]." ".$tahun; ?></span></p>

<table class="table fsc" style="font-size: 10pt;">
  <thead>
    <tr>
    <th>No</th>
    <th>Tanggal</th>
    <th>Kode</th>
    <th>Debit</th>
    <th>Kredit</th>
    <th class="text-end">Nominal</th>
    <th>Keterangan</th>
    </tr>
  </thead>
  <tbody>
    <?php 
    function format($number) {
      return number_format($number, 0, ",", ".");
    }
    $total = 0;
    foreach($transaksis as $transaksi) : 
    $total += $transaksi->nominal;
    ?>
      <tr class="fs-6">
      <td class="p-0"><?php echo $transaksi->no; ?></td>
      <td class="text-nowrap p-0"><?php echo $transaksi->tanggal; ?></td>
      <td class="p-0"><?php echo $transaksi->kodejenistransaksi; ?></td>
      <td class="p-0"><?php echo $transaksi->akundebit; ?></td>
      <td class="p-0"><?php echo $transaksi->akunkredit; ?></td>
      <td class="text-nowrap text-end p-0">Rp <?php echo format($transaksi->nominal); ?></td>
      <td class="py-0"><?php echo $transaksi->keterangan; ?></td>
      </tr>
    <?php endforeach; ?>
    <tr><td colspan="5" class="text-end"><strong>Total: </strong></td><td class="text-end"><strong>Rp <?php echo format($total); ?></strong></td><td>&nbsp;</td></tr>
  </tbody>
</table>
<p class="fs-6 fsc"><span class="text-primary">Dicetak tanggal:</span> <?php echo date('d/m/Y H:i'); ?></p>