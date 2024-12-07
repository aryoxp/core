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
        if (keyword.length < 0) {
          $('input[name="keyword"]').addClass('is-invalid');
          return;
        } else $('input[name="keyword"]').removeClass('is-invalid');
        this.ajax.post(`m/x/waka/studentApi/search/1/300`, {
            keyword: keyword
        }).then(results => { // console.log(results);
          App.populateMahasiswa(results.mahasiswa);
        });
      });
      $('#list-mahasiswa').on('click', '.bt-set', (e) => {
        let nrm = $(e.currentTarget).parents('.list-item').attr('data-nrm');
        let postvalue = {
          nrm: nrm
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/getDataAkademikMahasiswa', postvalue)
          .then(result => { // console.log(result);
            $('form#akademik input[name="namam"]').val(result.namam);
            $('form#akademik input[name="nrm"]').val(result.nrm);
            $('form#akademik input[name="nim"]').val(result.nim);
            $('form#akademik input[name="tplahir"]').val(result.tplahir);
            $('form#akademik select[name="status"]').val(result.status).trigger('change');
            $('form#akademik input[name="tglahir"]').val(result.tglahir);
            $('form#akademik input[name="tgmasuk"]').val(result.tgmasuk);
            $('form#akademik input[name="tglulus"]').val(result.tglulus);

            $('form#akademik .info-nrm').html('NRM ' + result.nrm 
              + ` <small class="text-muted ms-4 fw-light">Program Studi ${App.prodi(result.prodi)}</small>`);

            let tgmasuk = new Date($('input[name="tglahir"]').val());
            $('input[name="tglahir"]').datepicker('setDate', tgmasuk);
            $('input[name="tgmasuk"]').datepicker('setDate', new Date($('input[name="tgmasuk"]').val()));
            $('input[name="tglulus"]').datepicker('setDate', new Date($('input[name="tglulus"]').val()));
      
            App.dialogAkademik = (new CoreWindow('form#akademik', {
              draggable: true,
              width: '900px'
            })).show();
          });
      });
      $('form#akademik').on('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      $('form#akademik .bt-close').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        App.dialogAkademik.hide();
        $('form#wisuda select[name="tgwisuda"]').trigger('change');
      });
      $('form#akademik .bt-save').on('click', (e) => {
        let field = $(e.currentTarget).siblings('input').attr('name');
        let value = $(e.currentTarget).siblings(`input[name="${field}"]`).val();
        let nrm = $('form#akademik input[name="nrm"]').val();
        if (field == 'tglahir' || field == 'tgmasuk' || field == 'tglulus') {
          if (/^$|\s+/.test(value)) {
            (new CoreError('Tanggal tidak valid.')).show();
            return;
          }
          value = value.split("/").reverse().join("-");
        }
        if (field == undefined) {
          field = $(e.currentTarget).siblings('select').attr('name');
          value = $(e.currentTarget).siblings(`select[name="${field}"]`).val();
        }
        if (field == undefined) {
          field = $(e.currentTarget).parent().siblings('.form-floating').find('textarea').attr('name');
          value = $(e.currentTarget).parent().siblings('.form-floating').find(`textarea[name="${field}"]`).val();
        }
        let postvalue = {
          nrm: nrm,
          field: field,
          value: value
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/saveDataAkademik', postvalue)
          .then((result) => { // console.log(result);
            $(e.currentTarget).find('i').removeClass().addClass('bi bi-check-lg');
            $(e.currentTarget).removeClass('bg-success text-light').addClass('bg-warning text-dark');
            setTimeout(() => {
              $(e.currentTarget).find('i').removeClass().addClass('bi bi-floppy');
              $(e.currentTarget).removeClass('bg-warning text-dark').addClass('bg-success text-light');
            }, 1000);
          });
      });
      $('form#akademik .bt-clear').on('click', (e) => {
        let field = $(e.currentTarget).siblings('input').attr('name');
        let nrm = $('form#akademik input[name="nrm"]').val();
        if (field == undefined) {
          field = $(e.currentTarget).siblings('select').attr('name');
        }
        if (field == undefined) {
          field = $(e.currentTarget).parent().siblings('.form-floating').find('textarea').attr('name');
        }
        let postvalue = {
          nrm: nrm,
          field: field
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/clearDataAkademik', postvalue)
          .then((result) => { // console.log(result);
            $(e.currentTarget).siblings(`input[name="${field}"]`).val('');
            $(e.currentTarget).find('i').removeClass().addClass('bi bi-check-lg');
            $(e.currentTarget).removeClass('bg-danger text-light').addClass('bg-warning text-dark');
            setTimeout(() => {
              $(e.currentTarget).find('i').removeClass().addClass('bi bi-eraser');
              $(e.currentTarget).removeClass('bg-warning text-dark').addClass('bg-danger text-light');
            }, 1000);
          });
      });
      $('form#wisuda .bt-create-tgwisuda').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let tgwisuda = $('input[name="tgwisuda"]').val();
        if (/^$|\s+/.test(tgwisuda)) {
          (new CoreError('Tanggal tidak valid.')).show();
          return;
        }
        tgwisuda = tgwisuda.split("/").reverse().join("-");
        let postvalue = {
          tanggal: tgwisuda
        }; console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/createTanggalWisuda', postvalue)
          .then(result => {
            App.getListTanggalWisuda();
            $(e.currentTarget).removeClass('bg-success text-light').addClass('bg-warning text-dark');
            $(e.currentTarget).find('i').removeClass('bi-plus-lg').addClass('bi-check-lg');
            setTimeout(() => {
              $(e.currentTarget).removeClass('bg-warning text-dark').addClass('bg-success text-light');
              $(e.currentTarget).find('i').removeClass('bi-check-lg').addClass('bi-plus-lg');
            }, 1000);
          });
      });
      $('form#wisuda .bt-delete-tgwisuda').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let tgwisuda = $('select[name="tgwisuda"]').val();
        let postvalue = {
          tanggal: tgwisuda
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/deleteTanggalWisuda', postvalue)
          .then(result => { // console.log(result);
            App.getListTanggalWisuda();
            $(e.currentTarget).removeClass('bg-danger text-light').addClass('bg-warning text-dark');
            $(e.currentTarget).find('i').removeClass('bi-x-lg').addClass('bi-check-lg');
            setTimeout(() => {
              $(e.currentTarget).removeClass('bg-warning text-dark').addClass('bg-danger text-light');
              $(e.currentTarget).find('i').removeClass('bi-check-lg').addClass('bi-x-lg');
            }, 1000);
          }, error => (new CoreError(error)).show());
      });
      $('form#wisuda .bt-refresh-tgwisuda').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        $('form#wisuda select[name="tgwisuda"]').trigger('change');
        $(e.currentTarget).removeClass('bg-success').addClass('bg-warning text-dark');
        setTimeout(() => {
          $(e.currentTarget).addClass('bg-success').removeClass('bg-warning text-dark');
        }, 500)
      });
      $('form#wisuda select[name="tgwisuda"]').on('change', (e) => {
        // e.preventDefault();
        // e.stopPropagation();
        let tgwisuda = $('select[name="tgwisuda"]').val();
        let postvalue = {
          tgwisuda: tgwisuda
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/getMahasiswaWisuda', postvalue)
          .then(mahasiswas => { // console.log(result);
            App.listMahasiswaWisuda(mahasiswas);
          }, error => (new CoreError(error)).show());
        this.ajax.post('m/x/waka/akademikApi/getMahasiswaLulusBelumWisuda')
          .then(mahasiswas => {
            App.listMahasiswaLulus(mahasiswas);
          }, error => (new CoreError(error)).show());
      });
      $('#lulus-selection').on('click', '.bt-select-all', (e) => { // console.log(e);
        $('#list-mahasiswa-lulus input[type="checkbox"]').prop('checked', true);
      });
      $('#lulus-selection').on('click', '.bt-unselect-all', (e) => { // console.log(e);
        $('#list-mahasiswa-lulus input[type="checkbox"]').prop('checked', false);
      });
      $('#lulus-selection .bt-daftarkan').on('click', (e) => {
        let tgwisuda = $('form#wisuda select[name="tgwisuda"]').val();
        let nrms = [];
        $('#list-mahasiswa-lulus input[type="checkbox"]:checked').each((i, e) => {
          // console.log(i, e);
          nrms.push($(e).parents('.list-item').attr('data-nrm'));
        });
        let postvalue = {
          tgwisuda: tgwisuda,
          nrms: nrms
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/daftarWisuda', postvalue)
        .then((result) => { // console.log(result);
          $('form#wisuda select[name="tgwisuda"]').trigger('change');
        });
      });
      $('#wisuda-selection').on('click', '.bt-select-all', (e) => { // console.log(e);
        $('#list-mahasiswa-wisuda input[type="checkbox"]').prop('checked', true);
      });
      $('#wisuda-selection').on('click', '.bt-unselect-all', (e) => { // console.log(e);
        $('#list-mahasiswa-wisuda input[type="checkbox"]').prop('checked', false);
      });
      $('#wisuda-selection .bt-keluarkan').on('click', (e) => {
        let tgwisuda = $('form#wisuda select[name="tgwisuda"]').val();
        let nrms = [];
        $('#list-mahasiswa-wisuda input[type="checkbox"]:checked').each((i, e) => {
          // console.log(i, e);
          nrms.push($(e).parents('.list-item').attr('data-nrm'));
        });
        let postvalue = {
          tgwisuda: tgwisuda,
          nrms: nrms
        }; // console.log(postvalue);
        this.ajax.post('m/x/waka/akademikApi/batalWisuda', postvalue)
          .then((result) => { console.log(result);
            $('form#wisuda select[name="tgwisuda"]').trigger('change');
          });
      });
      $('#list-mahasiswa-wisuda').on('blur keydown', 'span[contenteditable]', (e) => {
        // console.log(e);
        if (e.type == 'focusout') { 
          let nrm = $(e.currentTarget).parents('.list-item').attr('data-nrm');
          let field = $(e.currentTarget).attr('data-field');
          let value = $(e.currentTarget).text();
          let postvalue = {
            nrm: nrm,
            field: field,
            value: value
          }; 
          if (/^$|\s+/.test(value)) {
            delete postvalue.value;
          }
          console.log(postvalue);
          this.ajax.post('m/x/waka/akademikApi/saveDataAkademik', postvalue)
          .then((result) => { // console.log(result);
            $(e.currentTarget).addClass('text-success');
            setTimeout(() => {
              $(e.currentTarget).removeClass('text-success');
            }, 1000);
          });
        }
        if (e.type == 'keydown' && e.keyCode === 13) {
          e.preventDefault();
          $(e.currentTarget).trigger('blur');
        }
      });
      $('form#print-transkrip-ijazah').on('click', '.bt-print-transkrip', (e) => {
        let tgwisuda = $('form#wisuda select[name="tgwisuda"]').val();
        let nrms = [];
        $('#list-mahasiswa-wisuda input[type="checkbox"]:checked').each((i, e) => {
          nrms.push($(e).parents('.list-item').attr('data-nrm'));
        });
        let postvalue = {
          tgwisuda: tgwisuda,
          nrms: nrms
        }; console.log(postvalue);
        $('form#print-transkrip-ijazah').find('input[type="hidden"]').remove();
        if (nrms.length == 0) {
          (new CoreError('Belum ada mahasiswa dipilih untuk dicetak transkripnya.')).show();
          return;
        }
        for(let nrm of nrms) {
          $('form#print-transkrip-ijazah').append(`<input type="hidden" name="nrms[]" value="${nrm}">`);
        }
        $('form#print-transkrip-ijazah').attr('action', )
        let location = (Core.configuration.get('baseurl') + `m/x/waka/print/transkripakhir`);
        (new CoreConfirm('Cetak transkrip kelulusan?')).positive((e) => {
          $('form#print-transkrip-ijazah').attr('action', location).attr('target', '_blank').trigger('submit');
        }).show();
      });
      $('form#print-transkrip-ijazah').on('click', '.bt-print-ijazah', (e) => {
        let tgwisuda = $('form#wisuda select[name="tgwisuda"]').val();
        let nrms = [];
        $('#list-mahasiswa-wisuda input[type="checkbox"]:checked').each((i, e) => {
          nrms.push($(e).parents('.list-item').attr('data-nrm'));
        });
        let postvalue = {
          tgwisuda: tgwisuda,
          nrms: nrms
        }; // console.log(postvalue);
        $('form#print-transkrip-ijazah').find('input[type="hidden"]').remove();
        if (nrms.length == 0) {
          (new CoreError('Belum ada mahasiswa dipilih untuk dicetak ijazahnya.')).show();
          return;
        }
        for(let nrm of nrms) {
          $('form#print-transkrip-ijazah').append(`<input type="hidden" name="nrms[]" value="${nrm}">`);
        }
        $('form#print-transkrip-ijazah').attr('action', )
        let location = (Core.configuration.get('baseurl') + `m/x/waka/print/ijazah`);
        (new CoreConfirm('Cetak transkrip kelulusan?')).positive((e) => {
          $('form#print-transkrip-ijazah').attr('action', location).attr('target', '_blank').trigger('submit');
        }).show();
      });
    }

    onLoad() {
      let date = new Date();
      $('#input-tglahir').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
      });
      $('#input-tgmasuk').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
      });
      $('#input-tglulus').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
      });
      $('input[name="tgwisuda"]').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
      });
      App.getListTanggalWisuda();
    }

  }

  App.populateMahasiswa = (mahasiswas) => {
    let html = '';
    mahasiswas.forEach(mahasiswa => {
      html += `<tr class="list-item" data-nrm="${mahasiswa.nrm}">`;
      html += `<td class="">${mahasiswa.nim}</td>`;
      html += `<td>${mahasiswa.namam}<span class="badge bg-warning text-dark ms-2">${App.prodi(mahasiswa.prodi)}</span></td>`;
      html += `<td class="text-nowrap">${mahasiswa.tplahir ?? '-'}</td>`;
      html += `<td class="text-nowrap text-center">${mahasiswa.tglahir ? mahasiswa.tglahir.split("-").reverse().join("/") : '-'}</td>`;
      html += `<td class="text-nowrap text-center">${mahasiswa.tgmasuk ? mahasiswa.tgmasuk.split("-").reverse().join("/") : '-'}</td>`;
      html += `<td class="text-nowrap text-center">${mahasiswa.tglulus ? mahasiswa.tglulus.split("-").reverse().join("/") : '-'}</td>`;
      html += `<td class="text-center">${mahasiswa.jsks ?? '-'}</td>`;
      html += `<td class="text-center">${mahasiswa.ipk ?? '-'}</td>`;
      html += `<td><button class="btn btn-sm btn-primary px-2 py-1 bt-set"><i class="bi bi-pencil"></i></button></td>`;
      html += `</tr>`;
    });
    // html += `</table>`;
    if (mahasiswas.length == 0) html = '<div class="text-center border border-1 border-danger rounded p-2 bg-danger-subtle"><em class="text-danger">Tidak ada data. Silakan gunakan kata kunci yang lain.</em></div>';
    $('#list-mahasiswa').html(html);
  }
  App.semester = (sem) => {
    if (sem == 1) return "Ganjil";
    if (sem == 2) return "Genap";
    if (sem == 3) return "Ganjil Pendek";
    if (sem == 4) return "Genap Pendek";
    return "-";
  }
  App.prodi = (prodi) => {
    if (prodi == "D3") return "D3 Kebidanan";
    if (prodi == "D3F") return "D3 Farmasi";
    if (prodi == "MIK") return "D4 Manajemen Informasi Kesehatan";
    if (prodi == "FIS") return "D4 Fisioterapi";
    return "-";
  }
  App.getListTanggalWisuda = () => {
    App.ajax.get('m/x/waka/akademikApi/getListTanggalWisuda').then(tanggals => {
      let html = ``;
      for(tanggal of tanggals) {
        html += `<option value="${tanggal}">${tanggal.split("-").reverse().join("/")}</option>`;
      }
      $('select[name="tgwisuda"]').html(html);
      $('form#wisuda select[name="tgwisuda"]').trigger('change');
    });
  }
  App.listMahasiswaWisuda = (mahasiswas) => {
    let html = '<table class="table"><tr style="position:sticky;top:0;" class="bg-light">';
    html += `<th></th><th>NIM</th><th>Nama</th><th>No.</th><th>PIN</th><th>SKS</th><th>IPK</th></tr>`;
    mahasiswas.forEach(mahasiswa => {
      html += `<tr class="list-item px-2 py-1" data-nrm="${mahasiswa.nrm}">`;
      html += `<td><input type="checkbox" class="form-check-input"></td>`;
      html += `<td class="text-center"><span class="">${mahasiswa.nim}</span></td>`;
      html += `<td>`;
      html += `<span class="me-2">${mahasiswa.namam}</span>`;
      html += `<span class="badge bg-warning text-dark">${App.prodi(mahasiswa.prodi)}</span>`;
      html += `</td>`;
      html += `<td class="text-center"><span class="d-block" contenteditable="true" data-field="notranskrip">${mahasiswa.notranskrip ?? ''}</span><i class="bi bi-check-lg ms-2 d-none text-success"></i></td>`;
      html += `<td class="text-center"><span class="d-block" contenteditable="true" data-field="pin">${mahasiswa.pin ?? ''}</span><i class="bi bi-check-lg ms-2 d-none text-success"></i></td>`;
      // html += `<span class="text-nowrap">${mahasiswa.tplahir ?? '-'}</span>`;
      // html += `<span class="text-nowrap text-center">${mahasiswa.tglahir ? mahasiswa.tglahir.split("-").reverse().join("/") : '-'}</span>`;
      // html += `<span class="text-nowrap text-center">${mahasiswa.tgmasuk ? mahasiswa.tgmasuk.split("-").reverse().join("/") : '-'}</span>`;
      // html += `<span class="text-nowrap text-center">${mahasiswa.tglulus ? mahasiswa.tglulus.split("-").reverse().join("/") : '-'}</span>`;
      html += `<td class="text-center"><span>${mahasiswa.jsks ?? '-'}</span></td>`;
      html += `<td class="text-center"><span>${mahasiswa.ipk ?? '-'}</span></td>`;
      html += `</tr>`;
    });
    // html += `</table>`;
    if (mahasiswas.length == 0) html = '<div class="text-center border border-1 border-danger rounded p-2 bg-danger-subtle"><em class="text-danger">Tidak ada data. Silakan gunakan kata kunci yang lain.</em></div>';
    $('#list-mahasiswa-wisuda').html(html);
  }
  App.listMahasiswaLulus = (mahasiswas) => {
    let html = '<table class="table"><tr style="position:sticky;top:0;" class="bg-light">';
    html += `<th></th><th>NIM</th><th>Nama</th><th>SKS</th><th>IPK</th></tr>`;
    mahasiswas.forEach(mahasiswa => {
      html += `<tr class="list-item px-2 py-1" data-nrm="${mahasiswa.nrm}">`;
      html += `<td><input type="checkbox" class="form-check-input"></td>`;
      html += `<td class="text-center"><span class="">`;
      html += `${mahasiswa.nim}`;
      html += `</span></td>`;
      html += `<td>`;
      html += `<span class="me-2">${mahasiswa.namam}</span>`;
      html += `<span class="badge bg-warning text-dark">${App.prodi(mahasiswa.prodi)}</span>`;
      html += `</td>`;
      // html += `<td class="text-center"><span>${mahasiswa.notranskrip ?? ''}</span></td>`;
      // html += `<td class="text-center"><span>${mahasiswa.pin ?? ''}</span></td>`;
      // html += `<span class="text-nowrap">${mahasiswa.tplahir ?? '-'}</span>`;
      // html += `<span class="text-nowrap text-center">${mahasiswa.tglahir ? mahasiswa.tglahir.split("-").reverse().join("/") : '-'}</span>`;
      // html += `<span class="text-nowrap text-center">${mahasiswa.tgmasuk ? mahasiswa.tgmasuk.split("-").reverse().join("/") : '-'}</span>`;
      // html += `<span class="text-nowrap text-center">${mahasiswa.tglulus ? mahasiswa.tglulus.split("-").reverse().join("/") : '-'}</span>`;
      html += `<td class="text-center"><span>${mahasiswa.jsks ?? '-'}</span></td>`;
      html += `<td class="text-center"><span>${mahasiswa.ipk ?? '-'}</span></td>`;
      html += `</tr>`;
    });
    // html += `</table>`;
    if (mahasiswas.length == 0) {
      html = '<div class="text-center border border-1 rounded p-2 bg-light">'
      html += '<em class="text-dark">Tidak ada data mahasiswa dengan tanggal lulus diset.</em></div>';}
    $('#list-mahasiswa-lulus').html(html);
  }

  new App();

  // let pagination = Pagination.instance('.pagination-matakuliah').update(100, 10);
  // console.log(pagination);
});