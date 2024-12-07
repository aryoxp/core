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
        let keyword = $('input[name="keyword"]').val();
        if (keyword.length < 3) {
          $('input[name="keyword"]').addClass('is-invalid');
          return;
        } else $('input[name="keyword"]').removeClass('is-invalid');
        this.ajax.post(`m/x/wadm/studentApi/search/1/20`, {
            keyword: keyword
        }).then(results => { // console.log(results);
          App.populateMahasiswa(results.mahasiswa);
        });
      });
      $('#list-mahasiswa').on('click', '.bt-pilih', (e) => {
        let nrm = $(e.currentTarget).parents('.mahasiswa-item').attr('data-nrm');
        let location = (Core.configuration.get('baseurl'));
        this.ajax.get(`m/x/wadm/studentApi/getMahasiswa/${nrm}`).then(mahasiswa => {
          // console.log(mahasiswa);
          let prodi = "-";
          if (mahasiswa.prodi == "D3") prodi = "D3 Kebidanan";
          if (mahasiswa.prodi == "D3F") prodi = "D3 Farmasi";
          if (mahasiswa.prodi == "MIK") prodi = "Manajemen Informasi Kesehatan";
          if (mahasiswa.prodi == "FIS") prodi = "Fisioterapi";
          if (!mahasiswa.prodi) {
            prodi = `<span class="text-danger me-2"><i class="bi bi-exclamation-triangle-fill"></i> `;
            prodi += `Program studi belum diset.</span>`;
            prodi += `<a class="btn btn-danger text-light btn-sm p-2 py-1 my-2" href="${location}m/x/wadm/student/editbio/${mahasiswa.nrm}">`
            prodi += `Set di sini</a>`;
          }
          let html = '';
          html += `<h1 class="fs-4 fw-lighter my-3 text-primary">${mahasiswa.namam}`;
          html += `  <span class="fs-6 d-block">${prodi}</span>`;
          html += `</h1>`;
          html += `<i class="bi bi-person-fill text-primary fs-1"></i>`;
          $('#selected-mahasiswa').html(html)
            .attr('data-nrm', mahasiswa.nrm)
            .attr('data-prodi', mahasiswa.prodi)
            .attr('data-nama', mahasiswa.namam);
        });
        App.getDaftarKRSMahasiswa(nrm);
        App.populateMatakuliah([]);
        $(".mahasiswa-item:last-child").get(0).scrollIntoView({behavior: 'smooth'});
      });
      $('#list-krs').on('click', '.bt-list-matakuliah-krs', (e) => {
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        let semester = $(e.currentTarget).parents('.krs-item').attr('data-semester');
        let semesterke = $(e.currentTarget).parents('.krs-item').attr('data-semesterke');
        let tahun = $(e.currentTarget).parents('.krs-item').attr('data-tahun');
        let prodi = $('#selected-mahasiswa').attr('data-prodi');
        $('form#cetak-krs input[name="nrm"]').val(nrm);
        $('form#cetak-krs input[name="semester"]').val(semester);
        $('form#cetak-krs input[name="semesterke"]').val(semesterke);
        $('form#cetak-krs input[name="tahun"]').val(tahun);
        let info = `Semester ${semesterke} ${App.semester(semester)} ${tahun}`;
        $('.info-selected-krs').html(info);
        let perpage = 10;
        let page = (!App.paginationPenawaran || 
          semester != App.paginationPenawaran.semester ||
          prodi != App.paginationPenawaran.prodi ||
          tahun != App.paginationPenawaran.tahun ||
          perpage != App.paginationPenawaran.perpage) ?
          1 : App.paginationPenawaran.page;
        let postdata = {
          prodi: prodi,// 'D3',
          tahun: tahun,
          nrm: nrm,
          semester: semester,
          semesterke: semesterke
        };
        // console.log(postdata);
        this.ajax.post(`m/x/waka/akademikApi/getListMatakuliahKRS`, postdata).then(matakuliahs => {
          // console.log(matakuliahs);  
          App.populateMatakuliah(matakuliahs);
        });
        this.ajax.post(`m/x/waka/akademikApi/getMatakuliahDitawarkan/${page}/${perpage}`, postdata)
        .then(results => { // console.log(results);
          let matakuliahs = results.matakuliah;
          let count = results.count;
          App.populateMatakuliahDitawarkan(matakuliahs);
          if (App.paginationPenawaran) {
            App.paginationPenawaran.page = page;
            App.paginationPenawaran.semester = semester;
            App.paginationPenawaran.prodi = prodi;
            App.paginationPenawaran.tahun = tahun;
            App.paginationPenawaran.update(count, perpage);  
          } else App.paginationPenawaran = 
            Pagination.instance('.pagination-matakuliah-ditawarkan', count, perpage).callback((page, perpage) => {
              semester = $('form#cetak-krs input[name="semester"]').val();
              semesterke = $('form#cetak-krs input[name="semesterke"]').val();
              tahun = $('form#cetak-krs input[name="tahun"]').val();
              let postdata = {
                prodi: 'D3',
                tahun: tahun,
                nrm: nrm,
                semester: semester,
                semesterke: semesterke
              };
              // console.warn(postdata);
              this.ajax.post(`m/x/waka/akademikApi/getMatakuliahDitawarkan/${page}/${perpage}`, postdata)
              .then(results => { console.log(results);
                let matakuliahs = results.matakuliah;
                App.populateMatakuliahDitawarkan(matakuliahs);
              });
            }).update(count, perpage);
            App.paginationPenawaran.semester = semester;
            App.paginationPenawaran.prodi = prodi;
            App.paginationPenawaran.tahun = tahun;
            App.paginationPenawaran.perpage = perpage;
            App.paginationPenawaran.page = page;
        });
      });
      $('#list-krs').on('click', '.bt-delete', (e) => {
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        let semester = $(e.currentTarget).parents('.krs-item').attr('data-semester');
        let semesterke = $(e.currentTarget).parents('.krs-item').attr('data-semesterke');
        let tahun = $(e.currentTarget).parents('.krs-item').attr('data-tahun');
        let postdata = {
          nrm: nrm,
          tahun: tahun,
          semester: semester,
          semesterke: semesterke
        };
        // console.log(postdata);
        (new CoreConfirm('<span class="text-danger">HAPUS</span> data KRS ini?')).title('<span class="text-danger">DELETE</span>').positive(() => {
          this.ajax.post(`m/x/waka/akademikApi/deleteKRS`, postdata).then(result => $('#riwayat-krs .bt-refresh').trigger('click'), 
          error => (new CoreError(error)).show());
        }).show();
      });
      $('#riwayat-krs').on('click', '.bt-refresh', (e) => {
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        if (!nrm) {
          (new CoreInfo('Mahasiswa belum dipilih.')).show();
          return;
        }
        App.getDaftarKRSMahasiswa(nrm);
        $(".mahasiswa-item:last-child").get(0).scrollIntoView({behavior: 'smooth'});
      });
      $('#form-krs').on('click', '.bt-buat-krs', (e) => {
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        let semesterke = $('#form-krs select[name="input-semesterke"]').val();
        let semester = $('#form-krs select[name="input-semester"]').val();
        let tahun = $('#form-krs select[name="input-tahun"]').val();
        let postvalue = {
          nrm: nrm,
          semester: semester,
          semesterke: semesterke,
          tahun: tahun
        }
        console.log(postvalue);
        if (!nrm) {
          (new CoreInfo('Mahasiswa belum dipilih.')).show();
          return;
        }
        this.ajax.post('m/x/waka/akademikApi/buatKRS', postvalue).then(result => $('#riwayat-krs .bt-refresh').trigger('click'));
        // App.getDaftarKRSMahasiswa(nrm);
        // $(".mahasiswa-item:last-child").get(0).scrollIntoView({behavior: 'smooth'});
      });
      $('#form-krs select[name="input-semesterke"]').on('change', (e) => {
        let semester = parseInt($(e.currentTarget).val()) % 2; // console.log(semester);
        if (semester == 0) semester = 2;
        $('#form-krs select[name="input-semester"]').val(semester).trigger('select');
      });
      $('#list-matakuliah-krs').on('click', '.bt-delete', (e) => {
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        let semester = $('form#cetak-krs input[name="semester"]').val();
        let semesterke = $('form#cetak-krs input[name="semesterke"]').val();
        let tahun = $('form#cetak-krs input[name="tahun"]').val();
        let kdmk = $(e.currentTarget).parents('.matakuliah-item').attr('data-kdmk');
        let kurikulum = $(e.currentTarget).parents('.matakuliah-item').attr('data-kurikulum');
        let postdata = {
          nrm: nrm,
          semester: semester,
          semesterke: semesterke,
          semesterkrs: semester,
          tahun: tahun,
          kdmk: kdmk,
          kurikulum: kurikulum
        }; // console.log(postdata);
        this.ajax.post('m/x/waka/akademikApi/dropKRS', postdata).then(result => {
          // console.log(result);
          let prodi = $('#selected-mahasiswa').attr('data-prodi');
          let postdata = {
            prodi: prodi,// 'D3',
            tahun: tahun,
            nrm: nrm,
            semester: semester,
            semesterke: semesterke
          };
          // console.log(postdata);
          this.ajax.post(`m/x/waka/akademikApi/getListMatakuliahKRS`, postdata).then(matakuliahs => {
            App.populateMatakuliah(matakuliahs);
          });
        }, error => (new CoreError(error).show()));
      });
      $('form#cetak-krs').on('click', '.bt-refresh', (e) => {
        let nrm = $('form#cetak-krs input[name="nrm"]').val();
        let semester = $('form#cetak-krs input[name="semester"]').val();
        let semesterke = $('form#cetak-krs input[name="semesterke"]').val();
        if (!nrm || !semester || !semesterke) {
          (new CoreInfo('KRS belum dipilih.')).show();
          return;
        }
        let bt = ($(`#list-krs .krs-item[data-semester="${semester}"][data-semesterke="${semesterke}"] .bt-list-matakuliah-krs`));
        bt.trigger('click');
      });
      $('form#cetak-krs').on('click', '.bt-print-krs', (e) => {
        let nrm = $('form#cetak-krs input[name="nrm"]').val();
        let semester = $('form#cetak-krs input[name="semester"]').val();
        let semesterke = $('form#cetak-krs input[name="semesterke"]').val();
        if (!nrm || !semester || !semesterke) {
          (new CoreInfo('KRS yang akan dicetak belum dipilih.')).show();
          return;
        }
        $('form#cetak-krs').trigger('submit');
      });
      $('#list-matakuliah-ditawarkan').on('click', '.bt-masukkan', (e) => {
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        let semester = $('form#cetak-krs input[name="semester"]').val();
        let semesterke = $('form#cetak-krs input[name="semesterke"]').val();
        let tahun = $('form#cetak-krs input[name="tahun"]').val();
        let kdmk = $(e.currentTarget).parents('.matakuliah-item').attr('data-kdmk');
        let kurikulum = $(e.currentTarget).parents('.matakuliah-item').attr('data-kurikulum');
        let postdata = {
          nrm: nrm,
          semester: semester,
          semesterke: semesterke,
          semesterkrs: semester,
          tahun: tahun,
          kdmk: kdmk,
          kurikulum: kurikulum
        };
        this.ajax.post('m/x/waka/akademikApi/entriKRS', postdata).then(result => {
          console.log(result);
          let prodi = $('#selected-mahasiswa').attr('data-prodi');
          let postdata = {
            prodi: prodi,// 'D3',
            tahun: tahun,
            nrm: nrm,
            semester: semester,
            semesterke: semesterke
          };
          // console.log(postdata);
          this.ajax.post(`m/x/waka/akademikApi/getListMatakuliahKRS`, postdata).then(matakuliahs => {
            App.populateMatakuliah(matakuliahs);
          });
        }, error => (new CoreError(error).show()));
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
        $('#form-krs select[name="input-tahun"]').html(html);
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
      html += `${mahasiswa.namam} `
      html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">NIM ${mahasiswa.nim}</span>`
      html += `<span class="badge rounded border-1 bg-primary text-light ms-2">${prodi}</span>`
      html += `</span>`;
      html += `<span class="btn btn-sm p-2 ms-2 btn-primary bt-pilih text-nowrap"><i class="bi bi-person"></i><i class="bi bi-check-lg me-2"></i> Pilih</span>`
      html += `</div>`;
    });
    if (mahasiswas.length == 0) html = '<div class="text-center border border-1 border-danger rounded p-2 bg-danger-subtle"><em class="text-danger">Tidak ada data. Silakan gunakan kata kunci yang lain.</em></div>';
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
        html += `<input name="nrms[]" type="checkbox" class="cb-krs form-check-input m-0 mx-2" data-nrm="${krs.nrm}" value="${krs.nrm}">`
        html += `<span class="text-primary mx-2">Semester ${krs.semesterke}</span> ` 
        html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">${krs.tahun}</span>`
        html += `<span class="badge rounded border-1 bg-secondary text-light ms-2">${App.semester(krs.semester)}</span>`
        html += `</span>`;
        html += `<span>`;
        html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-primary text-light bt-list-matakuliah-krs text-nowrap"><i class="bi bi-search me-1"></i><i class="bi bi-card-list"></i></span>`
        html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-danger text-light bt-delete text-nowrap"><i class="bi bi-x-lg"></i></span>`
        html += `</span>`;
        html += `</div>`;
        last = krs.semesterke;
      })
      $('#list-krs').html(html);
      $('#form-krs .input-semesterke').val(parseInt(last) + 1).trigger('change');
    });
  }
  App.populateMatakuliahDitawarkan = (matakuliahs) => { // console.log(matakuliahs);
    let listHtml = '';
    let selected = App.selectedUsernames;
    matakuliahs.forEach(matakuliah => { 
      let checked = selected && selected.includes(matakuliah.namamk) ? 'checked' : '';
      listHtml += `<div class="matakuliah-item list-item d-flex align-items-center px-2 py-1 border-bottom" role="button"`
      listHtml += `  data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}">`
      listHtml += `  <input type="checkbox" class="cb-matakuliah ms-1 form-check-input" data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 matakuliah-truncate matakuliah-nowrap">`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-secondary text-light">Kurikulum ${matakuliah.kurikulum}</span>`
      listHtml += `  <span class="me-2 text-primary">${matakuliah.kdmk}</span>`
      listHtml += `  <span class="">${matakuliah.namamk}</span>`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-warning text-dark">${matakuliah.sks} SKS</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      listHtml += `    <button class="btn btn-sm btn-success text-light bt-masukkan p-2 py-1"><i class="bi bi-arrow-up"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data matakuliah yang ditawarkan tidak ditemukan.</em>';
    $('#list-matakuliah-ditawarkan').html(listHtml);
  } 
  App.populateMatakuliah = (matakuliahs) => { // console.log(matakuliahs);
    let listHtml = '';
    let selected = App.selectedUsernames;
    matakuliahs.forEach(matakuliah => { 
      let checked = selected && selected.includes(matakuliah.namamk) ? 'checked' : '';
      listHtml += `<div class="matakuliah-item list-item d-flex align-items-center px-2 py-1 border-bottom" role="button"`
      listHtml += `  data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}">`
      listHtml += `  <input type="checkbox" class="cb-matakuliah ms-1 form-check-input" data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 matakuliah-truncate matakuliah-nowrap">`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-secondary text-light">Kurikulum ${matakuliah.kurikulum}</span>`
      listHtml += `  <span class="me-2 text-primary">${matakuliah.kdmk}</span>`
      listHtml += `  <span class="">${matakuliah.namamk}</span>`
      listHtml += `  <span class="px-2 me-2 badge rounded bg-warning text-dark">${matakuliah.sks} SKS</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      listHtml += `    <button class="btn btn-sm btn-danger text-light bt-delete p-2 py-1"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data matakuliah yang diprogram dalam KRS tidak ditemukan.</em>';
    $('#list-matakuliah-krs').html(listHtml);
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