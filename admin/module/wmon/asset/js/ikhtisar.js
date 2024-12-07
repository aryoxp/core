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
      $('form#ikhtisar').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let tahun = $('select[name="tahun"]').val();
        // let tgmulai = $('input[name="tgmulai"]').val().split("/").reverse().join("-");
        // let tgsampai = $('input[name="tgsampai"]').val().split("/").reverse().join("-");
        let postvalue = {
          tahun: tahun
        }; //console.log(postvalue);
        Promise.all([
          this.ajax.post(`m/x/wmon/laporanApi/ikhtisarkas`, postvalue),
          this.ajax.post(`m/x/wmon/laporanApi/ikhtisarpendapatan`, postvalue),
          this.ajax.post(`m/x/wmon/laporanApi/ikhtisarbiaya`, postvalue)
        ]).then(results => { console.log(results);
          let kases = results[0];
          let pendapatans = results[1];
          let biayas = results[2];
          App.populateIkhtisarKas(kases);
          App.populateIkhtisarPendapatan(pendapatans);
          App.populateIkhtisarBiaya(biayas);
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
      // $('input[name="tgmulai"]').datepicker({
      //   format: 'dd/mm/yyyy',
      //   autoclose: true,
      //   zIndexOffset: 1050
      // });
      // $('input[name="tgsampai"]').datepicker({
      //   format: 'dd/mm/yyyy',
      //   autoclose: true,
      //   zIndexOffset: 1050
      // });
      // var date = new Date();
      // var mulai = new Date(date.getFullYear(), 0, 1);
      // var sampai = new Date(date.getFullYear(), 11, 31);
      // $('input[name="tgmulai"]').datepicker('setDate', mulai);
      // $('input[name="tgsampai"]').datepicker('setDate', sampai);
      // let tanggal = $('#input-tanggal').data().datepicker.getFormattedDate('yyyy-mm-dd');

      this.ajax.get('m/x/wmon/transaksiApi/getYearList')
        .then(years => {
          App.populateTransaksiYearList(years);
          $('form#ikhtisar').trigger('submit');
        });
    }

  }

  App.populateAkun = (akuns) => {
    let html = '';
    akuns.forEach(akun => html += `<option value="${akun.kode}">${akun.nama}</option>`);
    $('select[name="kode"]').html(html);
  }

  App.populateTransaksiYearList = (years) => {
    let html = '';
    years.forEach(year => html += `<option value="${year.tahun}">${year.tahun}</option>`);
    $('select[name="tahun"]').html(html);
  }
  App.populateIkhtisarKas = (kases) => { console.log(kases);
    let html = '';
    html += `<table class="table fs-6 datatable"><thead><tr class="sticky-top bg-light shadow">`;
    html += `<th>No</th>`;
    html += `<th data-col="no">Kode</th><th>Bulan</th>`
    html += `<th>Debit</th>`;
    html += `<th>Kredit</th><th>Total</th>`;
    html += `</tr></thead><tbody>`;
    let no = 0;
    kases.forEach(kas => {
      html += `<tr class="fs-6">`;
      html += `<td class="text-center">${++no}</td>`;
      // html += `<td class="text-nowrap text-center">${kas.no} <span class="badge bg-primary px-2 py-1 ms-2"><i class="bi bi-search"></i></span></td>`;
      html += `<td class="text-nowrap text-center">${kas.kode}</td>`;
      html += `<td class="text-nowrap text-center">${kas.bulan}</td>`;
      html += `<td class="text-end">Rp ${App.format(kas.debit)}</td>`;
      html += `<td class="text-end">Rp ${App.format(kas.kredit)}</td>`;
      html += `<td class="text-end">Rp ${App.format(kas.total)}</td>`;
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    if (kases.length == 0) html = '<div class="text-center border border-1 border-danger rounded p-2 bg-danger-subtle"><em class="text-danger">Tidak ada data. Silakan gunakan kata kunci yang lain.</em></div>';
    $('#list-ikhtisar-kas').html(html);
  }
  App.format = (amount) => {
    if(amount == null || /^\s+$/.test(amount)) return 0;
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