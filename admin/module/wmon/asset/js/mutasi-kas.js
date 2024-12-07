$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      App.ajax = this.ajax;
      this.handleEvent();
      this.onLoad();
    }

    handleEvent() {
      $('#form-search-penerimaan').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let perpage = parseInt($('#form-search-penerimaan .input-perpage-penerimaan').val())
        let year = $('#form-search-penerimaan .input-year-penerimaan').val();
        let month = $('#form-search-penerimaan .input-month-penerimaan').val();
        let page = (!App.paginationPenerimaan || 
          year != App.paginationPenerimaan.year || 
          month != App.paginationPenerimaan.month) ?
          1 : App.paginationPenerimaan.page;
        Promise.all([
          this.ajax.post(`m/x/wmon/transaksiApi/searchMutasiPenerimaanKas/${page}/${perpage}/${year}/${month}`, {
            year: year,
            month: month
          })])
        .then(results => { // console.log(results);
          let transaksis = results[0].transaksi;
          let count = parseInt(results[0].count);
          App.populateTransaksiPenerimaan(transaksis)
          if (App.paginationPenerimaan) {
            App.paginationPenerimaan.year = year;
            App.paginationPenerimaan.month = month;
            App.paginationPenerimaan.update(count, perpage);  
          } else
            App.paginationPenerimaan = 
              Pagination.instance('.penerimaan-pagination', count, perpage).listen('#form-search-penerimaan').update(count, perpage);
          App.paginationPenerimaan.year = year;
          App.paginationPenerimaan.month = month;
        });
      });
      $('#penerimaan-selection').on('click', '.bt-select-all-penerimaan', (e) => {
        $('.penerimaan-list input.cb-transaksi-penerimaan').prop('checked', true)
      })
      $('#penerimaan-selection').on('click', '.bt-unselect-all-penerimaan', (e) => {
        $('.penerimaan-list input.cb-transaksi-penerimaan').prop('checked', false)
      })
      $('#penerimaan-selection').on('click', '.bt-delete-selected', (e) => {
        let selected = [];
        $('.transaksi-list input.cb-transaksi:checked').each((index, item) => {
          selected.push($(item).attr('data-kode'))
        });
        console.error(selected);
        // TODO: confirm and delete
      })
      $('.penerimaan-list').on('click', '.bt-delete', (e) => {
        let row = $(e.currentTarget).parents('.transaksi-item');
        let no = row.attr('data-no');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> catatan transaksi mutasi ini?<br>Catatan yang dihapus TIDAK DAPAT dikembalikan.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> HAPUS Catatan Mutasi</span>')
          .positive(e => {
            this.ajax.post('m/x/wmon/transaksiApi/deleteMutasiPenerimaanKas', {
              no: no
            }).then((response) => {
              if (response) {
                (new CoreInfo("Catatan mutasi telah dihapus.")).title('Information').show();
                row.slideUp('fast', () => {
                  row.remove();
                });
              }
              App.updateSaldo();
            }, (err) => {
              (new CoreInfo(err)).show();
            });
          })
          .show();
        console.log(row, $(e.currentTarget), row.attr('data-kode'));
      });
      $('.penerimaan-list').on('click', '.bt-detail', (e) => {
        let row = $(e.currentTarget).parents('.transaksi-item');
        let no = row.attr('data-no');
        this.ajax.get(`m/x/wmon/transaksiApi/getMutasiPenerimaanKas/${no}`)
          .then(transaksi => { console.log(transaksi);
            let html = '';
            html += `<table class="table">`;
            html += `<tr>`;
            html += `<td>No</td><td>${transaksi.no}</td>`;
            html += `</tr><tr>`;
            html += `<td>Tanggal/Jam</td><td>${transaksi.tanggal} ${transaksi.jam}</td>`;
            html += `</tr><tr>`;
            html += `<td>Nominal</td><td class="text-danger">${App.format(transaksi.nominal)}</td>`;
            html += `</tr><tr>`;
            html += `<td>Keterangan</td><td>${transaksi.keterangan}</td>`;
            html += `</tr><tr>`;
            html += `<td>Entree</td><td>${transaksi.username}</td>`;
            html += `</tr>`;
            html += `</table>`;
            (new CoreInfo(html).title('Mutasi Penerimaan')).show();
          });
      });

      $('#form-search-pengembalian').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let perpage = parseInt($('#form-search-pengembalian .input-perpage-pengembalian').val())
        let year = $('#form-search-pengembalian .input-year-pengembalian').val();
        let month = $('#form-search-pengembalian .input-month-pengembalian').val();
        let page = (!App.paginationPengembalian || 
          year != App.paginationPengembalian.year || 
          month != App.paginationPengembalian.month) ?
          1 : App.paginationPengembalian.page;
        Promise.all([
          this.ajax.post(`m/x/wmon/transaksiApi/searchMutasiPengembalianKas/${page}/${perpage}/${year}/${month}`, {
            year: year,
            month: month
          })])
        .then(results => { // console.log(results);
          let transaksis = results[0].transaksi;
          let count = parseInt(results[0].count);
          App.populateTransaksiPengembalian(transaksis)
          if (App.paginationPengembalian) {
            App.paginationPengembalian.year = year;
            App.paginationPengembalian.month = month;
            App.paginationPengembalian.update(count, perpage);  
          } else
            App.paginationPengembalian = 
              Pagination.instance('.pengembalian-pagination', count, perpage).listen('#form-search-pengembalian').update(count, perpage);
          App.paginationPengembalian.year = year;
          App.paginationPengembalian.month = month;
        });
      });
      $('#pengembalian-selection').on('click', '.bt-select-all-pengembalian', (e) => {
        $('.pengembalian-list input.cb-transaksi-pengembalian').prop('checked', true)
      })
      $('#pengembalian-selection').on('click', '.bt-unselect-all-pengembalian', (e) => {
        $('.pengembalian-list input.cb-transaksi-pengembalian').prop('checked', false)
      })
      $('#pengembalian-selection').on('click', '.bt-delete-selected', (e) => {
        let selected = [];
        $('.transaksi-list input.cb-transaksi:checked').each((index, item) => {
          selected.push($(item).attr('data-kode'))
        });
        console.error(selected);
        // TODO: confirm and delete
      })
      $('.pengembalian-list').on('click', '.bt-delete', (e) => {
        let row = $(e.currentTarget).parents('.transaksi-item');
        let no = row.attr('data-no');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> catatan transaksi mutasi ini?<br>Catatan yang dihapus TIDAK DAPAT dikembalikan.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> HAPUS Catatan Mutasi</span>')
          .positive(e => {
            this.ajax.post('m/x/wmon/transaksiApi/deleteMutasiPengembalianKas', {
              no: no
            }).then((response) => {
              if (response) {
                (new CoreInfo("Catatan mutasi telah dihapus.")).title('Information').show();
                row.slideUp('fast', () => {
                  row.remove();
                });
              }
              App.updateSaldo();
            }, (err) => {
              (new CoreInfo(err)).show();
            });
          })
          .show();
        console.log(row, $(e.currentTarget), row.attr('data-kode'));
      });
      $('.pengembalian-list').on('click', '.bt-detail', (e) => {
        let row = $(e.currentTarget).parents('.transaksi-item');
        let no = row.attr('data-no');
        this.ajax.get(`m/x/wmon/transaksiApi/getMutasiPengembalianKas/${no}`)
          .then(transaksi => { console.log(transaksi);
            let html = '';
            html += `<table class="table">`;
            html += `<tr>`;
            html += `<td>No</td><td>${transaksi.no}</td>`;
            html += `</tr><tr>`;
            html += `<td>Tanggal/Jam</td><td>${transaksi.tanggal} ${transaksi.jam}</td>`;
            html += `</tr><tr>`;
            html += `<td>Nominal</td><td class="text-danger">${App.format(transaksi.nominal)}</td>`;
            html += `</tr><tr>`;
            html += `<td>Keterangan</td><td>${transaksi.keterangan}</td>`;
            html += `</tr><tr>`;
            html += `<td>Entree</td><td>${transaksi.username}</td>`;
            html += `</tr>`;
            html += `</table>`;
            (new CoreInfo(html).title('Mutasi Pengembalian')).show();
          });
      });


      $('#bt-new-mutasi-penerimaan').on('click', e => {
        $('#input-kakundebit').val('').trigger('change');
        $('#input-kakunkredit').val('').trigger('change');
        $('#input-nominal').val('');
        $('#input-keterangan').val('');
        let kodejenistransaksi = 'KASM';
        Promise.all([
          this.ajax.get(`m/x/wmon/transaksiApi/getAkunDebitJenisTransaksi/${kodejenistransaksi}`),
          this.ajax.get(`m/x/wmon/transaksiApi/getAkunKreditJenisTransaksi/${kodejenistransaksi}`),
        ]).then(akuns => {
          let akundebits = akuns[0];
          let akunkredits = akuns[1];
          App.mutasiDialog = (new CoreWindow('#mutasi-dialog', {
            draggable: true,
            width: '550px'
          })).show();
          App.mutasiDialog.kodejenistransaksi = kodejenistransaksi;
          let html = '';
          akundebits.forEach(akundebit => {
            html += `<option value="${akundebit.kode}">${akundebit.nama}</option>`;
          });
          $('#input-kakundebit').html(html);
          html = '';
          akunkredits.forEach(akunkredit => {
            html += `<option value="${akunkredit.kode}">${akunkredit.nama}</option>`;
          });
          $('#input-kakunkredit').html(html);
          $('#input-tanggal').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
          });
          var date = new Date();
          var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          $('#input-tanggal').datepicker('setDate', today);
        });
      });
      $('#bt-new-mutasi-pengembalian').on('click', e => {
        $('#input-kakundebit').val('').trigger('change');
        $('#input-kakunkredit').val('').trigger('change');
        $('#input-nominal').val('');
        $('#input-keterangan').val('');
        let kodejenistransaksi = 'KASK';
        Promise.all([
          this.ajax.get(`m/x/wmon/transaksiApi/getAkunDebitJenisTransaksi/${kodejenistransaksi}`),
          this.ajax.get(`m/x/wmon/transaksiApi/getAkunKreditJenisTransaksi/${kodejenistransaksi}`),
        ]).then(akuns => {
          let akundebits = akuns[0];
          let akunkredits = akuns[1];
          App.mutasiDialog = (new CoreWindow('#mutasi-dialog', {
            draggable: true,
            width: '550px'
          })).show();
          App.mutasiDialog.kodejenistransaksi = kodejenistransaksi;
          let html = '';
          akundebits.forEach(akundebit => {
            html += `<option value="${akundebit.kode}">${akundebit.nama}</option>`;
          });
          $('#input-kakundebit').html(html);
          html = '';
          akunkredits.forEach(akunkredit => {
            html += `<option value="${akunkredit.kode}">${akunkredit.nama}</option>`;
          });
          $('#input-kakunkredit').html(html);
          $('#input-tanggal').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
          });
          var date = new Date();
          var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          $('#input-tanggal').datepicker('setDate', today);
        });
      });
      $('#mutasi-dialog .btn-save').on('click', () => {
        let tanggal = $('#input-tanggal').data().datepicker.getFormattedDate('yyyy-mm-dd');
        let kakundebit = $('#input-kakundebit').val();
        let kakunkredit = $('#input-kakunkredit').val();
        let nominal = $('#input-nominal').val();
        let keterangan = $('#input-keterangan').val();
        let kodejenistransaksi = App.mutasiDialog.kodejenistransaksi;
        let username = 'admin'; // TODO: fix it!
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes(); 
        const sec = date.getSeconds();
        let jam = `${hour}:${min}:${sec}`;
        var valid = /^\d{0,12}$/.test(nominal);
        console.log(valid, nominal);
        if (!valid || /^\s+$|^$/gi.test(nominal)) {
          (new CoreInfo('Nominal mutasi tidak valid!')).title('<span class="text-danger">Error</span>').show();
          return;
        }
        // console.log(tanggal, kakundebit, kakunkredit, nominal, kodejenistransaksi, keterangan, jam);
        if (App.mutasiDialog.kodejenistransaksi == "KASM") {
          this.ajax.post('m/x/wmon/transaksiApi/insertMutasiPenerimaanKas', {
            tanggal: tanggal,
            jam: jam,
            kodejenistransaksi: kodejenistransaksi,
            kakundebit: kakundebit,
            kakunkredit: kakunkredit,
            nominal: nominal,
            keterangan: keterangan,
            username: username
          }).then((result) => { // console.log(result);
            $('#mutasi-dialog').hide();
            $('#form-search-penerimaan').trigger('submit');
            App.updateSaldo();
          });
        } else {
          this.ajax.post('m/x/wmon/transaksiApi/insertMutasiPengembalianKas', {
            tanggal: tanggal,
            jam: jam,
            kodejenistransaksi: kodejenistransaksi,
            kakundebit: kakundebit,
            kakunkredit: kakunkredit,
            nominal: nominal,
            keterangan: keterangan,
            username: username
          }).then((result) => { // console.log(result);
            $('#mutasi-dialog').hide();
            $('#form-search-pengembalian').trigger('submit');
            App.updateSaldo();
          });
        }
      });
    }

    onLoad() {
      this.ajax.get('m/x/wmon/transaksiApi/getYearList').then(years => {
        App.populateTransaksiYearList(years);
        $('#form-search-penerimaan').trigger('submit');
        $('#form-search-pengembalian').trigger('submit');
      });
      App.updateSaldo();
    }

  }

  App.populateTransaksiYearList = (years) => {
    let html = '';
    years.forEach(year => {
      html += `<option value="${year.tahun}">${year.tahun}</option>`;
    });
    $('.input-year-penerimaan').html(html);
    $('.input-year-pengembalian').html(html);
    $('.input-month-penerimaan').val((new Date).getMonth() + 1).trigger('change');
    $('.input-month-pengembalian').val((new Date).getMonth() + 1).trigger('change');
  }
  App.populateTransaksiPenerimaan = (transaksis) => { // console.log(transaksis);
    let listHtml = '';
    transaksis.forEach(transaksi => { 
      listHtml += `<div class="transaksi-item list-item d-flex align-items-center py-1 border-bottom" role="button"`;
      listHtml += `  data-no="${transaksi.no}">`;
      listHtml += `  <input type="checkbox" class="cb-transaksi-penerimaan ms-1" data-no="${transaksi.no}">`;
      listHtml += `  <span class="flex-fill ps-2 transaksi-truncate transaksi-nowrap">`;
      listHtml += `  <span>${transaksi.tanggal}</span>`;
      listHtml += `  <span class="text-danger mx-3">${App.format(transaksi.nominal)}</span>`;
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-warning text-dark">${transaksi.no}</span>`;
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-success text-light">${transaksi.username}</span>`;
      listHtml += `  </span>`;
      listHtml += `  <span class="text-end text-nowrap ms-3 btn-group-sm">`;
      listHtml += `    <button class="btn btn-sm btn-primary bt-detail p-2"><i class="bi bi-search"></i><i class="bi bi-list"></i></button>`;
      listHtml += `    <button class="btn btn-sm btn-danger bt-delete text-light p-2"><i class="bi bi-x-lg"></i></button>`;
      listHtml += `  </span>`;
      listHtml += `</div>`;
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data yang sesuai kriteria pencarian tidak ditemukan.</em>';
    $('.penerimaan-list').html(listHtml);
  }
  App.populateTransaksiPengembalian = (transaksis) => { // console.log(transaksis);
    let listHtml = '';
    transaksis.forEach(transaksi => { 
      listHtml += `<div class="transaksi-item list-item d-flex align-items-center py-1 border-bottom" role="button"`;
      listHtml += `  data-no="${transaksi.no}">`;
      listHtml += `  <input type="checkbox" class="cb-transaksi-pengembalian ms-1" data-no="${transaksi.no}">`;
      listHtml += `  <span class="flex-fill ps-2 transaksi-truncate transaksi-nowrap">`;
      listHtml += `  <span>${transaksi.tanggal}</span>`;
      listHtml += `  <span class="text-danger mx-3">${App.format(transaksi.nominal)}</span>`;
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-warning text-dark">${transaksi.no}</span>`;
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-success text-light">${transaksi.username}</span>`;
      listHtml += `  </span>`;
      listHtml += `  <span class="text-end text-nowrap ms-3 btn-group-sm">`;
      listHtml += `    <button class="btn btn-sm btn-primary bt-detail p-2"><i class="bi bi-search"></i><i class="bi bi-list"></i></button>`;
      listHtml += `    <button class="btn btn-sm btn-danger bt-delete text-light p-2"><i class="bi bi-x-lg"></i></button>`;
      listHtml += `  </span>`;
      listHtml += `</div>`;
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data yang sesuai kriteria pencarian tidak ditemukan.</em>';
    $('.pengembalian-list').html(listHtml);
  }
  App.updateSaldo = () => {
    let date = new Date();
    let tahun = date.getFullYear();
    App.ajax.post('m/x/wmon/transaksiApi/getSaldoAkun', {
      tahun: tahun,
      kodeakun: '102' 
    }).then(result => { // console.log(result)
      $('.saldo').html(App.format(result.saldo));
      $('.count-penerimaan').html(result.countpenerimaan + " <small>Trx</small>");
      $('.count-pengeluaran').html(result.countpengeluaran + " <small>Trx</small>");
    });
  }
  App.format = (amount) => {
    amount = "Rp " + amount.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.');
    if(amount.indexOf('.') === -1) return amount;// return amount + '.00';
    var decimals = amount.split('.')[1];
    return decimals.length < 2 ? amount + '0' : amount;
  };

  new App();

});