$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      App.ajax = this.ajax;
      this.handleEvent();
      this.onLoad();
    }

    handleEvent() {
      $('#form-penawaran').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let prodi = $('#form-penawaran .input-prodi').val();
        let tahun = $('#form-penawaran .input-tahun').val();
        let semester = $('#form-penawaran .input-semester').val();
        let perpage = parseInt($('#form-penawaran .input-perpage').val());
        let page = (!App.pagination || 
          prodi != App.pagination.prodi ||
          tahun != App.pagination.tahun ||
          semester != App.pagination.semester ||
          perpage != App.pagination.perpage) ?
          1 : App.pagination.page;
        let postvalue = {
          tahun: tahun,
          prodi: prodi,
          semester: semester
        };
        this.ajax.post(`m/x/waka/akademikApi/getMatakuliahDitawarkan/${page}/${perpage}`, postvalue).then(results => { console.log(results);
          let matakuliahs = results.matakuliah;
          let count = results.count;
          App.populateMatakuliah(matakuliahs);
          if (App.pagination) {
            App.pagination.semester = semester;
            App.pagination.prodi = prodi;
            App.pagination.tahun = tahun;
            App.pagination.page = page;
            App.pagination.update(count, perpage);  
          } else
            App.pagination = 
              Pagination.instance('.pagination-matakuliah', count, perpage).listen('#form-penawaran').update(count, perpage);
          App.pagination.semester = semester;
          App.pagination.prodi = prodi;
          App.pagination.tahun = tahun;
          App.pagination.page = page;
        });
      });
      $('#list-matakuliah').on('click', '.bt-pilih', (e) => {
       
        let tahun = $('#form-penawaran .input-tahun').val();
        let semester = $('#form-penawaran .input-semester').val();
        let kdmk = $(e.currentTarget).parents('.item-matakuliah').attr('data-kdmk');
        let kurikulum = $(e.currentTarget).parents('.item-matakuliah').attr('data-kurikulum');

        $('#form-kelas input[name="tahun"]').val(tahun);
        $('#form-kelas input[name="semester"]').val(semester);
        $('#form-kelas input[name="kdmk"]').val(kdmk);
        $('#form-kelas input[name="kurikulum"]').val(kurikulum);
        $('#form-kelas').trigger('submit');

      });
      $('#form-kelas').on('submit', e => { //console.log(e);
        e.preventDefault();
        e.stopPropagation();
        let tahun = $('#form-kelas input[name="tahun"]').val();
        let semester = $('#form-kelas input[name="semester"]').val();
        let kdmk = $('#form-kelas input[name="kdmk"]').val();
        let kurikulum = $('#form-kelas input[name="kurikulum"]').val();
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum
        }; // console.log(postvalue);
        Promise.all([
          this.ajax.post(`m/x/waka/akademikApi/getKelas`, postvalue),
          this.ajax.post(`m/x/waka/matakuliahApi/getMatakuliah`, postvalue)
        ]).then(results => { console.log(results);
          let kelases = results[0];
          let matakuliah = results[1]; 
          let info = `<div><span>${App.semester(semester)}</span> <span class="me-2">${tahun}</span>`;
          info += `<span class="px-2 me-2 badge rounded bg-warning text-dark">${kdmk}</span>`;
          info += `<span class="px-2 me-2 badge rounded bg-secondary">Kurikulum ${kurikulum}</span></div>`;
          info += `<div class="mt-2"><span class="text-primary me-2">${matakuliah.namamk}</span>`;
          info += `<span class="px-2 me-2 badge rounded bg-warning text-dark">${matakuliah.sks} SKS</span></div>`;
          $('#form-kelas .info-kelas').html(info);
          App.populateKelas(kelases);
        });
      });
      $('#form-kelas').on('click', '.bt-buat-kelas', (e) => {
        let tahun = $('#form-kelas input[name="tahun"]').val();
        let semester = $('#form-kelas input[name="semester"]').val();
        let kdmk = $('#form-kelas input[name="kdmk"]').val();
        let kurikulum = $('#form-kelas input[name="kurikulum"]').val();
        let nama = $('#form-kelas select[name="input-kelas"]').val();
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          nama: nama
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/buatKelas', postvalue)
          .then(result => {
            $('#form-kelas').trigger('submit');
          }, error => (new CoreError(error)).show());
      });
      $('#list-kelas').on('click', '.bt-show', (e) => {
        let tahun = $('#form-kelas input[name="tahun"]').val();
        let semester = $('#form-kelas input[name="semester"]').val();
        let kdmk = $('#form-kelas input[name="kdmk"]').val();
        let kurikulum = $('#form-kelas input[name="kurikulum"]').val();
        let nama = $(e.currentTarget).parents('.item-kelas').attr('data-nama');
        $('#form-peserta-kelas input[name="tahun"]').val(tahun);
        $('#form-peserta-kelas input[name="semester"]').val(semester);
        $('#form-peserta-kelas input[name="kdmk"]').val(kdmk);
        $('#form-peserta-kelas input[name="kurikulum"]').val(kurikulum);
        $('#form-peserta-kelas input[name="nama"]').val(nama);
        $('#form-peserta-kelas').trigger('submit');
        $('#form-peserta-kelas .info-kelas').html(`Kelas ${nama}`);

        $('#form-pemrogram input[name="tahun"]').val(tahun);
        $('#form-pemrogram input[name="semester"]').val(semester);
        $('#form-pemrogram input[name="kdmk"]').val(kdmk);
        $('#form-pemrogram input[name="kurikulum"]').val(kurikulum);
        $('#form-pemrogram').trigger('submit');

        $('#form-print-bapresensi input[name="tahun"]').val(tahun);
        $('#form-print-bapresensi input[name="semester"]').val(semester);
        $('#form-print-bapresensi input[name="kdmk"]').val(kdmk);
        $('#form-print-bapresensi input[name="kurikulum"]').val(kurikulum);
        $('#form-print-bapresensi input[name="nama"]').val(nama);
      });
      $('#list-kelas').on('click', '.bt-delete', (e) => {
        e.stopPropagation();
        e.preventDefault();
        let tahun = $('#form-kelas input[name="tahun"]').val();
        let semester = $('#form-kelas input[name="semester"]').val();
        let kdmk = $('#form-kelas input[name="kdmk"]').val();
        let kurikulum = $('#form-kelas input[name="kurikulum"]').val();
        let nama = $(e.currentTarget).parents('.item-kelas').attr('data-nama');
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          nama: nama
        }; console.log(postvalue);
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> kelas ${nama}?`))
          .title('<span class="text-danger">DELETE</span>')
          .positive(() => {
            this.ajax.post('m/x/waka/akademikApi/hapusKelas', postvalue)
              .then(result => {
                $('#form-kelas').trigger('submit');
              }, error => (new CoreError(error)).show());
          }).show()
      });
      $('#form-peserta-kelas').on('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let tahun = $('#form-peserta-kelas input[name="tahun"]').val();
        let semester = $('#form-peserta-kelas input[name="semester"]').val();
        let kdmk = $('#form-peserta-kelas input[name="kdmk"]').val();
        let kurikulum = $('#form-peserta-kelas input[name="kurikulum"]').val();
        let nama = $('#form-peserta-kelas input[name="nama"]').val();
        let perpage = parseInt($('#input-perpage-peserta').val());
        let page = (!App.paginationKelas ||
          perpage != App.paginationKelas.perpage) ?
          1 : App.paginationKelas.page;
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          nama: nama
        }; console.log(postvalue);
        this.ajax.post(`m/x/waka/akademikApi/getMahasiswaKelas/${page}/${perpage}`, postvalue).then(results => { console.log(results);
          let mahasiswas = results.mahasiswa;
          let count = results.count;
          App.populateMahasiswa(mahasiswas);
          if (App.paginationKelas) {
            App.paginationKelas.page = page;
            App.paginationKelas.update(count, perpage);  
          } else
            App.paginationKelas = 
              Pagination.instance('.pagination-peserta', count, perpage).listen(('#form-peserta-kelas')).update(count, perpage);
          App.paginationKelas.page = page;
        });
      });
      $('#form-print-bapresensi').on('click', '.bt-refresh', (e) => {
        e.preventDefault();
        e.stopPropagation();
                let tahun = $('#form-print-bapresensi input[name="tahun"]').val();
        let semester = $('#form-print-bapresensi input[name="semester"]').val();
        let kdmk = $('#form-print-bapresensi input[name="kdmk"]').val();
        let kurikulum = $('#form-print-bapresensi input[name="kurikulum"]').val();
        let nama = $('#form-print-bapresensi input[name="nama"]').val();
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          nama: nama
        }; console.log(postvalue);
        if (!tahun || !semester || !kdmk || !kurikulum || !nama) {
          (new CoreInfo('Kelas belum dipilih.')).show();
          return;
        }
        $('#form-peserta-kelas').trigger('submit');
      });
      $('#form-print-bapresensi').on('click', '.bt-print', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let tahun = $('#form-print-bapresensi input[name="tahun"]').val();
        let semester = $('#form-print-bapresensi input[name="semester"]').val();
        let kdmk = $('#form-print-bapresensi input[name="kdmk"]').val();
        let kurikulum = $('#form-print-bapresensi input[name="kurikulum"]').val();
        let nama = $('#form-print-bapresensi input[name="nama"]').val();
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          nama: nama
        }; console.log(postvalue);
        if (!tahun || !semester || !kdmk || !kurikulum || !nama) {
          (new CoreInfo('Kelas belum dipilih.')).show();
          return;
        }
        let location = (Core.configuration.get('baseurl') + `m/x/waka/print/bapresensi`);
        (new CoreConfirm('Cetak lembar Berita Acara Perkuliahan dan Presensi Mahasiswa Kelas?')).positive((e) => {
          // window.open(location, '_blank');
          $('#form-print-bapresensi').attr('action', location).attr('target', '_blank').trigger('submit');
        }).show();
        // this.ajax.post(`m/x/waka/akademikApi/getMahasiswaKelas/${page}/${perpage}`, postvalue).then(results => { console.log(results);
        //   let mahasiswas = results.mahasiswa;
        //   let count = results.count;
        //   App.populateMahasiswa(mahasiswas);
        //   if (App.paginationKelas) {
        //     App.paginationKelas.page = page;
        //     App.paginationKelas.update(count, perpage);  
        //   } else
        //     App.paginationKelas = 
        //       Pagination.instance('.pagination-peserta', count, perpage).listen(('#form-peserta-kelas')).update(count, perpage);
        //   App.paginationKelas.page = page;
        // });
      });
      $('#form-peserta-kelas').on('click', '.bt-keluarkan', (e) => {
        console.log(e, $(e.currentTarget).parents('.item-mahasiswa'));
        let tahun = $('#form-peserta-kelas input[name="tahun"]').val();
        let semester = $('#form-peserta-kelas input[name="semester"]').val();
        let kdmk = $('#form-peserta-kelas input[name="kdmk"]').val();
        let kurikulum = $('#form-peserta-kelas input[name="kurikulum"]').val();
        let nama = $('#form-peserta-kelas input[name="nama"]').val();
        let nrm = $(e.currentTarget).parents('.item-mahasiswa').attr('data-nrm');
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          nama: nama,
          nrm: nrm
        }; console.log(postvalue);
        (new CoreConfirm(`Keluarkan mahasiswa dari kelas ${nama}? Nilai mahasiswa yang dikeluarkan untuk matakuliah yang diprogram ini akan dihapus.`)
          .title('<span class="text-danger">Keluar Kelas</span>')).positive(() => {
            this.ajax.post('m/x/waka/akademikApi/keluarkanKelas', postvalue)
              .then(result => {
                $('#form-peserta-kelas').trigger('submit');
                $('#form-pemrogram').trigger('submit');
                $('#form-kelas').trigger('submit');
              }, error => (new CoreError(error)).show());
          }).show();
      });
      $('#form-pemrogram').on('submit', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        let tahun = $('#form-pemrogram input[name="tahun"]').val();
        let semester = $('#form-pemrogram input[name="semester"]').val();
        let kdmk = $('#form-pemrogram input[name="kdmk"]').val();
        let kurikulum = $('#form-pemrogram input[name="kurikulum"]').val();
        let perpage = parseInt($('#input-perpage-peserta').val());
        let page = (!App.paginationPemrogram ||
          perpage != App.paginationPemrogram.perpage) ?
          1 : App.paginationPemrogram.page;
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum
        }; console.log(postvalue);
        this.ajax.post(`m/x/waka/akademikApi/getPemrogram/${page}/${perpage}`, postvalue).then(results => { console.log(results);
          let mahasiswas = results.mahasiswa;
          let count = results.count;
          App.populateMahasiswaPemrogram(mahasiswas);
          if (App.paginationPemrogram) {
            App.paginationPemrogram.page = page;
            App.paginationPemrogram.update(count, perpage);  
          } else
            App.paginationPemrogram = 
              Pagination.instance('.pagination-peserta-pemrogram', count, perpage).listen(('#form-pemrogram')).update(count, perpage);
          App.paginationPemrogram.page = page;
        });
      });
      $('#form-pemrogram').on('click', '.bt-masukkan', (e) => {
        console.log(e, $(e.currentTarget).parents('.item-mahasiswa'));
        let tahun = $('#form-pemrogram input[name="tahun"]').val();
        let semester = $('#form-pemrogram input[name="semester"]').val();
        let kdmk = $('#form-pemrogram input[name="kdmk"]').val();
        let kurikulum = $('#form-pemrogram input[name="kurikulum"]').val();
        let nama = $('#form-peserta-kelas input[name="nama"]').val();
        let nrm = $(e.currentTarget).parents('.item-mahasiswa').attr('data-nrm');
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          nama: nama,
          nrm: nrm
        }; console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/masukkanKelas', postvalue)
          .then(result => {
            $('#form-peserta-kelas').trigger('submit');
            $('#form-pemrogram').trigger('submit');
            $('#form-kelas').trigger('submit');
          }, error => (new CoreError(error)).show());
      });
    }

    onLoad() {
      this.ajax.get('m/x/waka/akademikApi/getTahunPenawaranList').then(tahuns => {
        let html = '';
        tahuns.forEach(tahun => html += `<option value="${tahun.tahun}">${tahun.tahun}</option>`)
        $('#form-penawaran select[name="input-tahun"]').html(html);
        $('#form-penawaran').trigger('submit');
      });
    }

  }

  App.populateMatakuliah = (matakuliahs) => {
    let html = '';
    matakuliahs.forEach(matakuliah => {
      html += `<div class="item-matakuliah list-item d-flex justify-content-between py-1 px-2 border-bottom" `
      html += `data-kdmk="${matakuliah.kdmk}" data-kurikulum="${matakuliah.kurikulum}" data-sks="${matakuliah.sks}">`
      html += `<span class="d-flex align-items-center text-nowrap text-truncate">`
      html += `<span class="badge rounded border-1 bg-secondary text-light me-2">Kurikulum ${matakuliah.kurikulum}</span>`
      html += `<span class="me-2">${matakuliah.kdmk}</span>`;
      html += `<span class="text-primary">${matakuliah.namamk}</span> `
      html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">${matakuliah.sks} SKS</span>`
      html += `</span>`;
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-primary bt-pilih text-nowrap"><i class="bi bi-search"></i><i class="bi bi-check-lg me-2"></i> Pilih</span>`
      html += `</div>`;
    });
    if (matakuliahs.length == 0) html = '<div class="text-center border border-1 border-danger rounded p-2 bg-danger-subtle"><em class="text-danger">Tidak ada data. Silakan gunakan kata kunci yang lain.</em></div>';
    $('#list-matakuliah').html(html);
  }
  App.populateKelas = (kelases) => { console.log(kelases);
    let listHtml = '';
    let checked = '';
    kelases.forEach(kelas => { 
      listHtml += `<div class="item-kelas list-item d-flex align-items-center px-2 py-1 border-bottom" role="button"`
      listHtml += `  data-tahun="${kelas.tahun}" data-semester="${kelas.semester}" data-nama="${kelas.nama}"`
      listHtml += `  data-kdmk="${kelas.kdmk}" data-kurikulum="${kelas.kurikulum}">`
      listHtml += `  <span class="flex-fill ps-2 kelas-truncate kelas-nowrap">`
      listHtml += `  <span class="">Kelas ${kelas.nama}</span>`
      listHtml += `  <span class="ms-3">Peserta ${kelas.jumlah}</span>`
      listHtml += `  </span>`
      listHtml += `  <span class="text-end text-nowrap ms-3">`
      listHtml += `    <button class="btn btn-sm btn-primary text-light bt-show p-2 py-1"><i class="bi bi-search me-2"></i><i class="bi bi-people-fill"></i></button>`
      listHtml += `    <button class="btn btn-sm btn-danger text-light bt-delete p-2 py-1"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data kelas yang ditawarkan tidak ditemukan.</em>';
    $('#list-kelas').html(listHtml);
    $(".item-kelas:last-child").get(0).scrollIntoView({behavior: 'smooth'});
  }
  App.populateMahasiswa = (mahasiswas) => {
    let html = '';
    mahasiswas.forEach(mahasiswa => {
      html += `<div class="item-mahasiswa list-item d-flex justify-content-between py-1 px-2 border-bottom" `
      html += `data-nrm="${mahasiswa.nrm}" data-nama="${mahasiswa.nama}" data-prodi="${mahasiswa.prodi}">`
      html += `<span class="d-flex align-items-center text-nowrap text-truncate">`
      html += `<span class="me-2">${mahasiswa.nim}</span>`;
      html += `<span class="text-primary">${mahasiswa.namam}</span> `
      html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">${mahasiswa.prodi}</span>`
      html += `</span>`;
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-danger bt-keluarkan text-light text-nowrap"><i class="bi bi-arrow-down"></i> Keluarkan</span>`
      html += `</div>`;
    });
    if (mahasiswas.length == 0) {
      html = '<div class="text-center border border-1 border rounded p-2 bg-light"><em class="text-secondary">'
      html += 'Tidak ada mahasiswa yang terdaftar di dalam kelas.</em></div>';    
    } 
    $('#list-mahasiswa').html(html);
  }
  App.populateMahasiswaPemrogram = (mahasiswas) => {
    let html = '';
    mahasiswas.forEach(mahasiswa => {
      html += `<div class="item-mahasiswa list-item d-flex justify-content-between py-1 px-2 border-bottom" `
      html += `data-nrm="${mahasiswa.nrm}" data-nama="${mahasiswa.nama}" data-prodi="${mahasiswa.prodi}">`
      html += `<span class="d-flex align-items-center text-nowrap text-truncate">`
      html += `<span class="me-2">${mahasiswa.nim}</span>`;
      html += `<span class="text-primary">${mahasiswa.namam}</span> `
      html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">${mahasiswa.prodi}</span>`
      html += `</span>`;
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-success bt-masukkan text-light text-nowrap"><i class="bi bi-arrow-up"></i> Masukkan</span>`
      html += `</div>`;
    });
    if (mahasiswas.length == 0) {
      html = '<div class="text-center border border-1 border rounded p-2 bg-light"><em class="text-secondary">'
      html += 'Tidak ada data atau semua mahasiswa yang memprogram matakuliah ini sudah terdaftar di dalam kelas.</em></div>';
    }
    $('#list-mahasiswa-pemrogram').html(html);
  }
  // App.populateTahun = (tahuns) => {
  //   let html = '';
  //   tahuns.forEach(tahun => html += `<option value="${tahun.tahun}">${tahun.tahun}</option>`)
  //   $('#input-tahun').html(html);
  // }
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