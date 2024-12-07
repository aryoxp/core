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
      $('#form-search-tagihan').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let perpage = parseInt($('#form-search-tagihan .input-perpage-tagihan').val())
        let year = $('#form-search-tagihan .input-year-tagihan').val();
        let month = $('#form-search-tagihan .input-month-tagihan').val();
        let page = (!App.pagination || 
          year != App.pagination.year || 
          month != App.pagination.month) ?
          1 : App.pagination.page;
        this.ajax.post(`m/x/wmon/transaksiApi/searchTagihan/${page}/${perpage}`, {
          year: year,
          month: month
        }).then(results => { console.log(results);
          let transaksis = results.transaksi;
          let count = parseInt(results.count);
          App.populateTransaksiTagihan(transaksis);
          if (App.pagination) {
            App.pagination.year = year;
            App.pagination.month = month;
            App.pagination.update(count, perpage);  
          } else {
            App.pagination = 
              Pagination.instance('.pagination-transaksi', count, perpage).listen('#form-search-tagihan').update(count, perpage);
            App.pagination.year = year;
            App.pagination.month = month;
          }
        });
      });
      $('#list-transaksi').on('click', '.bt-bayar', (e) => {
        $('#form-pembayaran-tagihan select[name="input-kakundebit"]').val('').trigger('change');
        $('#form-pembayaran-tagihan select[name="input-kakunkredit"]').val('').trigger('change');
        $('#form-pembayaran-tagihan input[name="input-nominal"]').val('');
        $('#form-pembayaran-tagihan textarea[name="input-keterangan"]').val('');
        let no = $(e.currentTarget).parents('.transaksi-item').attr('data-no');
        let kodejenistransaksi = 'BTGH';
        Promise.all([
          this.ajax.get(`m/x/wmon/transaksiApi/getAkunDebitJenisTransaksi/${kodejenistransaksi}`),
          this.ajax.get(`m/x/wmon/transaksiApi/getAkunKreditJenisTransaksi/${kodejenistransaksi}`),
          this.ajax.get(`m/x/wmon/transaksiApi/getHutang/${no}`)
        ]).then(results => {
          let akundebits = results[0];
          let akunkredits = results[1];
          let hutang = results[2];
          App.bayarDialog = (new CoreWindow('#form-pembayaran-tagihan', {
            draggable: true,
            width: '550px'
          })).show();
          App.bayarDialog.kodejenistransaksi = kodejenistransaksi;
          App.bayarDialog.notagihan = hutang.no;
          let html = '';
          akundebits.forEach(akundebit => {
            html += `<option value="${akundebit.kode}">${akundebit.nama}</option>`;
          });
          $('#form-pembayaran-tagihan select[name="input-kakundebit"]').html(html);
          html = '';
          akunkredits.forEach(akunkredit => {
            html += `<option value="${akunkredit.kode}">${akunkredit.nama}</option>`;
          });
          $('#form-pembayaran-tagihan select[name="input-kakunkredit"]').html(html);
          $('#form-pembayaran-tagihan input[name="input-tanggal"]').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
          });
          var date = new Date();
          var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          $('#form-pembayaran-tagihan input[name="input-tanggal"]').datepicker('setDate', today);
          html = '';
          html += `<div><span class="me-2">${hutang.tanggal} ${hutang.jam}</span>`;
          html += `<span class="badge rounded border-1 bg-warning text-dark me-2">${hutang.no}</span></div>`;
          html += `<div><span class="text-primary me-2">${hutang.jenistagihan}</span> `;
          html += `<span class="text-danger me-2">${App.format(hutang.nominal)}</span></div>`;
          $('#form-pembayaran-tagihan .info-hutang').html(html);
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
            }, error => (new CoreError(error)).show());
          }).show();
      });
      $('#list-transaksi').on('click', '.bt-detail', (e) => {
        let no = $(e.currentTarget).parents('.transaksi-item').attr('data-no');
        this.ajax.get(`m/x/wmon/transaksiApi/getHutang/${no}`).then(hutang => {
          let html = '';
          html += `<div><span class="me-2">${hutang.tanggal} ${hutang.jam}</span>`;
          html += `<span class="badge rounded border-1 bg-warning text-dark me-2">${hutang.no}</span></div>`;
          html += `<div><span class="text-primary me-2">${hutang.jenistagihan}</span> `;
          html += `<span class="text-danger me-2">${App.format(hutang.nominal)}</span></div>`;
          html += `<div>${hutang.keterangan}</div>`;
          $('#dialog-pembayaran-tagihan .info-tagihan').html(html);
        });
        this.ajax.post(`m/x/wmon/transaksiApi/getListPembayaranTagihan/${no}`).then(pembayarans => { // console.log(pembayarans);
          App.populatePembayaranTagihan(pembayarans);
          App.dialogPembayaran = (new CoreWindow('#dialog-pembayaran-tagihan', {
            draggable: true,
            width: '550px'
          })).show();
        });
      });
      $('#input-nominal').on("keypress", (e) => {
        if (isNaN(e.key)) e.preventDefault();
      }).on('keyup', e => {
        let terbilang = App.terbilang($(e.currentTarget).val());
        $('#input-terbilang').html(terbilang + " Rupiah");
      });
      $('#form-pembayaran-tagihan .input-nominal').on("keypress", (e) => {
        if (isNaN(e.key)) e.preventDefault();
      }).on('keyup', e => {
        let terbilang = App.terbilang($(e.currentTarget).val());
        $('#form-pembayaran-tagihan .input-terbilang').html(terbilang + " Rupiah");
      });
      $('#form-tagihan').on('click', '.bt-catat', (e) => {
        e.preventDefault();
        e.stopPropagation();
        $(e.currentTarget).parents('form').get(0).classList.add('was-validated');
        let kodejenistransaksi = 'CTGH';
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
          keterangan: keterangan,
          username: username
        }; // console.log(postdata);
        if (nominal.length == 0) {
          (new CoreInfo('Nominal tagihan belum diisi.')).show();
          return;
        }
        let akundebit = $('#input-kakundebit option:selected').html();
        (new CoreConfirm(`Catat tagihan <span class="text-danger">${akundebit}</span> sebesar ${App.format(nominal)}?`)).positive((e) => {
          this.ajax.post('m/x/wmon/transaksiApi/catatTagihan'
            , postdata).then(result => { // console.log(result);
            $('#input-keterangan').val('');
            $('#input-nominal').val('').trigger('change');
            $('#input-terbilang').html('');
            $('#form-search-tagihan').trigger('submit');
            (new CoreInfo(`Tagihan <span class="text-danger">${akundebit}</span> telah dicatat.`)).show();
          }, error => (new CoreError(error)).show());
        }).show();
      });
      $('#form-pembayaran-tagihan').on('click', '.bt-bayar', (e) => {
        e.preventDefault();
        e.stopPropagation();
        $(e.currentTarget).parents('form').get(0).classList.add('was-validated');
        let kodejenistransaksi = 'BTGH';
        let nominal = $('#form-pembayaran-tagihan input[name="input-nominal"]').val();
        let kakundebit = $('#form-pembayaran-tagihan select[name="input-kakundebit"]').val();
        let kakunkredit = $('#form-pembayaran-tagihan select[name="input-kakunkredit"]').val();
        let keterangan = $('#form-pembayaran-tagihan textarea[name="input-keterangan"]').val();
        let username = 'admin'; // TODO: replace!
        let postdata = {
          kodejenistransaksi: kodejenistransaksi,
          kakundebit: kakundebit,
          kakunkredit: kakunkredit,
          nominal: nominal,
          notagihan: App.bayarDialog.notagihan,
          keterangan: keterangan,
          username: username
        }; console.log(postdata);
        if (nominal.length == 0) {
          (new CoreInfo('Nominal tagihan belum diisi.')).show();
          return;
        }
        let akundebit = $('#form-pembayaran-tagihan select[name="input-kakundebit"] option:selected').html();
        (new CoreConfirm(`Catat tagihan <span class="text-danger">${akundebit}</span> sebesar ${App.format(nominal)}?`)).positive((e) => {
          this.ajax.post('m/x/wmon/transaksiApi/bayarTagihan', postdata)
            .then(result => { console.warn(result);
            $('#form-pembayaran-tagihan select[name="input-kakundebit"]').val('').trigger('change');
            $('#form-pembayaran-tagihan select[name="input-kakunkredit"]').val('').trigger('change');
            $('#form-pembayaran-tagihan input[name="input-nominal"]').val('');
            $('#form-pembayaran-tagihan textarea[name="input-keterangan"]').val('');
            $('#form-pembayaran-tagihan .input-terbilang').html('');
            $('#form-search-tagihan').trigger('submit');
            App.bayarDialog.hide();
            (new CoreInfo(`Pembayaran tagihan <span class="text-danger">${akundebit}</span> telah dicatat.`)).show();
          }, error => (new CoreError(error)).show());
        }).show();
      });
      $('#dialog-pembayaran-tagihan .list-pembayaran').on('click', '.bt-delete', (e) => {
        let no = $(e.currentTarget).parents('.pembayaran-item').attr('data-no');
        let row = $(e.currentTarget).parents('.pembayaran-item');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> transaksi <span class="text-danger">${no}</span> yang dipilih? Catatan transaksi akan dihapus secara <span class="text-danger">PERMANEN<span>.`)
          .title('<span class="text-danger">DELETE</span>')).positive((e) => {
            this.ajax.post(`m/x/wmon/transaksiApi/deleteTransaksi`,{
              no: no
            }).then(result => { // console.log(result);
              row.fadeOut('fast', () => row.remove());
              $('#form-search-tagihan').trigger('submit');
            });
          }).show();
      });
    }

    onLoad() {
      let kodeJenisTransaksi = 'CTGH';
      Promise.all([
        this.ajax.get(`m/x/wmon/transaksiApi/getAkunDebitJenisTransaksi/${kodeJenisTransaksi}`),
        this.ajax.get(`m/x/wmon/transaksiApi/getAkunKreditJenisTransaksi/${kodeJenisTransaksi}`),
        this.ajax.get('m/x/wmon/transaksiApi/getYearList')
      ]).then(result => { // console.log(result);
        App.showAkunDebits(result[0]);
        App.showAkunKredits(result[1]);
        App.populateTransaksiYearList(result[2]);
        $('#form-search-tagihan').trigger('submit');
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
    $('.input-year-tagihan').html(html);
    $('.input-month-tagihan').val((new Date).getMonth() + 1).trigger('change');
  }
  App.populateTransaksiTagihan = (transaksis) => {
    let html = '';
    transaksis.forEach(transaksi => {
      html += `<div class="transaksi-item list-item py-1 px-2 border-bottom" data-no="${transaksi.no}">`
      html += `<div class="d-flex justify-content-between">`;
      html += `<span class="d-flex align-items-center text-nowrap text-truncate">`;
      html += `${transaksi.tanggal} ${transaksi.jam} `;
      html += `<span class="text-primary ms-2">${transaksi.jenistagihan}</span> `;
      html += `<span class="text-danger ms-2">${App.format(transaksi.nominal)}</span> `;
      html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">${transaksi.no}</span>`
      // html += `<span class="badge rounded border-1 bg-secondary text-light ms-2">${transaksi.sumberdana}</span>`
      html += `</span>`;
      html += `<span class="text-nowrap">`;
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-success text-light bt-detail"><i class="bi bi-list-check"></i> Detail</span>`;
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-primary text-light bt-bayar"><i class="bi bi-cash-coin"></i> Bayar</span>`;
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-danger text-light bt-delete"><i class="bi bi-x-lg"></i></span>`;
      html += `</span>`;
      html += `</div>`;
      html += `<div style="margin-right: 100px;">`;
      html += `<span class="text-dark me-2">Terbayar: <span class="text-primary">${App.format(transaksi.terbayar)}</span></span>`;
      html += parseInt(transaksi.nominal) <= parseInt(transaksi.terbayar) ? `<span class="text-light bg-success badge rounded">Lunas</span>` : '<span class="text-light bg-danger badge rounded">Belum Lunas</span>';
      html += `</div>`
      html += `<div style="margin-right: 100px;">`;
      html += transaksi.keterangan ? `<span class="text-muted">${transaksi.keterangan}</span>` : '';
      html += `</div>`
      html += `</div>`;
    });
    if (transaksis.length == 0) html = '<div class="text-center border border-1 border-warning rounded p-2 bg-warning-subtle"><em class="text-muted">Tidak ada data. Silakan pilih tahun dan bulan lainnya.</em></div>';
    $('#list-transaksi').html(html);
  }
  App.populatePembayaranTagihan = (pembayarans) => {
    let html = '';
    let total = 0;
    pembayarans.forEach(pembayaran => {
      total += parseInt(pembayaran.nominal);
      html += `<div class="pembayaran-item list-item py-1 px-2 border-bottom" data-no="${pembayaran.no}">`
      html += `<div class="d-flex justify-content-between">`;
      html += `<span class="d-flex align-items-center text-nowrap text-truncate">`;
      html += `${pembayaran.tanggal} ${pembayaran.jam} `;
      // html += `<span class="text-primary ms-2">${pembayaran.jenistagihan}</span> `;
      html += `<span class="text-danger ms-2">${App.format(pembayaran.nominal)}</span> `;
      html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">${pembayaran.no}</span>`
      html += `<span class="badge rounded border-1 bg-secondary text-light ms-2">${pembayaran.sumberdana}</span>`
      html += `</span>`;
      html += `<span>`;
      // html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-primary text-light bt-bayar"><i class="bi bi-cash-coin"></i> Bayar</span>`;
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-danger text-light bt-delete"><i class="bi bi-x-lg"></i></span>`;
      html += `</span>`;
      html += `</div>`;
      // html += `<div style="margin-right: 100px;">`;
      // html += `<span class="text-dark me-2">Terbayar: <span class="text-primary">${App.format(pembayaran.terbayar)}</span></span>`;
      // html += parseInt(pembayaran.nominal) <= parseInt(pembayaran.terbayar) ? `<span class="text-light bg-success badge rounded">Lunas</span>` : '<span class="text-light bg-danger badge rounded">Belum Lunas</span>';
      // html += `</div>`
      html += `<div style="margin-right: 100px;">`;
      // html += pembayaran.keterangan ? `<span class="text-muted">${pembayaran.keterangan}</span>` : '';
      html += `</div>`
      html += `</div>`;
    });
    if (pembayarans.length == 0) html = '<div class="text-center border border-1 border-warning rounded p-2 bg-warning-subtle"><em class="text-muted">Tidak ada data. Silakan pilih tahun dan bulan lainnya.</em></div>';
    $('#dialog-pembayaran-tagihan .list-pembayaran').html(html);
    $('#dialog-pembayaran-tagihan .info-total-pembayaran').html(`Total terbayar: <span class="text-danger">${App.format(total)}</span>`);
  };
  App.format = (amount) => { if (amount == null) amount = "0";
    amount = amount.toString();
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