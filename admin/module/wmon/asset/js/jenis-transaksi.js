$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      this.handleEvent();
      this.onLoad();
    }

    handleEvent() {
      $('#form-search').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let perpage = parseInt($('#form-search .input-perpage').val())
        let keyword = $('#form-search .input-keyword').val()
        let page = (!App.pagination || 
          keyword != App.pagination.keyword) ?
          1 : App.pagination.page;
        Promise.all([
          this.ajax.post(`m/x/wmon/transaksiApi/searchJenisTransaksi/${page}/${perpage}`, {
            keyword: keyword
          })])
        .then(results => { // console.log(results);
          let jenisTransaksis = results[0].jenistransaksi;
          let count = results[0].count;
          App.populateJenisTransaksi(jenisTransaksis)
          if (App.pagination) {
            App.pagination.keyword = keyword;
            App.pagination.update(count, perpage);  
          } else
            App.pagination = 
              Pagination.instance('.jenis-transaksi-pagination', count, perpage).listen('#form-search').update(count, perpage);
          App.pagination.keyword = keyword;
        });
      });
      $('#jenis-transaksi-selection').on('click', '.bt-select-all', (e) => {
        $('.jenis-transaksi-list input.cb-jenis-transaksi').prop('checked', true)
      })
      $('#jenis-transaksi-selection').on('click', '.bt-unselect-all', (e) => {
        $('.jenis-transaksi-list input.cb-jenis-transaksi').prop('checked', false)
      })
      $('#jenis-transaksi-selection').on('click', '.bt-delete-selected', (e) => {
        let selected = [];
        $('.jenis-transaksi-list input.cb-jenis-transaksi:checked').each((index, item) => {
          selected.push($(item).attr('data-kode'))
        });
        console.log(selected);
        // TODO: confirm and delete
      })
      $('.jenis-transaksi-list').on('click', '.bt-delete', (e) => {
        let row = $(e.currentTarget).parents('.jenis-transaksi-item');
        let kode = row.attr('data-kode');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> jenis transaksi ini?<br>Setelah dijalankan, proses ini TIDAK DAPAT dibatalkan.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> HAPUS Jenis Transaksi</span>')
          .positive(e => {
            this.ajax.post('m/x/wmon/transaksiApi/deleteJenisTransaksi', {
              kode: kode
            }).then((response) => {
              if (response) {
                (new CoreInfo("Jenis Transaksi telah dihapus.")).title('Informasi').show();
                row.slideUp('fast', () => {
                  row.remove();
                });
              }
            }, (err) => {
              (new CoreInfo(err)).show();
            });
            $('#mta-poly-context').fadeOut('fast');
          })
          .show();
        console.log(row, $(e.currentTarget), row.attr('data-kode'));
      });
      $('.jenis-transaksi-list').on('click', '.bt-edit', (e) => {
        let row = $(e.currentTarget).parents('.jenis-transaksi-item');
        let kode = row.attr('data-kode');
        this.ajax.get(`m/x/wmon/transaksiApi/getJenisTransaksi/${kode}`).then(jenisTransaksi => {
          console.warn(jenisTransaksi);
          App.jenisTransaksiDialog = (new CoreWindow('#jenis-transaksi-dialog', {
            draggable: true,
            width: '650px'
          })).show();
          $('#input-kode').val(jenisTransaksi.kode);
          $('#input-nama').val(jenisTransaksi.nama);
          $('#input-kakundebit').val(jenisTransaksi.kakundebit);
          $('#input-kakunkredit').val(jenisTransaksi.kakunkredit);
          $('#input-keterangan').val(jenisTransaksi.keterangan);
          App.jenisTransaksiDialog.kode = kode;
        });
      });
      $('.jenis-transaksi-list').on('click', '.bt-detail', (e) => {
        let row = $(e.currentTarget).parents('.jenis-transaksi-item');
        let kode = row.attr('data-kode');
        this.ajax.get(`m/x/wmon/transaksiApi/getJenisTransaksi/${kode}`)
          .then(jenisTransaksi => {
            App.showJenisTransaksi(jenisTransaksi);
            this.ajax.get(`m/x/wmon/transaksiApi/getAkunDebitJenisTransaksi/${jenisTransaksi.kode}`)
              .then(akunDebits => {
                App.showAkunDebits(akunDebits);
              });
            this.ajax.get(`m/x/wmon/transaksiApi/getAkunKreditJenisTransaksi/${jenisTransaksi.kode}`)
            .then(akunKredits => {
              App.showAkunKredits(akunKredits);
            });
            this.ajax.get(`m/x/wmon/akunApi/getAkunKategori/${jenisTransaksi.kakundebit}`)
              .then(akunDebits => {
                App.showAkunDebitsKategori(akunDebits);
              });
            this.ajax.get(`m/x/wmon/akunApi/getAkunKategori/${jenisTransaksi.kakunkredit}`)
              .then(akunKredits => {
                App.showAkunKreditsKategori(akunKredits);
              });
          });
      });
      $('#jenis-transaksi-detail .content').on('click', '.bt-add-akun-debit-jenis-transaksi', e=>{
        let kodeJenisTransaksi = $('#jenis-transaksi-detail .content').attr('data-kodejenistransaksi');
        let kodeAkun = $('.akun-debit-jenis-transaksi-list').val();
        // console.log(kodeJenisTransaksi, kodeAkun);
        this.ajax.post('m/x/wmon/transaksiApi/addAkunDebitJenisTransaksi', {
          kodejenistransaksi: kodeJenisTransaksi,
          kodeakun: kodeAkun
        }).then(result => {
          this.ajax.get(`m/x/wmon/transaksiApi/getAkunDebitJenisTransaksi/${kodeJenisTransaksi}`)
          .then(akunDebits => {
            App.showAkunDebits(akunDebits);
          });
          (new CoreInfo("Akun debit telah ditambahkan ke jenis transaksi.")).title('Informasi').show();
        });
      });
      $('#jenis-transaksi-detail .content').on('click', '.bt-remove-akun-debit', (e) => {
        let kodeJenisTransaksi = $('#jenis-transaksi-detail .content').attr('data-kodejenistransaksi');
        let kodeAkun = $(e.currentTarget).attr('data-kodeakun');
        // console.log(kodeJenisTransaksi, kodeAkun);
        let akunDebitElement = $(e.currentTarget).parents('.akun-debit');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> akun debit dari jenis transaksi ini?<br>Setelah dijalankan, proses ini TIDAK DAPAT dibatalkan.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> HAPUS Kode Akun</span>')
          .positive(e => {
            this.ajax.post('m/x/wmon/transaksiApi/removeAkunDebitJenisTransaksi', {
              kodejenistransaksi: kodeJenisTransaksi,
              kodeakun: kodeAkun
            }).then(result => {
              akunDebitElement.fadeOut();
              (new CoreInfo("Akun debit telah dihapus dari jenis transaksi.")).title('Informasi').show();
            });
          }).show();
      });
      $('#jenis-transaksi-detail .content').on('click', '.bt-add-akun-kredit-jenis-transaksi', e=>{
        let kodeJenisTransaksi = $('#jenis-transaksi-detail .content').attr('data-kodejenistransaksi');
        let kodeAkun = $('.akun-kredit-jenis-transaksi-list').val();
        // console.log(kodeJenisTransaksi, kodeAkun);
        this.ajax.post('m/x/wmon/transaksiApi/addAkunKreditJenisTransaksi', {
          kodejenistransaksi: kodeJenisTransaksi,
          kodeakun: kodeAkun
        }).then(result => {
          this.ajax.get(`m/x/wmon/transaksiApi/getAkunKreditJenisTransaksi/${kodeJenisTransaksi}`)
          .then(akunKredits => {
            App.showAkunKredits(akunKredits);
          });
          (new CoreInfo("Akun kredit telah ditambahkan ke jenis transaksi.")).title('Informasi').show();
        });
      });
      $('#jenis-transaksi-detail .content').on('click', '.bt-remove-akun-kredit', (e) => {
        let kodeJenisTransaksi = $('#jenis-transaksi-detail .content').attr('data-kodejenistransaksi');
        let kodeAkun = $(e.currentTarget).attr('data-kodeakun');
        // console.log(kodeJenisTransaksi, kodeAkun);
        let akunKreditElement = $(e.currentTarget).parents('.akun-kredit');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> akun kredit dari jenis transaksi ini?<br>Setelah dijalankan, proses ini TIDAK DAPAT dibatalkan.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> HAPUS Kode Akun</span>')
          .positive(e => {
            this.ajax.post('m/x/wmon/transaksiApi/removeAkunKreditJenisTransaksi', {
              kodejenistransaksi: kodeJenisTransaksi,
              kodeakun: kodeAkun
            }).then(result => {
              akunKreditElement.fadeOut();
              (new CoreInfo("Akun kredit telah dihapus dari jenis transaksi.")).title('Informasi').show();
            });
          }).show();
      });
      $('#bt-new-jenis-transaksi').on('click', e => {
        $('#input-kode').val('');
        $('#input-nama').val('');
        $('#input-kakundebit').val('');
        $('#input-kakunkredit').val('');
        $('#input-keterangan').val('');
        App.jenisTransaksiDialog = (new CoreWindow('#jenis-transaksi-dialog', {
          draggable: true,
          width: '650px'
        })).show();
        App.jenisTransaksiDialog.kode = null;
      });
      $('#jenis-transaksi-dialog .btn-save').on('click', () => {
        let id = App.jenisTransaksiDialog.kode;
        let kode = $('#input-kode').val();
        let nama = $('#input-nama').val();
        let keterangan = $('#input-keterangan').val();
        let kakundebit = $('#input-kakundebit').val();
        let kakunkredit = $('#input-kakunkredit').val();
        // console.log(kode, nama, keterangan, kategori);
        if (id != null) {
          this.ajax.post('m/x/wmon/transaksiApi/updateJenisTransaksi', {
            id: id,
            kode: kode,
            nama: nama,
            keterangan: keterangan,
            kakundebit: kakundebit,
            kakunkredit: kakunkredit
          }).then(result => {
            (new CoreInfo('JenisTransaksi berhasil di-update.')).show();
            App.jenisTransaksiDialog.hide();
            $('#form-search').trigger('submit');
          }, error => (new CoreInfo(error)).show());
        } else {
          this.ajax.post('m/x/wmon/transaksiApi/createJenisTransaksi', {
            kode: kode,
            nama: nama,
            keterangan: keterangan,
            kakundebit: kakundebit,
            kakunkredit: kakunkredit
          }).then(result => {
            (new CoreInfo('JenisTransaksi berhasil dibuat.')).show();
            App.jenisTransaksiDialog.hide();
            $('#form-search').trigger('submit');
          }, error => (new CoreInfo(error)).show());
        }
      });
    }

    onLoad() {
      $('#form-search').trigger('submit');
    }

  }

  App.populateJenisTransaksi = (jenisTransaksis) => { // console.log(jenistransaksis);
    let listHtml = '';
    let selected = App.selectedUsernames;
    jenisTransaksis.forEach(jenisTransaksi => { 
      let checked = selected && selected.includes(jenisTransaksi.nama) ? 'checked' : '';
      listHtml += `<div class="jenis-transaksi-item list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-akunname="${jenisTransaksi.nama}" data-name="${jenisTransaksi.nama}" data-kode="${jenisTransaksi.kode}">`
      listHtml += `  <input type="checkbox" class="cb-jenis-transaksi ms-1" data-kode="${jenisTransaksi.kode}" data-nama="${jenisTransaksi.nama}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 text-truncate text-nowrap">`
      listHtml += `  <span>${jenisTransaksi.nama}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-warning text-dark">${jenisTransaksi.kode}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-success text-light">D:${jenisTransaksi.kakundebit} K:${jenisTransaksi.kakunkredit}</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3 btn-group-sm">`
      listHtml += `    <button class="btn btn-sm btn-primary bt-detail p-2"><i class="bi bi-search"></i><i class="bi bi-list"></i></button>`
      listHtml += `    <button class="btn btn-sm btn-warning bt-edit p-2"><i class="bi bi-pencil"></i></button>`
      listHtml += `    <button class="btn btn-sm btn-danger bt-delete text-light p-2"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data yang sesuai kriteria pencarian tidak ditemukan.</em>';
    $('.jenis-transaksi-list').html(listHtml);
  } 
  App.showJenisTransaksi = (jenisTransaksi) => { // console.log(jenisTransaksi);
    let html = '';
    html += `<h3>${jenisTransaksi.nama}</h3>`;
    html += `<hr>`;
    html += `<table class="table">`;
    html += `<tr>`;
    html += `<td><strong>Kode</strong></td><td>${jenisTransaksi.kode}</td>`;
    html += `</tr><tr>`;
    html += `<td><strong>Keterangan</strong></td><td>${jenisTransaksi.keterangan}</td>`;
    html += `</tr><tr>`;
    html += `<td><strong>Akun Debit</strong></td><td>${jenisTransaksi.kakundebit} <div class="akun-debit-list"></div></td>`;
    html += `</tr><tr>`;
    html += `<td><strong>Akun Kredit</strong></td><td>${jenisTransaksi.kakunkredit} <div class="akun-kredit-list"></div></td>`;
    html += `</tr><tr><td colspan="2">`;
    html += `<div class="input-group mb-2">`;
    html += `<label class="input-group-text" for="inputGroupSelect01">Akun Debit</label>`;
    html += `<select class="form-select akun-debit-jenis-transaksi-list"></select>`;
    html += `<button class="btn btn-primary text-light bt-add-akun-debit-jenis-transaksi" type="button">`
    html += `<i class="bi bi-plus-lg"></i>`
    html += `</button>`;
    html += `</div>`;
    // html += `</td></tr>`;
    // html += `<tr><td colspan="2">`;
    html += `<div class="input-group">`;
    html += `<label class="input-group-text" for="inputGroupSelect01">Akun Kredit</label>`;
    html += `<select class="form-select akun-kredit-jenis-transaksi-list"></select>`;
    html += `<button class="btn btn-primary text-light bt-add-akun-kredit-jenis-transaksi" type="button">`
    html += `<i class="bi bi-plus-lg"></i>`
    html += `</button>`;
    html += `</div>`;
    html += `<span class="form-text text-muted">Akun-akun yang diberlakukan untuk jenis transaksi ini.</span>`;
    html += `</td></tr>`;
    // html += `<td>Akun Debit: <select class="list-akun-debit form-control"></select>`
    // html += `<span class="btn btn-sm p-2"><i class="bi bi-plus-lg"></i></button></td>`;
    html += `</table>`;
    $('#jenis-transaksi-detail .content').attr('data-kodejenistransaksi', jenisTransaksi.kode).html(html);
  }
  App.showAkunDebits = (akunDebits) => { // console.log(jenisTransaksi);
    let html = '';
    akunDebits.forEach(akunDebit => {
      html += `<span class="btn btn-sm btn-success text-light m-1 p-2 py-1 akun-debit">`;
      html += `${akunDebit.kode} - ${akunDebit.nama}`
      html += `<i class="bi bi-x-lg bt-remove-akun-debit ms-2" data-kodeakun="${akunDebit.kode}"></i>`
      html += `</span>`;
    });
    $('#jenis-transaksi-detail .content .akun-debit-list').html(html);
  }
  App.showAkunKredits = (akunKredits) => { // console.log(jenisTransaksi);
    let html = '';
    akunKredits.forEach(akunKredit => {
      html += `<span class="btn btn-sm btn-danger text-light m-1 p-2 py-1 akun-kredit">`;
      html += `${akunKredit.kode} - ${akunKredit.nama}`
      html += `<i class="bi bi-x-lg bt-remove-akun-kredit ms-2" data-kodeakun="${akunKredit.kode}"></i>`
      html += `</span>`;
    });
    $('#jenis-transaksi-detail .content .akun-kredit-list').html(html);
  }
  App.showAkunDebitsKategori = (akunDebits) => {
    let listHtml = '';
    akunDebits.forEach(akunDebit => {
      listHtml += `<option value="${akunDebit.kode}">${akunDebit.nama}</option>`;
    });
    $('#jenis-transaksi-detail .content .akun-debit-jenis-transaksi-list').html(listHtml);
  }
  App.showAkunKreditsKategori = (akunKredits) => {
    let listHtml = '';
    akunKredits.forEach(akunKredit => {
      listHtml += `<option value="${akunKredit.kode}">${akunKredit.nama}</option>`;
    });
    $('#jenis-transaksi-detail .content .akun-kredit-jenis-transaksi-list').html(listHtml);
  }
  new App();

  // let pagination = Pagination.instance('.jenis-transaksi-pagination').update(100, 10);
  // console.log(pagination);
});