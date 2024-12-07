$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      App.ajax = this.ajax;
      this.handleEvent();
      this.onLoad();
    }

    handleEvent() {
      $('#input-prop').on('change', e => {
        let propinsi_id = $(e.currentTarget).val();
        this.ajax.get(`m/x/wadm/generalApi/listKotaKabupaten/${propinsi_id}`)
          .then(kotakabs => App.populateKotaKabupaten('#input-kota', kotakabs));
      });
      $('#input-propasal').on('change', e => {
        let propinsi_id = $(e.currentTarget).val();
        this.ajax.get(`m/x/wadm/generalApi/listKotaKabupaten/${propinsi_id}`)
          .then(kotakabs => App.populateKotaKabupaten('#input-kotaasal', kotakabs));
      });
      $('#input-propsekolah').on('change', e => {
        let propinsi_id = $(e.currentTarget).val();
        this.ajax.get(`m/x/wadm/generalApi/listKotaKabupaten/${propinsi_id}`)
          .then(kotakabs => App.populateKotaKabupaten('#input-kotasekolah', kotakabs));
      });
      $('#form-identitas-diri').on('submit', function(e) { 
        // console.log(e, e.currentTarget, this, e.currentTarget.checkValidity());
        e.currentTarget.classList.add('was-validated');
        e.preventDefault();
        e.stopPropagation();
        let nrm = $('#input-nrm').attr('data-nrm');
        let nama = $('#input-nama').val();
        let tplahir = $('#input-tplahir').val();
        let tglahir = $('#input-tglahir').data().datepicker.getFormattedDate('yyyy-mm-dd');
        let goldarah = $('input[name="input-goldarah"]:checked').val();
        let kdagama = $('select[name="input-kdagama"]').val();
        let statnikah = $('input[name="input-statnikah"]:checked').val();
        let nikpaspor = $('#input-nikpaspor').val();
        let telp = $('#input-telp').val();

        if (!e.currentTarget.checkValidity()) return;

        let postdata = {
          nrm: nrm,
          nama: nama,
          tplahir: tplahir,
          tglahir: tglahir,
          goldarah: goldarah,
          kdagama: kdagama,
          statnikah: statnikah,
          nikpaspor: nikpaspor,
          telp: telp,
        }; // console.log(postdata);
        (new CoreConfirm(`Update program mahasiswa: ${nama}?`)).positive(() => {
          App.ajax.post('m/x/wadm/studentApi/updateIdentitasDiri', postdata).then((result) => { // console.log(result);
            (new CoreInfo(`Data identitas diri mahasiswa telah diperbarui.`)).show();
          })
        }).show();
      });
      $('#form-alamat').on('submit', function(e) { 
        // console.log(e, e.currentTarget, this, e.currentTarget.checkValidity());
        e.currentTarget.classList.add('was-validated');
        e.preventDefault();
        e.stopPropagation();

        let nrm = $('#input-nrm').attr('data-nrm');
        let nama = $('#input-nama').val();
        let alamatasal = $('#input-alamatasal').val();
        let propasal = $('#input-propasal').val();
        let kotaasal = $('#input-kotaasal').val();
        let alamat= $('#input-alamat').val();
        let prop = $('#input-prop').val();
        let kota = $('#input-kota').val();

        if (!e.currentTarget.checkValidity()) return;

        let postdata = {
          nrm: nrm,
          alamatasal: alamatasal,
          propasal: propasal,
          kotaasal: kotaasal,
          alamat: alamat,
          prop: prop ? prop : 15,
          kota: kota,
        }; // console.log(postdata);
        (new CoreConfirm(`Update alamat mahasiswa: ${nama}?`)).positive(() => {
          App.ajax.post('m/x/wadm/studentApi/updateAlamat', postdata).then((result) => { // console.log(result);
            (new CoreInfo(`Data alamat mahasiswa telah diperbarui.`)).show();
          })
        }).show();
      });
      $('#form-sekolah-asal').on('submit', function(e) { 
        // console.log(e, e.currentTarget, this, e.currentTarget.checkValidity());
        e.currentTarget.classList.add('was-validated');
        e.preventDefault();
        e.stopPropagation();

        let nrm = $('#input-nrm').attr('data-nrm');
        let nama = $('#input-nama').val();
        let propsekolah = $('#input-propsekolah').val();
        let kotasekolah = $('#input-kotasekolah').val();
        let asalsekolah = $('#input-asalsekolah').val();
        let jurusan= $('#input-jurusan').val();
        let thlulus = $('#input-thlulus').val();

        if (!e.currentTarget.checkValidity()) return;

        let postdata = {
          nrm: nrm,
          propsekolah: propsekolah,
          kotasekolah: kotasekolah,
          asalsekolah: asalsekolah,
          jurusan: jurusan,
          thlulus: thlulus,
        }; console.log(postdata);
        (new CoreConfirm(`Update alamat mahasiswa: ${nama}?`)).positive(() => {
          App.ajax.post('m/x/wadm/studentApi/updateSekolahAsal', postdata).then((result) => { console.log(result);
            (new CoreInfo(`Data sekolah asal mahasiswa telah diperbarui.`)).show();
          })
        }).show();
      });
      $('#form-ortu').on('submit', function(e) { 
        // console.log(e, e.currentTarget, this, e.currentTarget.checkValidity());
        e.currentTarget.classList.add('was-validated');
        e.preventDefault();
        e.stopPropagation();

        let nrm = $('#input-nrm').attr('data-nrm');
        let nama = $('#input-nama').val();
        let namaortu = $('#input-namaortu').val();
        let pekerjaanortu = $('#input-pekerjaanortu').val();
        let telportu = $('#input-telportu').val();
        let alamatortu= $('#input-alamatortu').val();

        if (!e.currentTarget.checkValidity()) return;

        let postdata = {
          nrm: nrm,
          namaortu: namaortu,
          pekerjaanortu: pekerjaanortu,
          telportu: telportu,
          alamatortu: alamatortu,
        }; console.log(postdata);
        (new CoreConfirm(`Update data orang tua/wali mahasiswa: ${nama}?`)).positive(() => {
          App.ajax.post('m/x/wadm/studentApi/updateOrtu', postdata).then((result) => { console.log(result);
            (new CoreInfo(`Data orang tua/wali mahasiswa telah diperbarui.`)).show();
          })
        }).show();
      });
      $('#form-program .bt-enable-edit').on('click', (e) => { // toggle disable/enable form-program
        let attr = $('#form-program fieldset').attr('disabled');
        if (typeof attr !== 'undefined' && attr !== false) {
          $('#form-program fieldset').removeAttr('disabled');
          $('#form-program .bt-update').removeClass('disabled');
        } else {
          $('#form-program fieldset').attr('disabled', true);
          $('#form-program .bt-update').addClass('disabled', true);
        }
      });
      $('#form-program').on('submit', function(e) { 
        // console.log(e, e.currentTarget, this, e.currentTarget.checkValidity());
        e.currentTarget.classList.add('was-validated');
        e.preventDefault();
        e.stopPropagation();

        let nrm = $('#input-nrm').attr('data-nrm');
        let prodi = $('input[name="input-prodi"]:checked').val();
        let gelombang = $('#input-gelombang').val();
        let status = $('#input-status').val();
        let kodeProgramStudi = 0;
        kodeProgramStudi = (prodi == 'D3') ? 0 : kodeProgramStudi;
        kodeProgramStudi = (prodi == 'D3F') ? 1 : kodeProgramStudi;
        kodeProgramStudi = (prodi == 'MIK') ? 2 : kodeProgramStudi;
        kodeProgramStudi = (prodi == 'FIS') ? 3 : kodeProgramStudi;
        let nama = $('#input-nama').val();

        if (!e.currentTarget.checkValidity()) return;
        
        (new CoreConfirm(`Update program mahasiswa: ${nama}?`)).positive(() => {
          App.ajax.post('m/x/wadm/studentApi/updateProgram', {
            nrm: nrm,
            prodi: prodi,
            gelombang: gelombang,
            status: status,
          }).then((result) => { // console.log(result);
            (new CoreInfo(`Data program mahasiswa telah diperbarui.`)).show();
          })
        }).show();

      });
      $('#form-pembayaran-pendaftaran .bt-enable-edit').on('click', (e) => { // toggle disable/enable form-program
        let attr = $('#form-pembayaran-pendaftaran fieldset').attr('disabled');
        console.log(attr);
        if (typeof attr !== 'undefined' && attr !== false) {
          $('#form-pembayaran-pendaftaran fieldset').removeAttr('disabled');
          $('#form-pembayaran-pendaftaran .bt-bayar').removeClass('disabled');
        } else {
          $('#form-pembayaran-pendaftaran fieldset').attr('disabled', true);
          $('#form-pembayaran-pendaftaran .bt-bayar').addClass('disabled', true);
        }
      });
      $('#input-nominal').on("keypress", (e) => {
        if (isNaN(e.key)) e.preventDefault();
      });
      $('#input-nominal').on('keyup', e => {
        let terbilang = App.terbilang($(e.currentTarget).val());
        $('#input-terbilang').html(terbilang + " Rupiah");
      });
      $('#form-pembayaran-pendaftaran').on('click', '.bt-bayar', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let kodejenistransaksi = 'TDFT';
        let kakundebit = $('#input-kakundebit').val();
        let kakunkredit = $('#input-kakunkredit').val();
        let nominal = $('#input-nominal').val();
        let nrm = $('#input-nrm').attr('data-nrm');
        let prodi = $('input[name="input-prodi"]:checked').val();
        let keterangan = $('#input-keterangan').val();
        let username = 'admin'; // TODO: replace!
        let postdata = {
          kodejenistransaksi: kodejenistransaksi,
          kakundebit: kakundebit,
          kakunkredit: kakunkredit,
          nominal: nominal,
          nrm: nrm,
          prodi: prodi,
          keterangan: keterangan,
          username: username
        }; // console.log(postdata);
        if (!prodi) {
          (new CoreInfo('Pembayaran biaya pendaftaran mahasiswa ini tidak dapat dicatat. Informasi program studi mahasiswa ini belum diset.')).show();
          return;
        }
        let nama = $('#input-nama').val();
        (new CoreConfirm(`Catat pembayaran pendaftaran mahasiswa: ${nama}`)).positive((e) => {
          this.ajax.post('m/x/wmon/transaksiApi/catatTransaksiPembayaranPendaftaranMahasiswa'
            , postdata).then(result => { // console.log(result);
            $('#form-pembayaran-pendaftaran .bt-print-kuitansi').attr('data-no', result.no).show();
            (new CoreInfo('Pembayaran biaya pendaftaran mahasiswa telah dicatat.')).show();
          }, error => { // console.log(CoreError);
            (new CoreError('Pembayaran biaya pendaftaran mahasiswa telah dicatat sebelumnya. Untuk mencetak kuitansi pembayaran, silakan klik tombol: <br><span class="text-primary">[<i class="bi bi-printer"></i> Cetak Bukti Pembayaran]</span>')).show();
          });
        }).show();

      });
      $('#form-pembayaran-pendaftaran').on('click', '.bt-print-kuitansi', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let nrm = $('#input-nrm').attr('data-nrm');
        let no = $(e.currentTarget).attr('data-no');
        let location = (Core.configuration.get('baseurl') + `m/x/wadm/print/kuitansipendaftaranmahasiswa/${nrm}/${no}`);
        (new CoreConfirm('Cetak kuitansi?')).positive(() => {
          window.open(location, '_blank');
        }).show();
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
      // var today = new Date(date.getFullYear()-17, date.getMonth(), date.getDate());
      // $('#input-tglahir').datepicker('setDate', today);
      let nrm = $('#input-nrm').attr('data-nrm');
      Promise.all([
        this.ajax.get('m/x/wadm/generalApi/listAgama'),
        this.ajax.get(`m/x/wadm/studentApi/getMahasiswa/${nrm}`),
        this.ajax.get('m/x/wadm/generalApi/listPropinsi')
      ]).then(results => {
        let agamas = results[0];
        let mahasiswa = results[1];
        let propinsis = results[2];
        App.populatePropinsi(propinsis);
        App.populateAgama(agamas);
        App.populateForm(mahasiswa);
      });
      let kodeJenisTransaksi = 'TDFT';
      let postdata = {
        kodejenistransaksi: kodeJenisTransaksi,
        nrm: nrm
      }; // console.log(postdata)
      Promise.all([
        this.ajax.get(`m/x/wmon/transaksiApi/getAkunDebitJenisTransaksi/${kodeJenisTransaksi}`),
        this.ajax.get(`m/x/wmon/transaksiApi/getAkunKreditJenisTransaksi/${kodeJenisTransaksi}`),
        this.ajax.post(`m/x/wmon/transaksiApi/getAllTransaksiPembayaranMahasiswa`, postdata)
      ]).then(result => { // console.log(result);
        App.showAkunDebits(result[0]);
        App.showAkunKredits(result[1]);
        let transaksi = result[2]? result[2] : null;
        if (transaksi) {
          $('#input-kakundebit').val(transaksi.kodeakundebit).trigger('change');
          $('#input-kakunkredit').val(transaksi.kodeakunkredit).trigger('change');
          $('#input-keterangan').val(transaksi.keterangan);
          $('#input-nominal').val(transaksi.nominal).trigger("keyup");
          $('.container-action-transaksi .bt-print-kuitansi').attr('data-no', transaksi.no).show();
        } else $('.container-action-transaksi .bt-print-kuitansi').removeAttr('data-no').hide();
      });
      $('#form-program fieldset').removeAttr('disabled');
      $('#form-program .bt-update').removeClass('disabled');
      $('#form-program').get(0).classList.add('was-validated');
      if($('#form-program').get(0).checkValidity()) {
        $('#form-program fieldset').attr('disabled', true);
        $('#form-program .bt-update').addClass('disabled', true);
      }
    }

  }

  App.populateAgama = (agamas) => {
    let html = '';
    agamas.forEach(agama => html += `<option value="${agama.kdagama}">${agama.agama}</option>`);
    $('#input-kdagama').html(html);
  }
  App.populateForm = (mahasiswa) => {

    // form-identitas-diri

    $('#input-nama').val(mahasiswa.namam);
    $('#input-tplahir').val(mahasiswa.tplahir);

    if (mahasiswa.tglahir) {
      var tgl = mahasiswa.tglahir.split("-");
      var tglahir = new Date(tgl[0], tgl[1]-1, tgl[2]);
      $('#input-tglahir').datepicker('setDate', tglahir);
    }

    $(`input[name="input-goldarah"][value="${mahasiswa.goldarah}"]`).prop('checked', true);
    $(`select[name="input-kdagama"]`).val(mahasiswa.kdagama).trigger('select');
    $(`input[name="input-statnikah"][value="${mahasiswa.statnikah}"]`).prop('checked', true);
    $('#input-nikpaspor').val(mahasiswa.nikpaspor);
    $('#input-telp').val(mahasiswa.telp);

    // form-program
    // let group = angkatan + kodeProgramStudi + paket + kodeAsalSekolah + semester + "";
    let angkatan = mahasiswa.nrm.substring(0,4);
    // let prodi = parseInt(mahasiswa.nrm.substring(4,5));
    let paket = parseInt(mahasiswa.nrm.substring(5,6));
    let tingkatasal = parseInt(mahasiswa.nrm.substring(6,7));
    let semester = parseInt(mahasiswa.nrm.substring(7,8));
    // console.log(angkatan, prodi, paket, tingkatasal, semester, mahasiswa.gelombang, mahasiswa.status)
    $('#input-angkatan').val(angkatan);
    $(`input[name="input-prodi"][value="${mahasiswa.prodi}"]`).prop('checked', true);
    $(`select[name="input-paket"]`).val(paket).trigger('select');
    $(`input[name="input-tingkatasal"][value="${tingkatasal}"]`).prop('checked', true);
    $(`input[name="input-semester"][value="${semester}"]`).prop('checked', true);
    $(`select[name="input-gelombang"]`).val(parseInt(mahasiswa.gelombang)).trigger('select');
    $(`select[name="input-status"]`).val(parseInt(mahasiswa.status)).trigger('select');
  
    // form-alamat
    $('#input-alamatasal').val(mahasiswa.alamatasal);
    $('#input-propasal').val(mahasiswa.propasal).trigger('change');
    $('#input-kotaasal').val(mahasiswa.kotaasal).trigger('change');
    $('#input-alamat').val(mahasiswa.alamat);
    $('#input-prop').val(mahasiswa.prop).trigger('change');
    $('#input-kota').val(mahasiswa.kota).trigger('change');

    // form-sekolah-asal
    $('#input-asalsekolah').val(mahasiswa.asalsekolah);
    $('#input-jurusan').val(mahasiswa.jurusan);
    $('#input-thlulus').val(mahasiswa.thlulus);
    $('#input-propsekolah').val(mahasiswa.propsekolah).trigger('change');
    $('#input-kotasekolah').val(mahasiswa.kotasekolah).trigger('change');

    // form-ortu
    $('#input-namaortu').val(mahasiswa.namaortu);
    $('#input-pekerjaanortu').val(mahasiswa.pekerjaanortu);
    $('#input-telportu').val(mahasiswa.telportu);
    $('#input-alamatortu').val(mahasiswa.alamatortu);
  }
  App.populatePropinsi = (propinsis) => { // console.log(propinsis);
    let html = '';
    propinsis.forEach(propinsi => html += `<option value="${propinsi.propinsi_id}">${propinsi.propinsi}</option>`);
    $('#input-prop').html(html).val('15').trigger('change');
    $('#input-propasal').html(html).val('').trigger('change');
    $('#input-propsekolah').html(html).val('').trigger('change');
  }
  App.populateKotaKabupaten = (selector, kotakabs) => {
    let html = '';
    kotakabs.forEach(kotakab => html += `<option value="${kotakab.kota_id}">${kotakab.kota_kabupaten}</option>`);
    $(selector).html(html);
    if (selector == '#input-kota')
      $('#input-kota').val(34).trigger('change');
  };
  App.showAkunDebits = (akunDebits) => {
    let listHtml = '';
    akunDebits.forEach(akunDebit => {
      listHtml += `<option value="${akunDebit.kode}">${akunDebit.nama}</option>`;
    });
    $('#input-kakundebit').html(listHtml);
  }
  App.showAkunKredits = (akunKredits) => {
    let listHtml = '';
    akunKredits.forEach(akunKredit => {
      listHtml += `<option value="${akunKredit.kode}">${akunKredit.nama}</option>`;
    });
    $('#input-kakunkredit').html(listHtml);
  }
  App.terbilang = (nominal) => {
    nominal = parseInt(nominal);
    let bilangan = ["", "Satu", "Dua", "Tiga", "Empat",
                    "Lima", "Enam", "Tujuh", "Delapan",
                    "Sembilan", "Sepuluh", "Sebelas"];
    if (nominal <= 0) return "";
    if (nominal < 12) return bilangan[nominal] + " ";
    else if (nominal < 20) return App.terbilang(nominal - 10) + "Belas ";
    else if (nominal < 100) return App.terbilang((nominal / 10)) + "Puluh " + App.terbilang(nominal % 10);
    else if (nominal < 200) return "Seratus " + App.terbilang(nominal - 100);
    else if (nominal < 1000) return App.terbilang((nominal / 100)) + "Ratus " + App.terbilang(nominal % 100);
    else if (nominal < 2000) return "Seribu " + App.terbilang(nominal - 1000);
    else if (nominal < 1000000) return App.terbilang((nominal / 1000)) + "Ribu " + App.terbilang(nominal % 1000);
    else if (nominal < 1000000000) return App.terbilang((nominal / 1000000)) + "Juta " + App.terbilang(nominal % 1000000);
    else if (nominal < 1000000000000) return App.terbilang((nominal / 1000000000)) + "Milyar " + App.terbilang(nominal % 1000000000);
    else return "";
  }

  new App();

});