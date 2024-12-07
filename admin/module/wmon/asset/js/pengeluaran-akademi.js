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
      $('#form-search-pengeluaran').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let perpage = parseInt($('#form-search-pengeluaran .input-perpage-pengeluaran').val())
        let year = $('#form-search-pengeluaran .input-year-pengeluaran').val();
        let month = $('#form-search-pengeluaran .input-month-pengeluaran').val();
        let page = (!App.pagination || 
          year != App.pagination.year || 
          month != App.pagination.month) ?
          1 : App.pagination.page;
        this.ajax.post(`m/x/wmon/transaksiApi/searchPengeluaranAkademi/${page}/${perpage}`, {
          year: year,
          month: month
        }).then(results => { // console.log(results);
          let transaksis = results.transaksi;
          let count = parseInt(results.count);
          App.populateTransaksiPengeluaranAkademi(transaksis);
          if (App.pagination) {
            App.pagination.year = year;
            App.pagination.month = month;
            App.pagination.update(count, perpage);  
          } else {
            App.pagination = 
              Pagination.instance('.pagination-transaksi', count, perpage).listen('#form-search-pengeluaran').update(count, perpage);
            App.pagination.year = year;
            App.pagination.month = month;
          }
        });
      });
      $('#list-transaksi').on('click', '.bt-delete', (e) => {
        let no = $(e.currentTarget).parents('.transaksi-item').attr('data-no');
        let row = $(e.currentTarget).parents('.transaksi-item');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> transaksi <span class="text-danger">${no}</span> yang dipilih? Catatan transaksi akan dihapus secara <span class="text-danger">PERMANEN<span>.`)
          .title('<span class="text-danger">DELETE</span>')).positive((e) => {
            this.ajax.post(`m/x/wmon/transaksiApi/deleteTransaksi`,{
              no: no
            }).then(result => { // console.log(result);
              row.fadeOut('fast', () => row.remove());
              App.getCatatanPembayaranMahasiswa(nrm);
              App.getRekapitulasiPembayaranMahasiswa(nrm);
            });
          }).show();
      });
      $('#input-nominal').on("keypress", (e) => {
        if (isNaN(e.key)) e.preventDefault();
      }).on('keyup', e => {
        let terbilang = App.terbilang($(e.currentTarget).val());
        $('#input-terbilang').html(terbilang + " Rupiah");
      });
      $('#form-pembayaran').on('click', '.bt-bayar', (e) => {
        e.preventDefault();
        e.stopPropagation();
        $(e.currentTarget).parents('form').get(0).classList.add('was-validated');
        let kodejenistransaksi = 'KKBK';
        let prodi = $('#input-prodi').val();
        let nominal = $('#input-nominal').val();
        let kakundebit = $('#input-kakundebit').val();
        let kakunkredit = $('#input-kakunkredit').val();
        let keterangan = $('#input-keterangan').val();
        let username = 'admin'; // TODO: replace!
        let postdata = {
          kodejenistransaksi: kodejenistransaksi,
          kakundebit: kakundebit,
          kakunkredit: kakunkredit,
          nominal: nominal,
          prodi: prodi ? prodi : null,
          keterangan: keterangan,
          username: username
        }; // console.log(postdata);
        if (nominal.length == 0) {
          (new CoreInfo('Nominal pengeluaran belum diisi.')).show();
          return;
        }
        let akundebit = $('#input-kakundebit option:selected').html();
        (new CoreConfirm(`Catat pengeluaran <span class="text-danger">${akundebit}</span> sebesar ${App.format(nominal)}?`)).positive((e) => {
          this.ajax.post('m/x/wmon/transaksiApi/catatTransaksiPengeluaranAkademi'
            , postdata).then(result => { // console.log(result);
            $('#input-keterangan').val('');
            $('#input-nominal').val('').trigger('change');
            $('#input-terbilang').html('');
            $('#form-search-pengeluaran').trigger('submit');
            (new CoreInfo(`PengeluaranAkademi <span class="text-danger">${akundebit}</span> telah dicatat.`)).show();
          }, error => (new CoreError(error)).show());
        }).show();
      });
    }

    onLoad() {
      let kodeJenisTransaksi = 'KKBK';
      Promise.all([
        this.ajax.get(`m/x/wmon/transaksiApi/getAkunDebitJenisTransaksi/${kodeJenisTransaksi}`),
        this.ajax.get(`m/x/wmon/transaksiApi/getAkunKreditJenisTransaksi/${kodeJenisTransaksi}`),
        this.ajax.get('m/x/wmon/transaksiApi/getYearList')
      ]).then(result => { // console.log(result);
        App.showAkunDebits(result[0]);
        App.showAkunKredits(result[1]);
        App.populateTransaksiYearList(result[2]);
        $('#form-search-pengeluaran').trigger('submit');
        App.updateSaldo();
      });
    }

  }

  App.showAkunDebits = (akunDebits) => {
    let listHtml = '';
    akunDebits.forEach(akunDebit => {
      listHtml += `<option value="${akunDebit.kode}">${akunDebit.nama}</option>`;
    });
    $('#input-kakundebit').html(listHtml);
  }
  App.showAkunKredits = (akunKredits) => {
    let listHtml = '';
    akunKredits.forEach(akunKredit => {
      listHtml += `<option value="${akunKredit.kode}">${akunKredit.nama}</option>`;
    });
    $('#input-kakunkredit').html(listHtml);
  }
  App.populateTransaksiYearList = (years) => {
    let html = '';
    years.forEach(year => html += `<option value="${year.tahun}">${year.tahun}</option>`);
    $('.input-year-pengeluaran').html(html);
    $('.input-month-pengeluaran').val((new Date).getMonth() + 1).trigger('change');
  }
  App.populateTransaksiPengeluaranAkademi = (transaksis) => {
    let html = '';
    transaksis.forEach(transaksi => {
      html += `<div class="transaksi-item list-item py-1 px-2 border-bottom" data-no="${transaksi.no}">`
      html += `<div class="d-flex justify-content-between">`;
      html += `<span class="d-flex align-items-center text-nowrap text-truncate">`;
      html += `${transaksi.tanggal} ${transaksi.jam} `;
      html += `<span class="text-primary ms-2">${transaksi.jenispengeluaran}</span> `;
      html += `<span class="text-danger ms-2">${App.format(transaksi.nominal)}</span> `;
      html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">${transaksi.no}</span>`
      html += `<span class="badge rounded border-1 bg-secondary text-light ms-2">${transaksi.sumberdana}</span>`
      html += `</span>`;
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-danger text-light bt-delete"><i class="bi bi-x-lg"></i></span>`;
      html += `</div>`;
      html += `<div style="margin-right: 100px;">`;
      html += transaksi.prodi ? `<span class="badge rounded border-1 bg-success text-light me-2">${transaksi.prodi}</span>` : '';
      html += transaksi.keterangan ? `<span class="text-muted">${transaksi.keterangan}</span>` : '';
      html += `</div>`
      html += `</div>`;
    });
    if (transaksis.length == 0) html = '<div class="text-center border border-1 border-warning rounded p-2 bg-warning-subtle"><em class="text-muted">Tidak ada data. Silakan pilih tahun dan bulan lainnya.</em></div>';
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