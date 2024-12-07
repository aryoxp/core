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
        let prodi = $('#input-prodi').val();
        let angkatan = $('#input-angkatan').val();
        let page = (!App.pagination || 
          keyword != App.pagination.keyword ||
          prodi != App.pagination.prodi ||
          angkatan != App.pagination.angkatan ||
          perpage != App.pagination.perpage) ?
          1 : App.pagination.page;
        this.ajax.post(`m/x/wadm/studentApi/searchProdiAngkatan/${page}/${perpage}`, {
          keyword: keyword,
          prodi: prodi,
          angkatan: angkatan
        })
        .then(results => {
          let mahasiswas = results.mahasiswa;
          let count = results.count;
          App.populateMahasiswa(mahasiswas)
          if (App.pagination) {
            App.pagination.page = page;
            App.pagination.keyword = keyword;
            App.pagination.prodi = prodi;
            App.pagination.angkatan = angkatan;
            App.pagination.keyword = keyword;
            App.pagination.update(count, perpage);  
          } else App.pagination = 
            Pagination.instance('.student-pagination', count, perpage).listen('#form-search').update(count, perpage);
            App.pagination.keyword = keyword;
            App.pagination.prodi = prodi;
            App.pagination.angkatan = angkatan;
            App.pagination.perpage = perpage;
            App.pagination.page = page;
          });
    
      });
      $('#form-search #input-prodi').on('change', () => {
        let prodi = $('#input-prodi').val();
        this.ajax.get(`m/x/waka/akademikApi/getTahunAngkatanList/${prodi}`)
          .then(angkatans => {
            App.populateAngkatan(angkatans.reverse())
            $('#form-search').trigger('submit');
          });
      });
      $('.mahasiswa-list').on('click', '.bt-set-nim', (e) => {
        let nrm = $(e.currentTarget).parents('.mahasiswa-item').attr('data-nrm');
        console.log(nrm);
        this.ajax.get(`m/x/wadm/studentApi/getMahasiswa/${nrm}`).then(mahasiswa => {
          $('#nim-dialog #input-nim').val(mahasiswa.nim);
          App.nimDialog = (new CoreWindow('#nim-dialog', {
            draggable: true,
            width: '450px'
          })).show();
          App.nimDialog.nrm = nrm;
        });
      });
      $('#nim-dialog').on('click', '.bt-save', (e) => {
        let nrm = App.nimDialog.nrm;
        this.ajax.post(`m/x/waka/studentApi/setNim`, {
          nrm: nrm,
          nim: $('#input-nim').val() ? $('#input-nim').val() : null
        }).then(result => {
          $('#form-search').trigger('submit');
          $('#nim-dialog').fadeOut('fast');
        });
      });
      // $('.mahasiswa-list').on('click', '.bt-delete', (e) => { console.log(e);
      // });
    }

    onLoad() {
      $('#form-search #input-prodi').trigger('change');
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
      listHtml += `  <span>${mahasiswa.namam}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded bg-warning text-dark">NIM ${mahasiswa.nim}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded bg-secondary text-light">NRM ${mahasiswa.nrm}</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      listHtml += `    <button class="btn btn-sm btn-primary bt-set-nim p-2 py-1"><i class="bi bi-list"></i><i class="bi bi-pencil"></i> NIM</button>`
      // listHtml += `    <a href="${this.location}/editbio/${mahasiswa.nrm}" class="btn btn-sm btn-warning bt-edit p-2"><i class="bi bi-pencil"></i></a>`
      // listHtml += `    <button class="btn btn-sm btn-danger bt-delete p-2 text-light"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data tidak ditemukan atau data mahasiswa belum diset informasi terkait Program Studi yang diikuti.</em>';
    $('.mahasiswa-list').html(listHtml);
  } 

  App.populateAngkatan = (angkatans) => {
    let html = '';
    angkatans.forEach(angkatan => html += `<option value="${angkatan.angkatan}">${angkatan.angkatan}</option>`)
    $('#input-angkatan').html(html);
  }

  new App();

  // let pagination = Pagination.instance('.student-pagination').update(100, 10);
  // console.log(pagination);
});