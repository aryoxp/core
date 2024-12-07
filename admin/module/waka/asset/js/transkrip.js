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
      $('.mahasiswa-list').on('click', '.bt-lihat', (e) => {
        let nrm = $(e.currentTarget).parents('.item-mahasiswa').attr('data-nrm');
        let postvalue = { nrm: nrm };
        $('form#print-transkrip input[name="nrm"]').val(nrm);
        this.ajax.post(`m/x/waka/studentApi/getMahasiswaWithPA/${nrm}`).then(mahasiswa => {
          $('.info-transkrip').html(`<span class="text-primary me-2">${mahasiswa.namam}</span> <span>NIM ${mahasiswa.nim}</span>`);
        });
        this.ajax.post(`m/x/waka/akademikApi/getTranskripNilai`, postvalue).then(transkrip => {
          App.listTranskrip(transkrip);
        });
      });
      $('.list-matakuliah').on('click', '.bt-hapus-nilai', (e) => {
        let nrm = $(e.currentTarget).parents('.list-item').attr('data-nrm');
        let tahun = $(e.currentTarget).parents('.list-item').attr('data-tahun');
        let semester = $(e.currentTarget).parents('.list-item').attr('data-semester');
        let kdmk = $(e.currentTarget).parents('.list-item').attr('data-kdmk');
        let kurikulum = $(e.currentTarget).parents('.list-item').attr('data-kurikulum');
        let postvalue = {
          nrm: nrm,
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          status: 0
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/setStatusMatakuliahKRS', postvalue)
          .then(result => {
            this.ajax.post(`m/x/waka/akademikApi/getTranskripNilai`, {nrm: nrm}).then(transkrip => {
              App.listTranskrip(transkrip);
            });
          })
      });
      $('.list-matakuliah').on('click', '.bt-aktif-nilai', (e) => {
        let nrm = $(e.currentTarget).parents('.list-item').attr('data-nrm');
        let tahun = $(e.currentTarget).parents('.list-item').attr('data-tahun');
        let semester = $(e.currentTarget).parents('.list-item').attr('data-semester');
        let kdmk = $(e.currentTarget).parents('.list-item').attr('data-kdmk');
        let kurikulum = $(e.currentTarget).parents('.list-item').attr('data-kurikulum');
        let postvalue = {
          nrm: nrm,
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          status: 1
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/setStatusMatakuliahKRS', postvalue)
          .then(result => {
            this.ajax.post(`m/x/waka/akademikApi/getTranskripNilai`, {nrm: nrm}).then(transkrip => {
              App.listTranskrip(transkrip);
            });
          })
      });
      $('form#print-transkrip').on('click', '.bt-print-transkrip', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let location = (Core.configuration.get('baseurl') + `m/x/waka/print/transkrip`);
        (new CoreConfirm('Cetak Transkrip Nilai?')).positive((e) => {
          $('form#print-transkrip').attr('action', location).attr('target', '_blank').trigger('submit');
        }).show();
      });
    }

    onLoad() {
      $('#form-search #input-prodi').trigger('change');
      // this.ajax.get('m/x/waka/dosenApi/getDosenList').then(dosens => App.populatePA(dosens));
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
      listHtml += `    <button class="btn btn-sm btn-primary bt-lihat p-2 py-1"><i class="bi bi-search me-2"></i> Lihat Transkrip</button>`
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
  App.listTranskrip = (transkrip) => { // console.log(mahasiswas);
    let html = '<table class="table table-sm table-hover">';
    html += `<tr><th>Semester</th><th>Kode</th><th>Kurikulum</th><th>Nama Matakuliah</th>`;
    html += `<th>SKS</th><th>Nilai</th><th>Bobot</th><th>Status</th><th></th></tr>`
    transkrip.forEach(matakuliah => { 
      html += `<tr class="list-item item-matakuliah" data-nrm="${matakuliah.nrm}" data-tahun="${matakuliah.tahun}" data-semester="${matakuliah.semester}" `
      html += `data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}">`
      html += `<td class="text-center align-middle">${matakuliah.semesterke}</td>`;
      html += `<td class="text-center align-middle">${matakuliah.kdmk}</td> `
      html += `<td class="text-center align-middle">${matakuliah.kurikulum}</td> `
      html += `<td class="text-primary align-middle">${matakuliah.namamk}</td> `
      html += `<td class="text-center align-middle">${matakuliah.sks}</td> `
      html += `<td class="text-center nilai align-middle">${matakuliah.nilai}</td>`
      html += `<td class="text-center align-middle bobotnilai" data-bobotnilai="${(matakuliah.bobotnilai ? matakuliah.bobotnilai : 0)}">${(matakuliah.bobotnilai ? matakuliah.bobotnilai : 0)}</td>`
      html += `<td class="text-center align-middle">${(matakuliah.status == "1") ? 'OK' : '-'}</td> `
      html += `<td class="align-middle">`
      if (matakuliah.status == "1")
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-danger bt-hapus-nilai text-light text-nowrap"><i class="bi bi-eraser"></i></span>`
      else html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-success bt-aktif-nilai text-light text-nowrap"><i class="bi bi-check-lg"></i></span>`
      html += `</td>`
      html += `</tr>`;
    });
    html += '</table>'
    if (transkrip.length == 0) html = '<em class="d-block m-3 user-muted">Data tidak ditemukan atau data mahasiswa belum diset informasi terkait Program Studi yang diikuti.</em>';
    $('.list-matakuliah').html(html);
  } 

  new App();

});