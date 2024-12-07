$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      this.location = Core.configuration.get('baseurl');
      App.ajax = this.ajax;
      this.handleEvent();
      this.onLoad();
    }

    handleEvent() {
      $('#form-search').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let bulan = $('#form-search .input-bulan').val();
        let tahun = $('#form-search .input-tahun').val();
        this.ajax.post(`m/x/wmon/laporanApi/getJurnalKasKecil`, {
          bulan: bulan,
          tahun: tahun
        }).then(results => { // console.log(results);
          App.populateTransaksi(results.transaksi);
        });
      });
      $('#form-search').on('change', '.input-bulan', (e) => $('#form-search').trigger('submit'));
      $('#form-search').on('change', '.input-tahun', (e) => $('#form-search').trigger('submit'));
      $('.bt-print').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        var sortedCol = $('#list-transaksi table').dataTable().fnSettings().aaSorting[0][0];
        var sortedDir = $('#list-transaksi table').dataTable().fnSettings().aaSorting[0][1];
        console.log(sortedCol, sortedDir);
        let col = $('table.datatable th').eq(sortedCol).attr('data-col');
        let bulan = $('#form-search .input-bulan').val();
        let tahun = $('#form-search .input-tahun').val();
        $('#form-print input[name="tahun"]').val(tahun);
        $('#form-print input[name="bulan"]').val(bulan);
        $('#form-print input[name="col"]').val(col);
        $('#form-print input[name="order"]').val(sortedDir);
        // let tanggal = $('#input-tanggal').data().datepicker.getFormattedDate('yyyy-mm-dd');
        let location = (Core.configuration.get('baseurl') + `m/x/wmon/print/jurnalkaskecil`);
        (new CoreConfirm('Cetak laporan?')).positive((e) => {
          // window.open(location, '_blank');
          $('#form-print').attr('action', location).trigger('submit');
        }).show();
      });
    }

    onLoad() {
      this.ajax.get('m/x/wmon/transaksiApi/getYearList').then(years => {
        App.populateTransaksiYearList(years);
        $('#form-search').trigger('submit');
        
      });
    }

  }

  App.populateTransaksiYearList = (years) => {
    let html = '';
    years.forEach(year => html += `<option value="${year.tahun}">${year.tahun}</option>`);
    $('.input-tahun').html(html);
    $('.input-bulan').val((new Date).getMonth() + 1).trigger('change');
  }
  App.populateTransaksi = (transaksis) => {
    let html = '';
    html += `<table class="table fs-6 datatable"><thead><tr>`;
    html += `<th data-col="no">No</th><th data-col="tanggal">Tanggal</th><th data-col="kodejenistransaksi">Kode</th>`
    html += `<th data-col="akundebit">Debit</th>`;
    html += `<th data-col="akunkredit">Kredit</th><th data-col="nominal">Nominal</th><th data-col="keterangan">Keterangan</th>`;
    html += `</tr></thead><tbody>`;

    transaksis.forEach(transaksi => {
      let prodi = "-";
      if (transaksi.prodi == "D3") prodi = "D3 Kebidanan";
      if (transaksi.prodi == "D3F") prodi = "D3 Farmasi";
      if (transaksi.prodi == "MIK") prodi = "Manajemen Informasi Kesehatan";
      if (transaksi.prodi == "FIS") prodi = "Fisioterapi";

      html += `<tr class="fs-6">`;
      html += `<td>${transaksi.no}</td><td class="text-nowrap">${transaksi.tanggal}</td><td>${transaksi.kodejenistransaksi}</td><td>${transaksi.akundebit}</td>`;
      html += `<td>${transaksi.akunkredit}</td><td class="text-nowrap text-end">${transaksi.nominal}</td><td>${transaksi.keterangan}</td>`;
      html += `</tr>`;
    });
    html += `</tbody></table>`;

    if (transaksis.length == 0) html = '<div class="text-center border border-1 border-danger rounded p-2 bg-danger-subtle"><em class="text-danger">Tidak ada data. Silakan gunakan kata kunci yang lain.</em></div>';
    $('#list-transaksi').html(html);
    $('#list-transaksi table').DataTable({
      pagingType: 'full_numbers',
      pageLength: parseInt($('#form-search .input-perpage').val())
    });
  }
  App.format = (amount) => {
    amount = amount.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.');
    if(amount.indexOf('.') === -1) return amount;// return amount + '.00';
    var decimals = amount.split('.')[1];
    return decimals.length < 2 ? amount + '0' : amount;
  };
  App.terbilang = (nominal) => {
    nominal = parseInt(nominal);
    let bilangan = ["", "Satu", "Dua", "Tiga", "Empat",
                    "Lima", "Enam", "Tujuh", "Delapan",
                    "Sembilan", "Sepuluh", "Sebelas"];
    if (nominal <= 0) return "";
    if (nominal < 12) return bilangan[nominal] + " ";
    else if (nominal < 20) return App.terbilang(nominal - 10) + "Belas ";
    else if (nominal < 100) return App.terbilang((nominal / 10)) + "Puluh " + App.terbilang(nominal % 10);
    else if (nominal < 200) return "Seratus " + App.terbilang(nominal - 100);
    else if (nominal < 1000) return App.terbilang((nominal / 100)) + "Ratus " + App.terbilang(nominal % 100);
    else if (nominal < 2000) return "Seribu " + App.terbilang(nominal - 1000);
    else if (nominal < 1000000) return App.terbilang((nominal / 1000)) + "Ribu " + App.terbilang(nominal % 1000);
    else if (nominal < 1000000000) return App.terbilang((nominal / 1000000)) + "Juta " + App.terbilang(nominal % 1000000);
    else if (nominal < 1000000000000) return App.terbilang((nominal / 1000000000)) + "Milyar " + App.terbilang(nominal % 1000000000);
    else return "";
  }

  new App();

});