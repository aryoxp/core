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
        let semester = $('#form-search .input-semester').val();
        let prodi = $('#input-prodi').val();
        let tahun = $('#input-tahun').val();
        let page = (!App.paginationPenawaran || 
          semester != App.paginationPenawaran.semester ||
          prodi != App.paginationPenawaran.prodi ||
          tahun != App.paginationPenawaran.tahun ||
          perpage != App.paginationPenawaran.perpage) ?
          1 : App.paginationPenawaran.page;
        let postdata = {
          semester: semester,
          prodi: prodi,
          tahun: tahun
        }; // console.log(postdata);
        this.ajax.post(`m/x/waka/akademikApi/getMatakuliahDitawarkan/${page}/${perpage}`, postdata)
        .then(results => { // console.log(results);
          let matakuliahs = results.matakuliah;
          let count = results.count;
          App.populateMatakuliahDitawarkan(matakuliahs)
          if (App.paginationPenawaran) {
            App.paginationPenawaran.page = page;
            App.paginationPenawaran.semester = semester;
            App.paginationPenawaran.prodi = prodi;
            App.paginationPenawaran.tahun = tahun;
            App.paginationPenawaran.update(count, perpage);  
          } else App.paginationPenawaran = 
            Pagination.instance('.pagination-matakuliah-ditawarkan', count, perpage).listen('#form-search').update(count, perpage);
            App.paginationPenawaran.semester = semester;
            App.paginationPenawaran.prodi = prodi;
            App.paginationPenawaran.tahun = tahun;
            App.paginationPenawaran.perpage = perpage;
            App.paginationPenawaran.page = page;
          });
          $('#form-matakuliah-tidak-ditawarkan').trigger('submit');
      });
      $('#form-search #input-prodi').on('change', () => {
        let prodi = $('#input-prodi').val();
        this.ajax.get(`m/x/waka/akademikApi/getTahunPenawaranList/${prodi}`)
          .then(tahuns => { 
            let tahun = (new Date()).getFullYear();
            if (tahuns.length && tahuns[0].tahun != tahun) tahuns = [{tahun: tahun.toString()}].concat(tahuns); 
            // console.log(tahuns);
            App.populateTahun(tahuns);
            $('#form-search').trigger('submit');
          });
      });
      $('#form-search #input-tahun').on('change', () => $('#form-search').trigger('submit'));
      $('#form-search #input-semester').on('change', () => $('#form-search').trigger('submit'));
      $('.list-matakuliah-ditawarkan').on('click', '.bt-turunkan', (e) => {
        let row = $(e.currentTarget).parents('.matakuliah-item');
        let kdmk = row.attr('data-kdmk');
        let kurikulum = row.attr('data-kurikulum');
        let prodi = $('#form-search #input-prodi').val();
        let tahun = $('#form-search #input-tahun').val();
        let semester = $('#form-search .input-semester').val();
        let postdata = {
          kdmk: kdmk,
          kurikulum: kurikulum,
          prodi: prodi,
          tahun: tahun,
          semester: semester
        }
        // console.log(postdata);
        this.ajax.post(`m/x/waka/akademikApi/turunkanPenawaranMatakuliah`, postdata).then(result => {
          // console.log(result);
          row.fadeOut('fast', () => row.remove());
          $('#form-matakuliah-tidak-ditawarkan').trigger('submit');
        });
      });
      $('#form-matakuliah-tidak-ditawarkan').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let semester = $('#form-search .input-semester').val();
        let prodi = $('#form-search #input-prodi').val();
        let tahun = $('#form-search #input-tahun').val();
        let kurikulum = $('#form-matakuliah-tidak-ditawarkan .input-kurikulum').val();
        let perpage = parseInt($('#form-matakuliah-tidak-ditawarkan .input-perpage').val());
        let page = (!App.pagination || 
          semester != App.pagination.semester ||
          prodi != App.pagination.prodi ||
          tahun != App.pagination.tahun ||
          kurikulum != App.pagination.kurikulum ||
          perpage != App.pagination.perpage) ?
          1 : App.pagination.page;
        let postdata = {
          kurikulum: kurikulum,
          semester: semester,
          prodi: prodi,
          tahun: tahun
        }; // console.log(postdata);
        this.ajax.post(`m/x/waka/akademikApi/getMatakuliahTidakDitawarkan/${page}/${perpage}`, postdata)
        .then(results => { // console.log(results);
          let matakuliahs = results.matakuliah;
          let count = results.count;
          App.populateMatakuliah(matakuliahs)
          if (App.pagination) {
            App.pagination.page = page;
            App.pagination.kurikulum = kurikulum;
            App.pagination.semester = semester;
            App.pagination.prodi = prodi;
            App.pagination.tahun = tahun;
            App.pagination.update(count, perpage);  
          } else App.pagination = 
            Pagination.instance('.pagination-matakuliah-tidak-ditawarkan', count, perpage)
              .listen('#form-matakuliah-tidak-ditawarkan')
              .update(count, perpage);
            App.pagination.kurikulum = kurikulum;
            App.pagination.semester = semester;
            App.pagination.prodi = prodi;
            App.pagination.tahun = tahun;
            App.pagination.page = page;
          });
      });
      $('#form-matakuliah-tidak-ditawarkan select[name="input-kurikulum"]').on('change', () => $('#form-matakuliah-tidak-ditawarkan').trigger('submit'));

      $('.list-matakuliah-tidak-ditawarkan').on('click', '.bt-tawarkan', (e) => {
        let row = $(e.currentTarget).parents('.matakuliah-item');
        let kdmk = row.attr('data-kdmk');
        let kurikulum = row.attr('data-kurikulum');
        let prodi = $('#form-search #input-prodi').val();
        let tahun = $('#form-search #input-tahun').val();
        let semester = $('#form-search .input-semester').val();
        let postdata = {
          kdmk: kdmk,
          kurikulum: kurikulum,
          prodi: prodi,
          tahun: tahun,
          semester: semester
        }
        // console.log(postdata);
        this.ajax.post(`m/x/waka/akademikApi/tawarkanMatakuliah`, postdata).then(result => {
          // console.log(result);
          row.fadeOut('fast', () => row.remove());
          $('#form-search').trigger('submit');
        });
      });
    }

    onLoad() {
      this.ajax.get('m/x/waka/akademikApi/getAllKurikulum').then(kurikulums => {
        let html = '';
        kurikulums.forEach(kurikulum => html += `<option value="${kurikulum.tahun}">${kurikulum.tahun}</option>`)
        $('#form-matakuliah-tidak-ditawarkan select[name="input-kurikulum"]').html(html);
        $('#form-search #input-prodi').trigger('change');
      });
    }

  }

  App.populateMatakuliahDitawarkan = (matakuliahs) => { // console.log(matakuliahs);
    let listHtml = '';
    let selected = App.selectedUsernames;
    matakuliahs.forEach(matakuliah => { 
      let checked = selected && selected.includes(matakuliah.namamk) ? 'checked' : '';
      listHtml += `<div class="matakuliah-item list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}">`
      listHtml += `  <input type="checkbox" class="cb-matakuliah ms-1" data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 matakuliah-truncate matakuliah-nowrap">`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-secondary text-light">Kurikulum ${matakuliah.kurikulum}</span>`
      listHtml += `  <span class="me-2 text-primary">${matakuliah.kdmk}</span>`
      listHtml += `  <span class="">${matakuliah.namamk}</span>`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-warning text-dark">${matakuliah.sks} SKS</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      listHtml += `    <button class="btn btn-sm btn-danger text-light bt-turunkan p-2 py-1"><i class="bi bi-arrow-down"></i> Turunkan</button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data matakuliah yang ditawarkan tidak ditemukan.</em>';
    $('.list-matakuliah-ditawarkan').html(listHtml);
  } 
  App.populateMatakuliah = (matakuliahs) => { // console.log(matakuliahs);
    let listHtml = '';
    let selected = App.selectedUsernames;
    matakuliahs.forEach(matakuliah => { 
      let checked = selected && selected.includes(matakuliah.namamk) ? 'checked' : '';
      listHtml += `<div class="matakuliah-item list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}">`
      listHtml += `  <input type="checkbox" class="cb-matakuliah ms-1" data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 matakuliah-truncate matakuliah-nowrap">`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-secondary text-light">Kurikulum ${matakuliah.kurikulum}</span>`
      listHtml += `  <span class="me-2 text-primary">${matakuliah.kdmk}</span>`
      listHtml += `  <span class="">${matakuliah.namamk}</span>`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-warning text-dark">${matakuliah.sks} SKS</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      listHtml += `    <button class="btn btn-sm btn-success text-light bt-tawarkan p-2 py-1"><i class="bi bi-arrow-up"></i> Tawarkan</button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data matakuliah yang belum ditawarkan tidak ditemukan.</em>';
    $('.list-matakuliah-tidak-ditawarkan').html(listHtml);
  } 

  App.populateTahun = (tahuns) => {
    let html = '';
    tahuns.forEach(tahun => html += `<option value="${tahun.tahun}">${tahun.tahun}</option>`)
    $('#input-tahun').html(html);
  }

  new App();

  // let pagination = Pagination.instance('.pagination-matakuliah').update(100, 10);
  // console.log(pagination);
});