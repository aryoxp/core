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
          keyword != App.pagination.keyword ||
          perpage != App.pagination.perpage) ?
          1 : App.pagination.page;
    
        Promise.all([
          this.ajax.post(`m/x/wadm/pegawaiApi/search/${page}/${perpage}`, {
            keyword: keyword
          })])
        .then(results => {
          let pegawais = results[0].pegawai;
          let count = results[0].count;
          App.populatePegawai(pegawais)
          if (App.pagination) {
            App.pagination.page = page;
            App.pagination.keyword = keyword;
            App.pagination.update(count, perpage);  
          } else App.pagination = 
            Pagination.instance('.pegawai-pagination', count, perpage).listen('#form-search').update(count, perpage);
            App.pagination.keyword = keyword;
            App.pagination.perpage = perpage;
            App.pagination.page = page;
          });
    
      });
      $('.pegawai-list').on('click', '.bt-delete', (e) => { // console.log(e);
        let row = $(e.currentTarget).parents('.pegawai-item');
        let nip = row.attr('data-nip');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> pegawai ini?<br>Proses ini TIDAK DAPAT dibatalkan.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> HAPUS Pegawai</span>')
          .positive(e => {
            this.ajax.post('m/x/wadm/pegawaiApi/deletePegawai', {
              nip: nip
            }).then((response) => { // console.log(response)
              if (response) {
                (new CoreInfo("Pegawai telah dihapus.")).title('Information').show();
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
      $('.pegawai-list').on('click', '.bt-set-dosen', (e) => { // console.log(e);
        e.stopPropagation();
        e.preventDefault();
        let row = $(e.currentTarget).parents('.pegawai-item');
        let nip = row.attr('data-nip');
        this.ajax.post('m/x/wadm/pegawaiApi/setDosen', {
          nip: nip
        }).then((response) => { // console.log(response)
          if (response) $('#form-search').trigger('submit');
        }, (err) => (new CoreInfo(err)).show());
      });
      $('.pegawai-list').on('click', '.bt-unset-dosen', (e) => { // console.log(e);
        e.stopPropagation();
        e.preventDefault();
        let row = $(e.currentTarget).parents('.pegawai-item');
        let nip = row.attr('data-nip');
        this.ajax.post('m/x/wadm/pegawaiApi/unsetDosen', {
          nip: nip
        }).then((response) => { // console.log(response)
          if (response) $('#form-search').trigger('submit');
        }, (err) => (new CoreInfo(err)).show());
      });
      $('.bt-print').on('click', () => {
        function replace(){$(this).after($(this).text()).remove()}
        var print_window = window.open(),
        print_document = $('.app-wrapper').clone();
        print_document.find('a').each(replace);
        print_window.document.open();
        print_window.document.write('<style media="print">@page{size: auto; margin: 0mm;}body{background-color:#FFFFFF;border: solid 1px black;margin: 0px;padding:5em}</style>');
        print_window.document.write(print_document.html());
        print_window.document.close();
        print_window.print();
        print_window.close();
      });
    }

    onLoad() {
      $('#form-search').trigger('submit');
    }

  }

  App.populatePegawai = (pegawais) => { // console.log(pegawais);
    let listHtml = '';
    let selected = App.selectedUsernames;
    pegawais.forEach(pegawai => { 
      let checked = selected && selected.includes(pegawai.nama) ? 'checked' : '';
      listHtml += `<div class="pegawai-item list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-nip="${pegawai.nip}" data-name="${pegawai.nama}">`
      listHtml += `  <input type="checkbox" class="cb-pegawai ms-1" data-pegawainame="${pegawai.nama}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 pegawai-truncate pegawai-nowrap">`
      listHtml += `  <span>${pegawai.nama}</span>`
      listHtml += `  ${(!pegawai.nip ? '<i class="text-danger bi bi-exclamation-triangle ms-2"></i>' : '')} <span class="px-2 ms-2 badge rounded bg-warning text-dark">NIP ${pegawai.nip}</span>`
      listHtml += `  ${(pegawai.jabatan ? `<span class="px-2 badge rounded bg-secondary text-light">${pegawai.jabatan}</span>` : '')}`;
      listHtml += `  ${(parseInt(pegawai.isdosen) ? `<span class="px-2 badge rounded bg-success text-light">Dosen</span>` : '')}`;
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      if (!parseInt(pegawai.isdosen))
        listHtml += `    <button class="btn btn-sm btn-success text-light bt-set-dosen p-2"><i class="bi bi-person-fill"></i> Set Dosen</button>`;
      else listHtml += `    <button class="btn btn-sm btn-danger text-light bt-unset-dosen p-2"><i class="bi bi-person"></i> Unset Dosen</button>`;
      listHtml += `    <button class="btn btn-sm btn-primary bt-detail p-2"><i class="bi bi-list"></i><i class="bi bi-search"></i></button>`
      listHtml += `    <a href="${this.location}/editbio/${pegawai.nip}" class="btn btn-sm btn-warning bt-edit p-2"><i class="bi bi-pencil"></i></a>`
      listHtml += `    <button class="btn btn-sm btn-danger bt-delete p-2 text-light"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">No users found in current search.</em>';
    $('.pegawai-list').html(listHtml);
  } 

  new App();

  // let pagination = Pagination.instance('.pegawai-pagination').update(100, 10);
  // console.log(pagination);
});