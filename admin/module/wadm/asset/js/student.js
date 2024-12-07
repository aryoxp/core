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
          this.ajax.post(`m/x/wadm/studentApi/search/${page}/${perpage}`, {
            keyword: keyword
          })])
        .then(results => {
          let mahasiswas = results[0].mahasiswa;
          let count = results[0].count;
          App.populateMahasiswa(mahasiswas)
          if (App.pagination) {
            App.pagination.page = page;
            App.pagination.keyword = keyword;
            App.pagination.update(count, perpage);  
          } else App.pagination = 
            Pagination.instance('.student-pagination', count, perpage).listen('#form-search').update(count, perpage);
            App.pagination.keyword = keyword;
            App.pagination.perpage = perpage;
            App.pagination.page = page;
          });
    
      });
      $('.mahasiswa-list').on('click', '.bt-delete', (e) => { console.log(e);
        let row = $(e.currentTarget).parents('.mahasiswa-item');
        let nrm = row.attr('data-nrm');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> mahasiswa ini?<br>Proses ini TIDAK DAPAT dibatalkan.`))
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> HAPUS Mahasiswa</span>')
          .positive(e => {
            this.ajax.post('m/x/wadm/studentApi/deleteMahasiswa', {
              nrm: nrm
            }).then((response) => { // console.log(response)
              if (response) {
                (new CoreInfo("Mahasiswa telah dihapus.")).title('Information').show();
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
    }

    onLoad() {
      $('#form-search').trigger('submit');
    }

  }

  App.populateMahasiswa = (mahasiswas) => { // console.log(mahasiswas);
    let listHtml = '';
    let selected = App.selectedUsernames;
    mahasiswas.forEach(mahasiswa => { 
      let checked = selected && selected.includes(mahasiswa.namam) ? 'checked' : '';
      listHtml += `<div class="mahasiswa-item list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-nrm="${mahasiswa.nrm}" data-name="${mahasiswa.namam}">`
      listHtml += `  <input type="checkbox" class="cb-mahasiswa ms-1" data-mahasiswaname="${mahasiswa.namam}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 mahasiswa-truncate mahasiswa-nowrap">`
      listHtml += `  <span class="me-3">${mahasiswa.namam}</span>`
      listHtml += !(mahasiswa.prodi) ? `<span class="badge rounded bg-danger ms-1"><i class="bi bi-x-lg"></i> Prodi</span>` : 
        `<span class="badge bg-success ms-1">${App.prodi(mahasiswa.prodi)}</span>`;
      listHtml += !(mahasiswa.nim)   ? `<span class="badge rounded bg-danger ms-1"><i class="bi bi-x-lg"></i> NIM</span>` : 
        `<span class="badge bg-warning text-dark ms-1">NIM ${mahasiswa.nim}</span>`;
      listHtml += `  <span class="px-2 badge rounded bg-secondary text-light">NRM ${mahasiswa.nrm}</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      listHtml += `    <button class="btn btn-sm btn-primary bt-detail p-2"><i class="bi bi-list"></i><i class="bi bi-search"></i></button>`
      listHtml += `    <a href="${this.location}/editbio/${mahasiswa.nrm}" class="btn btn-sm btn-warning bt-edit p-2"><i class="bi bi-pencil"></i></a>`
      listHtml += `    <button class="btn btn-sm btn-danger bt-delete p-2 text-light"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">No users found in current search.</em>';
    $('.mahasiswa-list').html(listHtml);
  }
  App.prodi = (prodi) => {
    if (prodi == "D3") return "D3 Kebidanan";
    if (prodi == "D3F") return "D3 Farmasi";
    if (prodi == "MIK") return "D4 Manajemen Informasi Kesehatan";
    if (prodi == "FIS") return "D4 Fisioterapi";
  }

  new App();

  // let pagination = Pagination.instance('.student-pagination').update(100, 10);
  // console.log(pagination);
});