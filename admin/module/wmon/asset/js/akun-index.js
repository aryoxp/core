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
          this.ajax.post(`m/x/wmon/akunApi/search/${page}/${perpage}`, {
            keyword: keyword
          })])
        .then(results => { // console.log(results);
          let akuns = results[0].akun;
          let count = results[0].count;
          App.populateAkun(akuns)
          if (App.pagination) {
            App.pagination.keyword = keyword;
            App.pagination.update(count, perpage);  
          } else
            App.pagination = 
              Pagination.instance('.akun-pagination', count, perpage).listen('#form-search').update(count, perpage);
          App.pagination.keyword = keyword;
        });
      });
      $('#akun-selection').on('click', '.bt-select-all', (e) => {
        $('.akun-list input.cb-akun').prop('checked', true)
      })
      $('#akun-selection').on('click', '.bt-unselect-all', (e) => {
        $('.akun-list input.cb-akun').prop('checked', false)
      })
      $('#akun-selection').on('click', '.bt-delete-selected', (e) => {
        let selected = [];
        $('.akun-list input.cb-akun:checked').each((index, item) => {
          selected.push($(item).attr('data-kode'))
        });
        console.log(selected);
        // TODO: confirm and delete
      })
      $('.akun-list').on('click', '.bt-delete', (e) => {
        let row = $(e.currentTarget).parents('.akun-item');
        let kode = row.attr('data-kode');
        (new CoreConfirm(`Are you sure you want to <span class="text-danger">DELETE</span> this akun?<br>This action is CANNOT be undone.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> DELETE Line</span>')
          .positive(e => {
            this.ajax.post('m/x/wmon/akunApi/deleteAkun', {
              kode: kode
            }).then((response) => {
              if (response) {
                (new CoreInfo("Akun telah dihapus.")).title('Information').show();
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
        // console.log(row, $(e.currentTarget), row.attr('data-kode'));
      });
      $('.akun-list').on('click', '.bt-edit', (e) => {
        let row = $(e.currentTarget).parents('.akun-item');
        let kode = row.attr('data-kode');
        this.ajax.get(`m/x/wmon/akunApi/getAkun/${kode}`).then(akun => {
          console.warn(akun);
          App.akunDialog = (new CoreWindow('#akun-dialog', {
            draggable: true,
            width: '450px'
          })).show();
          $('#input-kode').val(akun.kode);
          $('#input-nama').val(akun.nama);
          $('#input-kategori').val(akun.kategori);
          $('#input-keterangan').val(akun.keterangan);
          App.akunDialog.kode = kode;
        });
      });
      $('.akun-list').on('click', '.bt-detail', (e) => {
        let row = $(e.currentTarget).parents('.akun-item');
        let kode = row.attr('data-kode');
        this.ajax.get(`m/x/wmon/akunApi/getAkun/${kode}`)
          .then(akun => App.showAkun(akun));
      });
      $('#bt-new-akun').on('click', e => {
        $('#input-kode').val('');
        $('#input-nama').val('');
        $('#input-kategori').val('');
        $('#input-keterangan').val('');
        App.akunDialog = (new CoreWindow('#akun-dialog', {
          draggable: true,
          width: '450px'
        })).show();
        App.akunDialog.kode = null;
      });
      $('#akun-dialog .btn-save').on('click', () => {
        let id = App.akunDialog.kode;
        let kode = $('#input-kode').val();
        let nama = $('#input-nama').val();
        let keterangan = $('#input-keterangan').val();
        let kategori = $('#input-kategori').val();
        // console.log(kode, nama, keterangan, kategori);
        if (id != null) {
          this.ajax.post('m/x/wmon/akunApi/updateAkun', {
            id: id,
            kode: kode,
            nama: nama,
            keterangan: keterangan,
            kategori: kategori
          }).then(result => {
            (new CoreInfo('Akun berhasil di-update.')).show();
            App.akunDialog.hide();
            $('#form-search').trigger('submit');
          }, error => (new CoreInfo(error)).show());
        } else {
          this.ajax.post('m/x/wmon/akunApi/createAkun', {
            kode: kode,
            nama: nama,
            keterangan: keterangan,
            kategori: kategori
          }).then(result => {
            (new CoreInfo('Akun berhasil dibuat.')).show();
            App.akunDialog.hide();
            $('#form-search').trigger('submit');
          }, error => (new CoreInfo(error)).show());
        }
      });
    }

    onLoad() {
      $('#form-search').trigger('submit');
    }

  }

  App.populateAkun = (akuns) => { // console.log(akuns);
    let listHtml = '';
    let selected = App.selectedUsernames;
    akuns.forEach(akun => { 
      let checked = selected && selected.includes(akun.nama) ? 'checked' : '';
      listHtml += `<div class="akun-item list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-akunname="${akun.nama}" data-name="${akun.nama}" data-kode="${akun.kode}">`
      listHtml += `  <input type="checkbox" class="cb-akun ms-1" data-kode="${akun.kode}" data-nama="${akun.nama}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 akun-truncate akun-nowrap">`
      listHtml += `  <span>${akun.nama}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-warning text-dark">${akun.kode}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-success text-light">${akun.kategori}</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3 btn-group-sm">`
      listHtml += `    <button class="btn btn-sm btn-primary bt-detail p-2"><i class="bi bi-search"></i><i class="bi bi-list"></i></button>`
      listHtml += `    <button class="btn btn-sm btn-warning bt-edit p-2"><i class="bi bi-pencil"></i></button>`
      listHtml += `    <button class="btn btn-sm btn-danger bt-delete text-light p-2"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data yang sesuai kriteria pencarian tidak ditemukan.</em>';
    $('.akun-list').html(listHtml);
  } 
  App.showAkun = (akun) => { // console.log(akuns);
    let html = '';
    html += `<h3>${akun.nama}</h3>`;
    html += `<hr>`;
    html += `<table class="table">`;
    html += `<tr>`;
    html += `<td><strong>Kode</strong></td><td>${akun.kode}</td>`;
    html += `</tr><tr>`;
    html += `<td><strong>Kategori</strong></td><td>${akun.kategori}</td>`;
    html += `</tr><tr>`;
    html += `<td><strong>Keterangan</strong></td><td>${akun.keterangan}</td>`;
    html += `</tr>`;
    html += `</table>`;
    $('#akun-detail .content').html(html);
  }

  new App();

  // let pagination = Pagination.instance('.akun-pagination').update(100, 10);
  // console.log(pagination);
});