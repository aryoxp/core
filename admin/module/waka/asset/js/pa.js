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
        this.ajax.post(`m/x/wadm/studentApi/searchProdiAngkatanPA/${page}/${perpage}`, {
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
      $('.mahasiswa-list').on('click', '.bt-set-nip', (e) => {
        let nrm = $(e.currentTarget).parents('.item-mahasiswa').attr('data-nrm');
        console.log(nrm);
        this.ajax.get(`m/x/waka/studentApi/getMahasiswaWithPA/${nrm}`).then(mahasiswa => {
          $('#nip-dialog select[name="input-nip"]').val(mahasiswa.nip).trigger('change');
          App.nimDialog = (new CoreWindow('#nip-dialog', {
            draggable: true,
            width: '550px'
          })).show();
          App.nimDialog.nrm = nrm;
          App.nimDialog.nrms = null;
        });
      });
      $('#mahasiswa-selection .bt-select-all').on('click', (e) => { console.log(e, $('.mahasiswa-list input[type="checkbox"]'));
        $('.mahasiswa-list input[type="checkbox"]').prop('checked', true);
      });
      $('#mahasiswa-selection .bt-unselect-all').on('click', (e) => {
        $('.mahasiswa-list input[type="checkbox"]').prop('checked', false);
      });
      $('#mahasiswa-selection .bt-multi-set-pa').on('click', (e) => {
        let nrms = [];
        $('.mahasiswa-list').find('.item-mahasiswa input[type="checkbox"]').each((i, e) => {
          if ($(e).is(':checked')) nrms.push($(e).parents('.item-mahasiswa').attr('data-nrm'));
        });
        // console.log(nrms);
        $('#nip-dialog select[name="input-nip"]').val('').trigger('change');
        App.nimDialog = (new CoreWindow('#nip-dialog', {
          draggable: true,
          width: '550px'
        })).show();
        App.nimDialog.nrm = null;
        App.nimDialog.nrms = nrms;
      });
      $('#nip-dialog').on('click', '.bt-save', (e) => {
        let nrm = App.nimDialog.nrm;
        let nrms = App.nimDialog.nrms;
        if (nrm) {
          this.ajax.post(`m/x/waka/studentApi/setPA`, {
            nrm: nrm,
            nip: $('#input-nip').val() ? $('#input-nip').val() : null
          }).then(result => {
            $('#form-search').trigger('submit');
            $('#nip-dialog').fadeOut('fast');
          });
        }
        if (nrms) {
          this.ajax.post(`m/x/waka/studentApi/setPAMulti`, {
            nrms: nrms,
            nip: $('#input-nip').val() ? $('#input-nip').val() : null
          }).then(result => { console.log(result);
            $('#form-search').trigger('submit');
            $('#nip-dialog').fadeOut('fast');
          });
        }
      });
    }

    onLoad() {
      $('#form-search #input-prodi').trigger('change');
      this.ajax.get('m/x/waka/dosenApi/getDosenList').then(dosens => App.populatePA(dosens));
    }

  }

  App.populateMahasiswa = (mahasiswas) => { // console.log(mahasiswas);
    let listHtml = '';
    let selected = App.selectedUsernames;
    mahasiswas.forEach(mahasiswa => { 
      let checked = selected && selected.includes(mahasiswa.namam) ? 'checked' : '';
      listHtml += `<div class="item-mahasiswa list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-nrm="${mahasiswa.nrm}" data-name="${mahasiswa.namam}" data-nip="${mahasiswa.nip}">`
      listHtml += `  <input type="checkbox" class="form-check-input cb-mahasiswa ms-1" data-mahasiswaname="${mahasiswa.namam}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 mahasiswa-truncate mahasiswa-nowrap">`
      listHtml += `  <span>${mahasiswa.namam}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded bg-warning text-dark">NIM ${mahasiswa.nim}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded bg-secondary text-light">NRM ${mahasiswa.nrm}</span>`
      listHtml += `  <span class="px-2 ms-2 badge rounded bg-primary text-light">PA ${mahasiswa.pa}</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      listHtml += `    <button class="btn btn-sm btn-primary bt-set-nip p-2 py-1"><i class="bi bi-people-fill"></i> <i class="bi bi-pencil"></i> Set PA</button>`
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
  App.populatePA = (pas) => {
    let html = '';
    pas.forEach(pa => html += `<option value="${pa.nip}">${pa.nama}</option>`)
    $('#input-nip').html(html);
  }

  new App();

  // let pagination = Pagination.instance('.student-pagination').update(100, 10);
  // console.log(pagination);
});