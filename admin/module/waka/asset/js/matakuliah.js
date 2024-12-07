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
        let perpage = parseInt($('#form-search .input-perpage').val());
        let keyword = $('#form-search .input-keyword').val();
        let prodi = $('#form-search .input-prodi').val();
        let kurikulum = $('#form-search .input-kurikulum').val();
        let page = (!App.pagination || 
          keyword != App.pagination.keyword ||
          prodi != App.pagination.prodi ||
          kurikulum != App.pagination.kurikulum ||
          perpage != App.pagination.perpage) ?
          1 : App.pagination.page;
        let postvalue = {
          keyword: keyword,
          prodi: prodi,
          kurikulum: kurikulum
        };
        this.ajax.post(`m/x/waka/matakuliahApi/search/${page}/${perpage}`, postvalue)
        .then(results => { // console.log(results);
          let matakuliahs = results.matakuliah;
          let count = results.count;
          App.populateMatakuliah(matakuliahs)
          if (App.pagination) {
            App.pagination.keyword = keyword;
            App.pagination.prodi = prodi;
            App.pagination.kurikulum = kurikulum;
            App.pagination.page = page;
            App.pagination.update(count, perpage);  
          } else
            App.pagination = 
              Pagination.instance('.matakuliah-pagination', count, perpage).listen('#form-search').update(count, perpage);
          App.pagination.keyword = keyword;
          App.pagination.prodi = prodi;
          App.pagination.kurikulum = kurikulum;
          App.pagination.page = page;
        });
      });
      $('#matakuliah-selection').on('click', '.bt-select-all', (e) => {
        $('.matakuliah-list input.cb-matakuliah').prop('checked', true)
      })
      $('#matakuliah-selection').on('click', '.bt-unselect-all', (e) => {
        $('.matakuliah-list input.cb-matakuliah').prop('checked', false)
      })
      $('#matakuliah-selection').on('click', '.bt-delete-selected', (e) => {
        let selected = [];
        $('.matakuliah-list input.cb-matakuliah:checked').each((index, item) => {
          selected.push($(item).attr('data-kdmk'))
        });
        console.log(selected);
        // TODO: confirm and delete
      })
      $('.matakuliah-list').on('click', '.bt-delete', (e) => {
        let row = $(e.currentTarget).parents('.matakuliah-item');
        let kdmk = row.attr('data-kdmk');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> matakuliah ini?<br>Matakuliah yang telah dihapus tidak dapat dikembalikan lagi.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> DELETE Matakuliah</span>')
          .positive(e => {
            this.ajax.post('m/x/waka/matakuliahApi/deleteMatakuliah', {
              kdmk: kdmk
            }).then((response) => { // console.log(response);
              if (response) {
                (new CoreInfo("Matakuliah telah dihapus.")).title('Information').show();
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
        // console.log(row, $(e.currentTarget), row.attr('data-kdmk'));
      });
      $('.matakuliah-list').on('click', '.bt-edit', (e) => {
        let row = $(e.currentTarget).parents('.matakuliah-item');
        let kdmk = row.attr('data-kdmk');
        this.ajax.get(`m/x/waka/matakuliahApi/getMatakuliah/${kdmk}`).then(matakuliah => { // console.warn(matakuliah);
          App.matakuliahDialog = (new CoreWindow('#matakuliah-dialog', {
            draggable: true,
            width: '450px'
          })).show();
          $('#input-kdmk').val(matakuliah.kdmk);
          $('#input-namamk').val(matakuliah.namamk);
          $('#input-mkname').val(matakuliah.mkname);
          $('#form-matakuliah select[name="input-kurikulum"]').val(matakuliah.kurikulum).trigger('change');
          $('#form-matakuliah select[name="input-prodi"]').val(matakuliah.prodi).trigger('change');
          $('#form-matakuliah select[name="input-sks"]').val(matakuliah.sks).trigger('change');
          App.matakuliahDialog.kdmk = kdmk;
        });
      });
      $('.matakuliah-list').on('click', '.bt-detail', (e) => {
        let row = $(e.currentTarget).parents('.matakuliah-item');
        let kdmk = row.attr('data-kdmk');
        this.ajax.get(`m/x/waka/matakuliahApi/getMatakuliah/${kdmk}`)
          .then(matakuliah => App.showMatakuliah(matakuliah));
      });
      $('#bt-new-matakuliah').on('click', e => {
        $('#input-kdmk').val('');
        $('#input-namamk').val('');
        $('#input-mkname').val('');
        $('#input-keterangan').val('');
        App.matakuliahDialog = (new CoreWindow('#matakuliah-dialog', {
          draggable: true,
          width: '550px'
        })).show();
        App.matakuliahDialog.kdmk = null;
      });
      $('#matakuliah-dialog .btn-save').on('click', () => {
        let id = App.matakuliahDialog.kdmk;
        let kdmk = $('#form-matakuliah .input-kdmk').val();
        let kurikulum = $('#form-matakuliah select[name="input-kurikulum"]').val();
        let prodi = $('#form-matakuliah select[name="input-prodi"]').val();
        let namamk = $('#form-matakuliah .input-namamk').val();
        let sks = $('#form-matakuliah select[name="input-sks"]').val();
        let mkname = $('#input-mkname').val();
        let postdata = {
          id: id,
          kdmk: kdmk,
          kurikulum: kurikulum,
          prodi: prodi,
          namamk: namamk,
          sks: sks,
          mkname: mkname
        }; // console.log(postdata);
        if (id != null) {
          this.ajax.post('m/x/waka/matakuliahApi/updateMatakuliah', postdata).then(result => {
            (new CoreInfo('Matakuliah berhasil di-update.')).show();
            App.matakuliahDialog.hide();
            $('#form-search').trigger('submit');
          }, error => (new CoreInfo(error)).show());
        } else {
          this.ajax.post('m/x/waka/matakuliahApi/createMatakuliah', postdata).then(result => {
            (new CoreInfo('Matakuliah berhasil dibuat.')).show();
            App.matakuliahDialog.hide();
            $('#form-search select[name="input-prodi"]').val(prodi).trigger('change');
            $('#form-search select[name="input-kurikulum"]').val(kurikulum).trigger('change');
            $('#form-search').trigger('submit');
          }, error => (new CoreInfo(error)).show());
        }
      });
    }

    onLoad() {
      this.ajax.get('m/x/waka/akademikApi/getAllKurikulum').then(results => { // console.log(results);
        let html = '';
        results.forEach(kurikulum => html += `<option value="${kurikulum.tahun}">${kurikulum.tahun}</option>`);
        $('#form-search .input-kurikulum').html(html);
        $('#matakuliah-dialog select[name="input-kurikulum"]').html(html);
        $('#form-search').trigger('submit');
      });
    }

  }

  App.populateMatakuliah = (matakuliahs) => { // console.log(matakuliahs);
    let listHtml = '';
    let selected = App.selectedUsernames;
    matakuliahs.forEach(matakuliah => { 
      let checked = selected && selected.includes(matakuliah.namamk) ? 'checked' : '';
      listHtml += `<div class="matakuliah-item list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-namamk="${matakuliah.namamk}" data-kdmk="${matakuliah.kdmk}">`
      listHtml += `  <input type="checkbox" class="cb-matakuliah ms-1" data-kdmk="${matakuliah.kdmk}" data-namamk="${matakuliah.namamk}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 matakuliah-truncate matakuliah-nowrap">`
      listHtml += `  <span>${matakuliah.namamk}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-warning text-dark">${matakuliah.kdmk}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-success text-light">${matakuliah.prodi}</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3 btn-group-sm">`
      // listHtml += `    <button class="btn btn-sm btn-primary bt-detail p-2"><i class="bi bi-search"></i><i class="bi bi-list"></i></button>`
      listHtml += `    <button class="btn btn-sm btn-warning bt-edit p-2"><i class="bi bi-pencil"></i></button>`
      listHtml += `    <button class="btn btn-sm btn-danger bt-delete text-light p-2"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data yang sesuai kriteria pencarian tidak ditemukan.</em>';
    $('.matakuliah-list').html(listHtml);
  }

  new App();

  // let pagination = Pagination.instance('.matakuliah-pagination').update(100, 10);
  // console.log(pagination);
});