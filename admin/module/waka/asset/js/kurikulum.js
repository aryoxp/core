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
        let page = (!App.pagination || 
          keyword != App.pagination.keyword ||
          perpage != App.pagination.perpage) ?
          1 : App.pagination.page;
        let postvalue = {
          keyword: keyword
        };
        this.ajax.post(`m/x/waka/kurikulumApi/search/${page}/${perpage}`, postvalue)
        .then(results => { // console.log(results);
          let kurikulums = results.kurikulum;
          let count = results.count;
          App.populateKurikulum(kurikulums)
          if (App.pagination) {
            App.pagination.keyword = keyword;
            App.pagination.page = page;
            App.pagination.update(count, perpage);  
          } else
            App.pagination = 
              Pagination.instance('.kurikulum-pagination', count, perpage).listen('#form-search').update(count, perpage);
          App.pagination.keyword = keyword;
          App.pagination.page = page;
        });
      });
      $('#kurikulum-selection').on('click', '.bt-select-all', (e) => {
        $('.kurikulum-list input.cb-kurikulum').prop('checked', true)
      })
      $('#kurikulum-selection').on('click', '.bt-unselect-all', (e) => {
        $('.kurikulum-list input.cb-kurikulum').prop('checked', false)
      })
      $('#kurikulum-selection').on('click', '.bt-delete-selected', (e) => {
        let selected = [];
        $('.kurikulum-list input.cb-kurikulum:checked').each((index, item) => {
          selected.push($(item).attr('data-tahun'))
        });
        console.log(selected);
        // TODO: confirm and delete
      })
      $('.kurikulum-list').on('click', '.bt-delete', (e) => {
        let row = $(e.currentTarget).parents('.kurikulum-item');
        let tahun = row.attr('data-tahun');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> kurikulum ini?<br>Kurikulum yang telah dihapus tidak dapat dikembalikan lagi.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> DELETE Kurikulum</span>')
          .positive(e => {
            this.ajax.post('m/x/waka/kurikulumApi/deleteKurikulum', {
              tahun: tahun
            }).then((response) => { // console.log(response);
              if (response) {
                (new CoreInfo("Kurikulum telah dihapus.")).title('Information').show();
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
        // console.log(row, $(e.currentTarget), row.attr('data-tahun'));
      });
      $('.kurikulum-list').on('click', '.bt-edit', (e) => {
        let row = $(e.currentTarget).parents('.kurikulum-item');
        let tahun = row.attr('data-tahun');
        this.ajax.get(`m/x/waka/kurikulumApi/getKurikulum/${tahun}`).then(kurikulum => { // console.warn(kurikulum);
          App.kurikulumDialog = (new CoreWindow('#kurikulum-dialog', {
            draggable: true,
            width: '450px'
          })).show();
          $('#input-tahun').val(kurikulum.tahun);
          App.kurikulumDialog.tahun = tahun;
        });
      });
      $('.kurikulum-list').on('click', '.bt-detail', (e) => {
        let row = $(e.currentTarget).parents('.kurikulum-item');
        let tahun = row.attr('data-tahun');
        this.ajax.get(`m/x/waka/kurikulumApi/getKurikulum/${tahun}`)
          .then(kurikulum => App.showKurikulum(kurikulum));
      });
      $('#bt-new-kurikulum').on('click', e => {
        $('#input-tahun').val('');
        App.kurikulumDialog = (new CoreWindow('#kurikulum-dialog', {
          draggable: true,
          width: '450px'
        })).show();
        App.kurikulumDialog.tahun = null;
      });
      $('#kurikulum-dialog .btn-save').on('click', () => {
        let id = App.kurikulumDialog.tahun;
        let tahun = $('#form-kurikulum .input-tahun').val();
        let postdata = {
          id: id,
          tahun: tahun
        }; // console.log(postdata);
        if (id != null) {
          this.ajax.post('m/x/waka/kurikulumApi/updateKurikulum', postdata).then(result => {
            (new CoreInfo('Kurikulum berhasil di-update.')).show();
            App.kurikulumDialog.hide();
            $('#form-search').trigger('submit');
          }, error => (new CoreInfo(error)).show());
        } else {
          this.ajax.post('m/x/waka/kurikulumApi/createKurikulum', postdata).then(result => {
            (new CoreInfo('Kurikulum berhasil dibuat.')).show();
            App.kurikulumDialog.hide();
            $('#form-search').trigger('submit');
          }, error => (new CoreInfo(error)).show());
        }
      });
    }

    onLoad() {
      $('#form-search').trigger('submit');
    }

  }

  App.populateKurikulum = (kurikulums) => { // console.log(kurikulums);
    let listHtml = '';
    let selected = App.selectedUsernames;
    kurikulums.forEach(kurikulum => { 
      let checked = selected && selected.includes(kurikulum.namamk) ? 'checked' : '';
      listHtml += `<div class="kurikulum-item list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-tahun="${kurikulum.tahun}">`
      listHtml += `  <input type="checkbox" class="cb-kurikulum ms-1" data-tahun="${kurikulum.tahun}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 kurikulum-truncate kurikulum-nowrap">`
      listHtml += `  <span>${kurikulum.tahun}</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3 btn-group-sm">`
      // listHtml += `    <button class="btn btn-sm btn-primary bt-detail p-2"><i class="bi bi-search"></i><i class="bi bi-list"></i></button>`
      listHtml += `    <button class="btn btn-sm btn-warning bt-edit p-2"><i class="bi bi-pencil"></i></button>`
      listHtml += `    <button class="btn btn-sm btn-danger bt-delete text-light p-2"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data yang sesuai kriteria pencarian tidak ditemukan.</em>';
    $('.kurikulum-list').html(listHtml);
  }

  new App();

  // let pagination = Pagination.instance('.kurikulum-pagination').update(100, 10);
  // console.log(pagination);
});