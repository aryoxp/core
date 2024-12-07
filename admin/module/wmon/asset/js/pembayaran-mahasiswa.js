$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      this.location = Core.configuration.get('baseurl');
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
            prodi += `<a class="btn btn-danger text-light btn-sm p-2 py-1 my-2" href="${this.location}m/x/wadm/student/editbio/${mahasiswa.nrm}">`
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
        App.getCatatanPembayaranMahasiswa(nrm);
        App.getRekapitulasiPembayaranMahasiswa(nrm);
        $(".mahasiswa-item:last-child").get(0).scrollIntoView({behavior: 'smooth'});

      });
      $('#riwayat-pembayaran').on('click', '.bt-refresh', (e) => {
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        if (!nrm) {
          (new CoreInfo('Mahasiswa belum dipilih.')).show();
          return;
        }
        App.getCatatanPembayaranMahasiswa(nrm);
      });
      $('#riwayat-pembayaran').on('click', '.bt-print-kuitansi', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        $('input[name="nrm"]').val(nrm);
        if (!nrm) {
          (new CoreInfo('Mahasiswa belum dipilih.')).show();
          return;
        }
        // let nos = [];
        // $('#transaksi-list input.cb-transaksi:checked').each((i, cb) => {
        //   // console.log(cb);
        //   nos.push($(cb).attr('data-no'));
        // })
        // console.log(nrm, nos);
        // let postdata = {
        //   nrm: nrm,
        //   nos: nos
        // };
        // let location = (Core.configuration.get('baseurl') + `m/x/wmon/print/kuitansipembayaranmahasiswa`);
        (new CoreConfirm('Cetak kuitansi untuk transaksi yang dipilih?'))
          .positive(() => {
            // window.open(location, '_blank');
            $('form#riwayat-pembayaran').trigger('submit');
          }).show();
      });
      $('#rekapitulasi-pembayaran').on('click', '.bt-refresh', (e) => {
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        if (!nrm) {
          (new CoreInfo('Mahasiswa belum dipilih.')).show();
          return;
        }
        App.getRekapitulasiPembayaranMahasiswa(nrm);
      });
      $('#transaksi-list').on('click', '.bt-delete', (e) => {
        let no = $(e.currentTarget).parents('.transaksi-item').attr('data-no');
        let row = $(e.currentTarget).parents('.transaksi-item');
        (new CoreConfirm(`<span class="text-danger">HAPUS</span> transaksi <span class="text-danger">${no}</span> yang dipilih? Catatan transaksi akan dihapus secara <span class="text-danger">PERMANEN<span>.`)
          .title('<span class="text-danger">DELETE</span>')).positive((e) => {
            this.ajax.post(`m/x/wmon/transaksiApi/deleteTransaksi`,{
              no: no
            }).then(result => { // console.log(result);
              row.fadeOut('fast', () => row.remove());
              App.getCatatanPembayaranMahasiswa(nrm);
              App.getRekapitulasiPembayaranMahasiswa(nrm);
            });
          }).show();
      });
      $('#input-nominal').on("keypress", (e) => {
        if (isNaN(e.key)) e.preventDefault();
      }).on('keyup', e => {
        let terbilang = App.terbilang($(e.currentTarget).val());
        $('#input-terbilang').html(terbilang + " Rupiah");
      });
      $('#form-pembayaran').on('click', '.bt-bayar', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log($(e.currentTarget).parents('form').get(0));
        $(e.currentTarget).parents('form').get(0).classList.add('was-validated');
        let kodejenistransaksi = 'TMHS';
        let nrm = $('#selected-mahasiswa').attr('data-nrm');
        let prodi = $('#selected-mahasiswa').attr('data-prodi');
        let nama = $('#selected-mahasiswa').attr('data-nama');
        let nominal = $('#input-nominal').val();
        let kakundebit = $('#input-kakundebit').val();
        let kakunkredit = $('#input-kakunkredit').val();
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
        let akunkredit = $('#input-kakunkredit option:selected').html();
        if (!nrm) {
          (new CoreInfo(`Mahasiswa belum ditentukan.`)).show();
          return;
        }
        if (!prodi) {
          (new CoreInfo(`Pembayaran <span class="text-danger">${akunkredit}</span> tidak dapat dicatat. Informasi program studi mahasiswa belum diset.`))
            .title('<span class="text-danger">Error</span>').show();
          return;
        }
        
        (new CoreConfirm(`Catat pembayaran <span class="text-danger">${akunkredit}</span> atas nama mahasiswa: <span class="text-danger">${nama}</span>?`)).positive((e) => {
          this.ajax.post('m/x/wmon/transaksiApi/catatTransaksiPembayaranMahasiswa'
            , postdata).then(result => { // console.log(result);
            // $('#form-pembayaran .bt-print-kuitansi').attr('data-no', result.no).show();
            App.getCatatanPembayaranMahasiswa(nrm);
            App.getRekapitulasiPembayaranMahasiswa(nrm);
            $('#input-keterangan').val('');
            $('#input-nominal').val('').trigger('change');
            $('#input-terbilang').html('');
            (new CoreInfo(`Pembayaran <span class="text-danger">${akunkredit}</span> telah dicatat.`)).show();
          }, error => (new CoreError(error)).show());
        }).show();
      });
    }

    onLoad() {
      let kodeJenisTransaksi = 'TMHS';
      Promise.all([
        this.ajax.get(`m/x/wmon/transaksiApi/getAkunDebitJenisTransaksi/${kodeJenisTransaksi}`),
        this.ajax.get(`m/x/wmon/transaksiApi/getAkunKreditJenisTransaksi/${kodeJenisTransaksi}`),
      ]).then(result => { // console.log(result);
        App.showAkunDebits(result[0]);
        App.showAkunKredits(result[1]);
      });
    }

  }

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
  App.getCatatanPembayaranMahasiswa = (nrm) => {
    App.ajax.post('m/x/wmon/transaksiApi/getCatatanPembayaranMahasiswa', {
      nrm: nrm
    }).then(transaksis => {
      let html = '';
      transaksis.forEach(transaksi => { // console.log(transaksi);
        html += `<div class="transaksi-item list-item d-flex justify-content-between py-1 px-2 border-bottom align-items-center" data-no="${transaksi.no}">`
        html += `<span class="d-flex align-items-center text-nowrap text-truncate" title="${transaksi.keterangan}">`
        html += `<input name="nos[]" type="checkbox" class="cb-transaksi form-check-input m-0 mx-2" data-no="${transaksi.no}" value="${transaksi.no}">`
        html += `${transaksi.tanggal} ${transaksi.jam} `
        html += `<span class="text-primary mx-2">${transaksi.pembayaran}</span> ` 
        html += `<span class="text-danger me-2">${transaksi.nominal.replace(/,/g, '.')}</span> `
        html += `<span class="badge rounded border-1 bg-warning text-dark ms-2">${transaksi.kas}</span>`
        html += `<span class="badge rounded border-1 bg-secondary text-light ms-2">${transaksi.no}</span>`
        html += `</span>`;
        html += `<span class="btn btn-sm p-2 py-1 ms-2 btn-danger text-light bt-delete text-nowrap"><i class="bi bi-x-lg"></i></span>`
        html += `</div>`;
      })
      $('#transaksi-list').html(html);
    });
  }
  App.getRekapitulasiPembayaranMahasiswa = (nrm) => {
    App.ajax.post('m/x/wmon/transaksiApi/getRekapitulasiPembayaranMahasiswa', {
      nrm: nrm
    }).then(rekaps => { // console.log(rekaps);
      let html = '';
      rekaps.forEach(rekap => { // console.log(rekap);
        html += `<div class="rekap-item list-item d-flex justify-content-between py-1 px-2 border-bottom align-items-center">`
        html += `<span class="d-flex align-items-center text-nowrap text-truncate">`
        html += `<span class="text-primary mx-2">${rekap.pembayaran}</span> ` 
        html += `<span class="text-danger me-2">${rekap.jumlah.replace(/,/g, '.')}</span> `
        html += rekap.kewajiban ? `<span class="badge rounded border-1 bg-warning text-dark ms-2">Kewajiban: ${rekap.kewajiban.replace(/,/g, '.')}</span>` : '';
        html += rekap.sisa ? `<span class="badge rounded border-1 bg-secondary text-light ms-2">Sisa: ${rekap.sisa.replace(/,/g, '.')}</span>` : '';
        html += `</span>`;
        html += `</div>`;
      })
      $('#rekap-list').html(html);
    });
  }
  App.format = (amount) => {
    amount = "Rp " + amount.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.');
    if(amount.indexOf('.') === -1) return amount;// return amount + '.00';
    var decimals = amount.split('.')[1];
    return decimals.length < 2 ? amount + '0' : amount;
  };
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