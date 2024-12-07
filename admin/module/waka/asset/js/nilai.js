$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      App.ajax = this.ajax;
      this.handleEvent();
      this.onLoad();
    }

    handleEvent() {
      // preventing page from redirecting
      $("html").on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("#uploadfile").text("Drag ke sini.");
      });

      $("html").on("drop", function(e) { e.preventDefault(); e.stopPropagation(); });
      // Drag enter
      $('.upload-area').on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("#uploadfile").text("Drop di sini.");
      });
      // Drag over
      $('.upload-area').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("h1").text("Drop");
      });
      // Drop
      $('.upload-area').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("#uploadfile").text("Proses upload file...");
        var file = e.originalEvent.dataTransfer.files;
        var fd = new FormData();
        fd.append('file', file[0]);
        App.uploadFile(fd);
      });
      // Open file selector on div click
      $("#uploadfile").click(function(){
        $("#file").click();
        $("#uploadfile").text("Pilih file Excel nilai untuk di-upload...");
      });
      // file selected
      $("#file").change(function(){
        var formdata = new FormData();
        var files = $('#file')[0].files[0];
        formdata.append('file',files);
        App.uploadFile(formdata);
      });
      
      
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
        this.ajax.post(`m/x/waka/akademikApi/getMatakuliahDitawarkan/${page}/${perpage}`, postvalue).then(results => { // console.log(results);
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
        ]).then(results => { // console.log(results);
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

        $('#form-nilai input[name="tahun"]').val(tahun);
        $('#form-nilai input[name="semester"]').val(semester);
        $('#form-nilai input[name="kdmk"]').val(kdmk);
        $('#form-nilai input[name="kurikulum"]').val(kurikulum);
        $('#form-nilai input[name="nama"]').val(nama);
      });

      $('#list-kelas').on('click', '.bt-presensi-uts', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let tahun = $('#form-kelas input[name="tahun"]').val();
        let semester = $('#form-kelas input[name="semester"]').val();
        let kdmk = $('#form-kelas input[name="kdmk"]').val();
        let kurikulum = $('#form-kelas input[name="kurikulum"]').val();
        let nama = $(e.currentTarget).parents('.item-kelas').attr('data-nama');
        $('#form-presensi-uts input[name="tahun"]').val(tahun);
        $('#form-presensi-uts input[name="semester"]').val(semester);
        $('#form-presensi-uts input[name="kdmk"]').val(kdmk);
        $('#form-presensi-uts input[name="kurikulum"]').val(kurikulum);
        $('#form-presensi-uts input[name="nama"]').val(nama);
        $('#form-presensi-uts').attr('action', Core.configuration.get('baseurl') + 'm/x/waka/print/bapresensiuts')
        $('#form-presensi-uts').trigger('submit');
      });
      $('#list-kelas').on('click', '.bt-presensi-uas', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let tahun = $('#form-kelas input[name="tahun"]').val();
        let semester = $('#form-kelas input[name="semester"]').val();
        let kdmk = $('#form-kelas input[name="kdmk"]').val();
        let kurikulum = $('#form-kelas input[name="kurikulum"]').val();
        let nama = $(e.currentTarget).parents('.item-kelas').attr('data-nama');
        $('#form-presensi-uas input[name="tahun"]').val(tahun);
        $('#form-presensi-uas input[name="semester"]').val(semester);
        $('#form-presensi-uas input[name="kdmk"]').val(kdmk);
        $('#form-presensi-uas input[name="kurikulum"]').val(kurikulum);
        $('#form-presensi-uas input[name="nama"]').val(nama);
        $('#form-presensi-uas').attr('action', Core.configuration.get('baseurl') + 'm/x/waka/print/bapresensiuas')
        $('#form-presensi-uas').trigger('submit');
      });
      $('#list-kelas').on('click', '.bt-download-excel', (e) => {
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
        }; // console.log(postvalue);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', Core.configuration.get('baseurl') + 'm/x/waka/excel/nilaikelas');
        xhr.responseType = 'blob';
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function(e) {
          if (this.status == 200) {
            // console.log(this);
            var blob = new Blob([this.response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            var downloadUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "nilai-"+tahun+"-"+semester+"-"+kdmk+"-"+kurikulum+"-"+nama+".xlsx";
            document.body.appendChild(a);
            a.click();
          } else {
            (new CoreError('Unable to download Excel file.')).show();
          }
        };
        let postdata = JSON.stringify(postvalue);
        // console.log(postdata);
        xhr.send(postdata);
        // this.ajax.post(`m/x/waka/excel/nilaikelas`, postvalue).then(result => {
        //   console.log(result);
        // });
      });
      $('#form-peserta-kelas').on('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let tahun = $('#form-peserta-kelas input[name="tahun"]').val();
        let semester = $('#form-peserta-kelas input[name="semester"]').val();
        let kdmk = $('#form-peserta-kelas input[name="kdmk"]').val();
        let kurikulum = $('#form-peserta-kelas input[name="kurikulum"]').val();
        let nama = $('#form-peserta-kelas input[name="nama"]').val();
        let postvalue = {
          tahun: tahun,
          semester: semester,
          kdmk: kdmk,
          kurikulum: kurikulum,
          nama: nama
        }; // console.log(postvalue);
        this.ajax.post(`m/x/waka/akademikApi/getNilaiKelas`, postvalue).then(mahasiswas => { // console.log(mahasiswas);
          App.populateMahasiswa(mahasiswas);
        });
      });
      $('#form-nilai').on('click', '.bt-refresh', (e) => {
        e.preventDefault();
        e.stopPropagation();
                let tahun = $('#form-nilai input[name="tahun"]').val();
        let semester = $('#form-nilai input[name="semester"]').val();
        let kdmk = $('#form-nilai input[name="kdmk"]').val();
        let kurikulum = $('#form-nilai input[name="kurikulum"]').val();
        let nama = $('#form-nilai input[name="nama"]').val();
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
      $('#form-nilai').on('click', '.bt-save-all', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let tahun = $('#form-nilai input[name="tahun"]').val();
        let semester = $('#form-nilai input[name="semester"]').val();
        let kdmk = $('#form-nilai input[name="kdmk"]').val();
        let kurikulum = $('#form-nilai input[name="kurikulum"]').val();
        let nama = $('#form-nilai input[name="nama"]').val();
        if (!tahun || !semester || !kdmk || !kurikulum || !nama) {
          (new CoreInfo('Kelas belum dipilih.')).show();
          return;
        }
        $(".progress-bar").css({
          "width": "0%"
        });
        let location = (Core.configuration.get('baseurl') + `m/x/waka/akademikApi/simpanNilaiMahasiswa`);
        (new CoreConfirm('Simpan permanen nilai seluruh mahasiswa yang ditampilkan ke dalam database?')).positive((e) => {
          let total = $('#list-mahasiswa .item-mahasiswa').length;
          let inprogress = 0;
          let progress = 0;
          $('#list-mahasiswa .item-mahasiswa').each((i, e) => {
            let nrm = $(e).attr('data-nrm');
            let nilai = $(e).find('select[name="nilai"]').val();
            let bobotnilai = $(e).find('.bobotnilai').attr('data-bobotnilai');
            let postvalue = {
              nrm: nrm,
              tahun: tahun,
              semester: semester,
              kdmk: kdmk,
              kurikulum: kurikulum,
              nama: nama,
              nilai: nilai,
              bobotnilai: bobotnilai
            }; // console.log(postvalue);
            this.ajax.post(location, postvalue).then(result => {
              if (inprogress < total) {
                inprogress++;
                $("#tprogress").html(inprogress + ' / ' + total + ' completed');
                progress = Math.round(inprogress / total * 100);
                $(".progress-bar").css({
                   "width": progress + "%"
                });
                // $(".progress-bar").html(progress + '%');
              }
            })
          })
          // $('#form-nilai').attr('action', location).attr('target', '_blank').trigger('submit');
        }).show();
      });
      $('#list-mahasiswa').on('change', 'select[name="nilai"]', (e) => { // console.log(e);
        let nilai = $(e.currentTarget).val();
        let bobotnilai = 0;
        if (nilai == "A") bobotnilai = 4;
        if (nilai == "B+") bobotnilai = 3.5;
        if (nilai == "B") bobotnilai = 3;
        if (nilai == "C+") bobotnilai = 2.5;
        if (nilai == "C") bobotnilai = 2;
        if (nilai == "D+") bobotnilai = 1.5;
        if (nilai == "D") bobotnilai = 1;
        if (nilai == "E") bobotnilai = 0;
        $(e.currentTarget).parents('.item-mahasiswa').find('.bobotnilai').attr('data-bobotnilai', bobotnilai).html(bobotnilai);
        // $(`#list-mahasiswa .item-mahasiswa[data-nrm="${row[0]}"] .bobotnilai`).attr('data-bobotnilai', bobotnilai).html(bobotnilai);
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
  App.populateKelas = (kelases) => { // console.log(kelases);
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
      listHtml += `    <button class="btn btn-sm btn-primary text-light bt-show p-2 py-1"><i class="bi bi-search me-2"></i><i class="bi bi-people-fill"></i> Pilih</button>`
      listHtml += `    <button class="btn btn-sm btn-secondary-outline text-dark bt-download-excel p-2 py-1 border border-secondary"><i class="bi bi-file-earmark-excel-fill text-success"></i><i class="bi bi-arrow-down"></i> Excel Nilai</button>`
      listHtml += `    <button class="btn btn-sm btn-secondary-outline text-dark bt-presensi-uts p-2 py-1 border border-secondary"><i class="bi bi-file-earmark-pdf-fill text-danger"></i><i class="bi bi-arrow-down"></i> Presensi UTS</button>`
      listHtml += `    <button class="btn btn-sm btn-secondary-outline text-dark bt-presensi-uas p-2 py-1 border border-secondary"><i class="bi bi-file-earmark-pdf-fill text-danger"></i><i class="bi bi-arrow-down"></i> Presensi UAS</button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">Data kelas yang ditawarkan tidak ditemukan.</em>';
    $('#list-kelas').html(listHtml);
    $(".item-kelas:last-child").get(0).scrollIntoView({behavior: 'smooth'});
  }
  App.populateMahasiswa = (mahasiswas) => {
    let html = '';
    mahasiswas.forEach(mahasiswa => { //console.log(mahasiswa);
      html += `<tr class="item-mahasiswa" `
      html += `data-nrm="${mahasiswa.nrm}" data-nama="${mahasiswa.nama}" data-prodi="${mahasiswa.prodi}">`
      html += `<td class="text-center align-middle">${mahasiswa.nim}</td>`;
      html += `<td class="text-primary align-middle">${mahasiswa.namam}</td> `
      html += `<td class="text-center nilai align-middle"><select name="nilai" class="form-select pe-5 py-0">`;
      html += `<option value="K">K</option>`
      html += `<option value="A" ${(mahasiswa.nilai == "A" ? 'selected="selected"' : '')}>A</option>`;
      html += `<option value="B+" ${(mahasiswa.nilai == "B+" ? 'selected="selected"' : '')}>B+</option>`;
      html += `<option value="B" ${(mahasiswa.nilai == "B" ? 'selected="selected"' : '')}>B</option>`;
      html += `<option value="C+" ${(mahasiswa.nilai == "C+" ? 'selected="selected"' : '')}>C+</option>`;
      html += `<option value="C" ${(mahasiswa.nilai == "C" ? 'selected="selected"' : '')}>C</option>`;
      html += `<option value="D+" ${(mahasiswa.nilai == "D+" ? 'selected="selected"' : '')}>D+</option>`;
      html += `<option value="D" ${(mahasiswa.nilai == "D" ? 'selected="selected"' : '')}>D</option>`;
      html += `<option value="E" ${(mahasiswa.nilai == "E" ? 'selected="selected"' : '')}>E</option>`;
      html += `</select></td>`
      html += `<td class="text-center align-middle bobotnilai" data-bobotnilai="${(mahasiswa.bobotnilai ? mahasiswa.bobotnilai : 0)}">${(mahasiswa.bobotnilai ? mahasiswa.bobotnilai : 0)}</td>`
      html += `<td class="align-middle">`
      html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-danger bt-hapus-nilai text-light text-nowrap"><i class="bi bi-eraser"></i></span>`
      html += `</td>`
      html += `</tr>`;
    });
    if (mahasiswas.length == 0) {
      // html = '<div class="text-center border border-1 border rounded p-2 bg-light"><em class="text-secondary">'
      // html += 'Tidak ada mahasiswa yang terdaftar di dalam kelas.</em></div>';    
    } 
    $('#list-mahasiswa').html(html);
  }
  App.semester = (sem) => {
    if (sem == 1) return "Ganjil";
    if (sem == 2) return "Genap";
    if (sem == 3) return "Ganjil Pendek";
    if (sem == 4) return "Genap Pendek";
  }
  App.uploadFile = (formdata) => {
    App.ajax.post('m/x/waka/excel/uploadnilaikelas', formdata)
      .then(result => { // console.log(result);
        let tahun = $('#form-nilai input[name="tahun"]').val();
        let semester = $('#form-nilai input[name="semester"]').val();
        let kdmk = $('#form-nilai input[name="kdmk"]').val();
        let kurikulum = $('#form-nilai input[name="kurikulum"]').val();
        let nama = $('#form-nilai input[name="nama"]').val();
        try {
          if (!tahun || !semester || !kdmk || !kurikulum || !nama) {
            throw new Error('Kelas belum dipilih.');
          }
          if (result.length && result.length > 1) {
            let header = result[0];
            let inrm = -1;
            let ina = -1;
            for (let col = 0; col < header.length; col++) {
              if(header[col] == 'NRM') inrm = col;
              if(header[col] == 'Nilai Huruf') ina = col;
            }
            if (inrm == -1 || ina == -1) throw new Error('File tidak valid. Tidak ada kolom NRM atau Nilai Huruf')
            let match = 0;
            for(let i = 1; i < result.length; i++) {
              let row = result[i];
              if ($(`#list-mahasiswa .item-mahasiswa[data-nrm="${row[inrm]}"] select[name="nilai"]`).length == 1) match++;
            }
            if (match != result.length-1) throw new Error('Mahasiswa di dalam file Excel tidak sesuai. Kelas yang berbeda?');
            for(let i = 1; i < result.length; i++) {
              let row = result[i];
              $(`#list-mahasiswa .item-mahasiswa[data-nrm="${row[inrm]}"] select[name="nilai"]`).val(row[ina]).trigger('change');
            }
            $("#uploadfile").html(`Proses nilai selesai <i class="bi bi-check-circle-fill text-success"></i>.
            <br>Nilai dari file Excel telah diisikan ke dalam form nilai,
            <br>namun Nilai <span class="text-danger">BELUM</span> disimpan di database.`);
          } else throw new Error('File tidak valid.');
        } catch(e) {
          (new CoreError(e)).show();
          $("#uploadfile").html('Proses nilai gagal <i class="bi bi-x-circle-fill text-danger"></i>.');
        };
      });
  } 

  new App();

  // let pagination = Pagination.instance('.pagination-matakuliah').update(100, 10);
  // console.log(pagination);
});