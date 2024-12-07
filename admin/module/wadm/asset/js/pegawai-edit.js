$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      App.ajax = this.ajax;
      this.handleEvent();
      this.onLoad();
    }

    handleEvent() {
      $('#form-identitas-diri').on('submit', function(e) { 
        // console.log(e, e.currentTarget, this, e.currentTarget.checkValidity());
        e.currentTarget.classList.add('was-validated');
        e.preventDefault();
        e.stopPropagation();
        let nip = $('#input-nip').attr('data-nip');
        let nama = $('#input-nama').val();
        let j_kelamin = $('input[name="input-j_kelamin"]:checked').val();
        let tp_lahir = $('#input-tp_lahir').val();
        let tg_lahir = $('#input-tg_lahir').data().datepicker.getFormattedDate('yyyy-mm-dd');
        let kdagama = $('select[name="input-kdagama"]').val();
        let status = $('input[name="input-status"]:checked').val();
        let alamat = $('#input-alamat').val();
        let telp1 = $('#input-telp1').val();
        let telp2 = $('#input-telp2').val();
        let jabatan = $('#input-jabatan').val();
        let nidn = $('#input-nidn').val();

        if (!e.currentTarget.checkValidity()) return;

        let postdata = {
          nip: nip,
          nama: nama,
          j_kelamin: j_kelamin,
          tp_lahir: tp_lahir,
          tg_lahir: tg_lahir,
          kdagama: kdagama,
          status: status,
          alamat: alamat,
          telp1: telp1,
          telp2: telp2,
          jabatan: jabatan,
          nidn: nidn
        }; console.log(postdata);
        (new CoreConfirm(`Update pegawai: ${nama}?`)).positive(() => {
          App.ajax.post('m/x/wadm/pegawaiApi/updateIdentitasDiri', postdata).then((result) => { // console.log(result);
            (new CoreInfo(`Data identitas diri pegawai telah diperbarui.`)).show();
          })
        }).show();
      });
    }

    onLoad() {
      $('#input-tg_lahir').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
      });
      // let date = new Date();
      // var today = new Date(date.getFullYear()-17, date.getMonth(), date.getDate());
      // $('#input-tg_lahir').datepicker('setDate', today);
      let nip = $('#input-nip').attr('data-nip');
      Promise.all([
        this.ajax.get('m/x/wadm/generalApi/listAgama'),
        this.ajax.get(`m/x/wadm/pegawaiApi/getPegawai/${nip}`),
      ]).then(results => {
        let agamas = results[0];
        let pegawai = results[1];
        App.populateAgama(agamas);
        App.populateForm(pegawai);
      });
    }

  }

  App.populateAgama = (agamas) => {
    let html = '';
    agamas.forEach(agama => html += `<option value="${agama.kdagama}">${agama.agama}</option>`);
    $('#input-kdagama').html(html);
  }
  App.populateForm = (pegawai) => { console.log(pegawai);

    // form-identitas-diri

    $('#input-nama').val(pegawai.nama);
    $(`input[name="input-j_kelamin"][value="${pegawai.j_kelamin}"]`).prop('checked', true);
    $('#input-tp_lahir').val(pegawai.tp_lahir);

    if (pegawai.tg_lahir) {
      var tgl = pegawai.tg_lahir.split("-");
      var tg_lahir = new Date(tgl[0], tgl[1]-1, tgl[2]);
      $('#input-tg_lahir').datepicker('setDate', tg_lahir);
    }

    $(`select[name="input-kdagama"]`).val(pegawai.kdagama).trigger('select');
    $(`input[name="input-status"][value="${pegawai.status}"]`).prop('checked', true);
    $('#input-alamat').val(pegawai.alamat);
    $('#input-telp1').val(pegawai.telp1);
    $('#input-telp2').val(pegawai.telp2);
    $('#input-jabatan').val(pegawai.jabatan);
    $('#input-nidn').val(pegawai.nidn);

  }

  new App();

});