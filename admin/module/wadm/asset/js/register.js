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
        let perpage = parseInt($('#form-search .input-perpage').val())
        let keyword = $('#form-search .input-keyword').val()
        let page = (!App.pagination || 
          keyword != App.pagination.keyword) ?
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
            App.pagination.keyword = keyword;
            App.pagination.update(count, perpage);  
          } else App.pagination = 
            Pagination.instance('.student-pagination', count, perpage).listen('#form-search').update(count, perpage);
            App.pagination.keyword = keyword;
          });
    
      });
    }

    onLoad() {
      let date = new Date();
      let year = date.getFullYear();
      $('#input-angkatan').val(year);
      $('#input-tglahir').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
      });
      var today = new Date(date.getFullYear()-17, date.getMonth(), date.getDate());
      $('#input-tglahir').datepicker('setDate', today);
      this.ajax.get('m/x/wadm/generalApi/listAgama').then(agamas => App.populateAgama(agamas));

      $('#form-registrasi').on('submit', function(e) { 
        console.log(e, e.currentTarget, this, e.currentTarget.checkValidity());
        // if (!e.currentTarget.checkValidity()) {
        //   e.preventDefault();
        //   e.stopPropagation();
        // }
        e.currentTarget.classList.add('was-validated');
        e.preventDefault();
        e.stopPropagation();

        let angkatan = $('#input-angkatan').val();
        let prodi = $('input[name="input-prodi"]:checked').val();
        let semester = $('input[name="input-semester"]:checked').val();
        let paket = $('#input-paket').val();
        let kodeAsalSekolah = $('input[name="input-tingkatasal"]:checked').val();
        let gelombang = $('#input-gelombang').val();
        let status = $('#input-status').val();

        let kodeProgramStudi = 0;
        kodeProgramStudi = (prodi == 'D3') ? 0 : kodeProgramStudi;
        kodeProgramStudi = (prodi == 'D3F') ? 1 : kodeProgramStudi;
        kodeProgramStudi = (prodi == 'MIK') ? 2 : kodeProgramStudi;
        kodeProgramStudi = (prodi == 'FIS') ? 3 : kodeProgramStudi;

        let group = angkatan + kodeProgramStudi + paket + kodeAsalSekolah + semester + "";

        let nama = $('#input-nama').val();
        let tplahir = $('#input-tplahir').val();
        let tglahir = $('#input-tglahir').data().datepicker.getFormattedDate('yyyy-mm-dd');
        let nikpaspor = $('#input-nikpaspor').val();

        if (!e.currentTarget.checkValidity()) return;

        // console.log(angkatan, prodi, kodeProgramStudi, paket, kodeAsalSekolah, semester, gelombang, status, group, nama, tplahir, tglahir, nikpaspor);

        (new CoreConfirm(`Daftarkan mahasiswa: ${nama}?`)).positive(() => {
          App.ajax.post('m/x/wadm/studentApi/register', {
            prodi: prodi,
            group: group,
            gelombang: gelombang,
            status: status,
            nama: nama,
            tplahir: tplahir, 
            tglahir: tglahir,
            nikpaspor: nikpaspor
          }).then((result) => { console.log(result);
            (new CoreInfo(`Mahasiswa telah didaftarkan dengan NRM: ${result.nrm}`)).show();
          })
        }).show();
        

      });

    }

  }

  App.populateAgama = (agamas) => {
    let html = '';
    agamas.forEach(agama => {
      html += `<option value="${agama.kdagama}">${agama.agama}</option>`;
    });
    $('#input-kdagama').html(html);
  }

  // App.populateMahasiswa = (mahasiswas) => { // console.log(mahasiswas);
  //   let listHtml = '';
  //   let selected = App.selectedUsernames;
  //   mahasiswas.forEach(mahasiswa => { 
  //     let checked = selected && selected.includes(mahasiswa.namam) ? 'checked' : '';
  //     listHtml += `<div class="mahasiswa-item d-flex align-items-center py-1 border-bottom" role="button"`
  //     listHtml += `  data-mahasiswaname="${mahasiswa.namam}" data-name="${mahasiswa.namam}">`
  //     listHtml += `  <input type="checkbox" class="cb-mahasiswa ms-1" data-mahasiswaname="${mahasiswa.namam}" ${checked}>`
  //     listHtml += `  <span class="flex-fill ps-2 mahasiswa-truncate mahasiswa-nowrap">`
  //     listHtml += `  <span>${mahasiswa.namam}</span>`
  //     listHtml += `  <span class="px-2 ms-2 badge rounded-pill bg-warning text-dark">${mahasiswa.nim}</span>`
  //     // if (mahasiswa.roles) mahasiswa.roles.split(',').forEach(role => {
  //     //     listHtml += `  <span class="badge rounded-pill bg-primary px-2">${role}</span>`
  //     //   })
  //     // if (mahasiswa.groups) mahasiswa.groups.split(',').forEach(group => {
  //     //     listHtml += `  <span class="badge rounded-pill bg-success px-2">${group}</span>`
  //     //   })
  //     listHtml += `  </span>`
  //     listHtml += `  <span class="text-end text-nowrap ms-3">`
  //     listHtml += `    <button class="btn btn-sm btn-secondary bt-detail"><i class="bi bi-journal-text"></i></button>`
  //     listHtml += `    <button class="btn btn-sm btn-warning bt-edit"><i class="bi bi-pencil"></i></button>`
  //     listHtml += `    <button class="btn btn-sm btn-danger bt-delete"><i class="bi bi-trash"></i></button>`
  //     listHtml += `  </span>`
  //     listHtml += `</div>`
  //   });
  //   if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">No users found in current search.</em>';
  //   $('.student-list').html(listHtml);
  // } 

  new App();

  // let pagination = Pagination.instance('.student-pagination').update(100, 10);
  // console.log(pagination);
});