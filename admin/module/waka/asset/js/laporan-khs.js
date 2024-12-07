$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      App.ajax = this.ajax;
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
        }; console.log(postdata);
        this.ajax.post(`m/x/waka/akademikApi/getListMahasiswaMemprogram/${page}/${perpage}`, postdata)
        .then(mahasiswas => { console.log(mahasiswas);
          App.populateMahasiswa(mahasiswas);
          $('form#cetak-khs-selected input[name="semester"]').val(semester);
          $('form#cetak-khs-selected input[name="prodi"]').val(prodi);
          $('form#cetak-khs-selected input[name="tahun"]').val(tahun);
          });
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
      $('#list-mahasiswa').on('click', '.bt-pilih', (e) => {
        let nrm = $(e.currentTarget).parents('.mahasiswa-item').attr('data-nrm');
        let prodi = $('#input-prodi').val();
        let tahun = $('#input-tahun').val();
        let semester = $('#form-search .input-semester').val();
        let postvalue = {
          nrm: nrm,
          prodi: prodi,
          tahun: tahun,
          semester: semester
        }
        let location = (Core.configuration.get('baseurl'));
        Promise.all([
          this.ajax.get(`m/x/wadm/studentApi/getMahasiswa/${nrm}`),
          this.ajax.post(`m/x/waka/akademikApi/getListMatakuliahKHSTahunAkademik`, postvalue)
        ]).then(result => {
          console.log(result);
          let mahasiswa = result[0];
          let matakuliahs = result[1];
          App.populateMatakuliah(matakuliahs);
          $('form#cetak-khs input[name="nrm"]').val(nrm);
          $('form#cetak-khs input[name="semester"]').val(semester);
          $('form#cetak-khs input[name="prodi"]').val(prodi);
          $('form#cetak-khs input[name="tahun"]').val(tahun);
          
          let html = `<span class="fw-bold">Semester ` + App.semester(semester) + " " + tahun + "/" + (parseInt(tahun)+1) + '</span>';
          html += '<br><span class="text-primary me-2">' + mahasiswa.namam + "</span> <span>NIM " + mahasiswa.nim + "</span>";
          html += `<span class="badge bg-warning text-dark ms-2">NRM ${mahasiswa.nrm}</span>`;
          $('.info-khs-mahasiswa').html(html);
        });
      });
      $('#mahasiswa-selection').on('click', '.bt-select-all', (e) => {
        $('#list-mahasiswa').find('input[type="checkbox"]').prop('checked', true);
      });
      $('#mahasiswa-selection').on('click', '.bt-unselect-all', (e) => {
        $('#list-mahasiswa').find('input[type="checkbox"]').prop('checked', false);
      });
      $('#mahasiswa-selection').on('click', '.bt-print-selected', (e) => {
        let prodi = $('form#cetak-khs-selected input[name="prodi"]').val();
        let tahun = $('form#cetak-khs-selected input[name="tahun"]').val();
        let semester = $('form#cetak-khs-selected input[name="semester"]').val();
        if (!semester || !tahun) {
          (new CoreInfo('KHS mahasiswa yang akan dicetak belum dipilih.')).show();
          return;
        }
        let nrms = [];
        $('#list-mahasiswa').find('input[type="checkbox"]:checked').each((i, e) => {
          nrms.push($(e).attr('data-nrm'));
        });
        // console.log(nrms);
        if(nrms.length == 0) {
          (new CoreError('Tidak ada mahasiswa yang dipilih KHS-nya untuk dicetak.')).show();
          return;
        }
        $('form#cetak-khs-selected .selected').html('');
        nrms.forEach(nrm => {
          $('form#cetak-khs-selected .selected').append(`<input type="hidden" name="nrms[]" value="${nrm}" />`);
        });
        $('form#cetak-khs-selected').trigger('submit');
      });
      $('form#cetak-khs').on('click', '.bt-print-khs', (e) => {
        let nrm = $('form#cetak-khs input[name="nrm"]').val();
        let tahun = $('form#cetak-khs input[name="tahun"]').val();
        let semester = $('form#cetak-khs input[name="semester"]').val();
        if (!nrm || !semester || !tahun) {
          (new CoreInfo('KHS mahasiswa yang akan dicetak belum dipilih.')).show();
          return;
        }
        $('form#cetak-khs').trigger('submit');
      });
      $('form#cetak-khs').on('click', '.bt-refresh', (e) => {
        let nrm = $('form#cetak-khs input[name="nrm"]').val();
        let prodi = $('form#cetak-khs input[name="prodi"]').val();
        let tahun = $('form#cetak-khs input[name="tahun"]').val();
        let semester = $('form#cetak-khs input[name="semester"]').val();
        let postvalue = {
          nrm: nrm,
          prodi: prodi,
          tahun: tahun,
          semester: semester
        }
        Promise.all([
          this.ajax.get(`m/x/wadm/studentApi/getMahasiswa/${nrm}`),
          this.ajax.post(`m/x/waka/akademikApi/getListMatakuliahKHSTahunAkademik`, postvalue)
        ]).then(result => { // console.log(result);
          let mahasiswa = result[0];
          let matakuliahs = result[1];
          App.populateMatakuliah(matakuliahs);
          let html = `<span class="fw-bold">Semester ` + App.semester(semester) + " " + tahun + "/" + (parseInt(tahun)+1) + '</span>';
          html += '<br><span class="text-primary me-2">' + mahasiswa.namam + "</span> <span>NIM " + mahasiswa.nim + "</span>";
          html += `<span class="badge bg-warning text-dark ms-2">NRM ${mahasiswa.nrm}</span>`;
          $('.info-khs-mahasiswa').html(html);
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
      this.ajax.get('m/x/waka/akademikApi/getTahunPenawaranList').then(tahuns => {
        let html = '';
        tahuns.forEach(tahun => html += `<option value="${tahun.tahun}">${tahun.tahun}</option>`)
        $('#form-search select[name="input-tahun"]').html(html);
      });
    }

  }

  App.populateMahasiswa = (mahasiswas) => {
    let html = '';
    mahasiswas.forEach(mahasiswa => {
      let prodi = "-";
      if (mahasiswa.prodi == "D3") prodi = "D3 Kebidanan";
      if (mahasiswa.prodi == "D3F") prodi = "D3 Farmasi";
      if (mahasiswa.prodi == "MIK") prodi = "Manajemen Informasi Kesehatan";
      if (mahasiswa.prodi == "FIS") prodi = "Fisioterapi";
      
      html += `<div class="mahasiswa-item list-item d-flex justify-content-between py-1 px-2 border-bottom" data-nrm="${mahasiswa.nrm}">`
      html += `<span class="d-flex align-items-center text-nowrap text-truncate">`
      html += `<input type="checkbox" class="form-check-input me-2" data-nrm="${mahasiswa.nrm}" />`
      html += `${mahasiswa.namam} `
      html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">NIM ${mahasiswa.nim}</span>`
      html += `</span>`;
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-primary bt-pilih text-nowrap"><i class="bi bi-search"></i></span>`
      html += `</div>`;
    });
    if (mahasiswas.length == 0) {
      html = '<div class="text-center border rounded p-2 bg-secondary-subtle"><em class="text-secondary">'
      html += 'Tidak ada data. Silakan gunakan kriteria pencarian lainnya.</em></div>';
    }
    $('#list-mahasiswa').html(html);
  }
  App.getDaftarKRSMahasiswa = (nrm) => {
    App.ajax.post('m/x/waka/akademikApi/getDaftarKRSMahasiswa', {
      nrm: nrm
    }).then(krses => { // console.log(krses);
      let html = '';
      let last = 0;
      krses.forEach(krs => { // console.log(krs);
        html += `<div class="krs-item list-item d-flex justify-content-between py-1 px-2 border-bottom align-items-center"`
        html += `  data-nrm="${krs.nrm}" data-semester="${krs.semester}" data-semesterke="${krs.semesterke}" data-tahun="${krs.tahun}">`
        html += `<span class="d-flex align-items-center text-nowrap text-truncate" title="${krs.keterangan}">`
        // html += `<input name="nrms[]" type="checkbox" class="cb-krs form-check-input m-0 mx-2" data-nrm="${krs.nrm}" value="${krs.nrm}">`
        html += `<span class="text-primary mx-2">Semester ${krs.semesterke}</span> ` 
        html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">${krs.tahun}</span>`
        html += `<span class="badge rounded border-1 bg-secondary text-light ms-2">${App.semester(krs.semester)}</span>`
        html += `</span>`;
        html += `<span>`;
        html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-primary text-light bt-list-matakuliah-krs text-nowrap"><i class="bi bi-search me-1"></i><i class="bi bi-card-list"></i></span>`
        // html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-danger text-light bt-delete text-nowrap"><i class="bi bi-x-lg"></i></span>`
        html += `</span>`;
        html += `</div>`;
        last = krs.semesterke;
      })
      $('#list-krs').html(html);
      $('#form-krs .input-semesterke').val(parseInt(last) + 1).trigger('change');
    });
  }
  App.populateMatakuliah = (matakuliahs) => { // console.log(matakuliahs);
    let listHtml = '';
    let selected = App.selectedUsernames;
    matakuliahs.forEach(matakuliah => { 
      let checked = selected && selected.includes(matakuliah.namamk) ? 'checked' : '';
      listHtml += `<div class="matakuliah-item list-item d-flex align-items-center px-2 py-1 border-bottom" role="button"`
      listHtml += `  data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}">`
      // listHtml += `  <input type="checkbox" class="cb-matakuliah ms-1 form-check-input" data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 matakuliah-truncate matakuliah-nowrap">`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-secondary text-light">Kurikulum ${matakuliah.kurikulum}</span>`
      listHtml += `  <span class="me-2 text-primary">${matakuliah.kdmk}</span>`
      listHtml += `  <span class="">${matakuliah.namamk}</span>`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-warning text-dark">${matakuliah.sks} SKS</span>`
      listHtml += `  <span class="">Nilai: ${matakuliah.nilai}</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      // listHtml += `    <button class="btn btn-sm btn-danger text-light bt-delete p-2 py-1"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data matakuliah yang diprogram dalam KRS tidak ditemukan.</em>';
    $('#list-matakuliah-khs').html(listHtml);
  }
  App.populateTahun = (tahuns) => {
    let html = '';
    tahuns.forEach(tahun => html += `<option value="${tahun.tahun}">${tahun.tahun}</option>`)
    $('#input-tahun').html(html);
  }
  App.semester = (sem) => {
    if (sem == 1) return "Ganjil";
    if (sem == 2) return "Genap";
    if (sem == 3) return "Ganjil Pendek";
    if (sem == 4) return "Genap Pendek";
  }

  new App();

  // let pagination = Pagination.instance('.pagination-matakuliah').update(100, 10);
  // console.log(pagination);
});