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
        let perpage = parseInt($('#form-search .input-perpage').val())
        let tanggal = $('#input-tanggal').data().datepicker.getFormattedDate('yyyy-mm-dd');
        let page = (!App.pagination || 
          tanggal != App.pagination.tanggal) ?
          1 : App.pagination.page;
        this.ajax.post(`m/x/wmon/laporanApi/getLaporanPembayaranMahasiswa/${page}/${perpage}`, {
          tanggal: tanggal
        }).then(results => { console.log(results);
          let count = results.count;
          App.populateTransaksi(results.transaksi);
          if (App.pagination) {
            App.pagination.page = page;
            App.pagination.tanggal = tanggal;
            App.pagination.update(count, perpage);  
          } else App.pagination = 
              Pagination.instance('.pagination-transaksi', count, perpage).listen('#form-search').update(count, perpage);
          App.pagination.page = page;
          App.pagination.tanggal = tanggal;
        });
      });
      $('.bt-print').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let tanggal = $('#input-tanggal').data().datepicker.getFormattedDate('yyyy-mm-dd');
        let location = (Core.configuration.get('baseurl') + `m/x/wmon/print/laporanpembayaranmahasiswa/${tanggal}`);
        (new CoreConfirm('Cetak laporan?')).positive(() => {
          window.open(location, '_blank');
        }).show();
      });
    }

    onLoad() {
      $('#input-tanggal').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
      });
      var date = new Date();
      var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      $('#input-tanggal').datepicker('setDate', today);
      let tanggal = $('#input-tanggal').data().datepicker.getFormattedDate('yyyy-mm-dd');
    }

  }

  App.populateTransaksi = (transaksis) => {
    let html = '';
    transaksis.forEach(transaksi => {
      let prodi = "-";
      if (transaksi.prodi == "D3") prodi = "D3 Kebidanan";
      if (transaksi.prodi == "D3F") prodi = "D3 Farmasi";
      if (transaksi.prodi == "MIK") prodi = "Manajemen Informasi Kesehatan";
      if (transaksi.prodi == "FIS") prodi = "Fisioterapi";
      
      html += `<div class="transaksi-item list-item d-flex justify-content-between py-1 px-2 border-bottom" data-nrm="${transaksi.nrm}">`
      html += `<span class="d-flex align-items-center text-nowrap text-truncate">`
      html += `${transaksi.namam}`
      html += `<span class="text-primary ms-2">${transaksi.pembayaran}</span>`
      html += `<span class="text-danger ms-2">${App.format(transaksi.nominal)}</span>`
      html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">NIM ${transaksi.nim ? transaksi.nim : '-'}</span>`
      html += `<span class="badge rounded border-1 bg-success text-light ms-2">${prodi}</span>`
      html += `<span class="badge rounded border-1 bg-primary text-light ms-2">${transaksi.kodekas}</span>`
      html += `</span>`;
      html += `</div>`;
    });
    if (transaksis.length == 0) html = '<div class="text-center border border-1 border-danger rounded p-2 bg-danger-subtle"><em class="text-danger">Tidak ada data. Silakan gunakan kata kunci yang lain.</em></div>';
    $('#list-transaksi').html(html);
  }
  App.format = (amount) => {
    amount = "Rp " + amount.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.');
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