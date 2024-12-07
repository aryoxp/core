<?php

class WmonPrintController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function laporanpembayaranmahasiswa($tanggal) {
    $this->ui->useStyle('css/print.css');
    $service = new LaporanService();
    $laporan = $service->getLaporanPembayaranMahasiswa($tanggal, 1, 1000, "ASC");
    $this->ui->useScript('js/laporan-pembayaran-mahasiswa.js');
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->view('print-laporan-pembayaran-mahasiswa.php', 
      ['laporan' => $laporan, 'tanggal' => $tanggal]
    );
  }
    public function laporanpengeluarankerumahtanggaan($tanggal) {
    $this->ui->useStyle('css/print.css');
    $service = new LaporanService();
    $laporan = $service->getLaporanPengeluaranKerumahtanggaan($tanggal, 1, 1000, "ASC");
    $this->ui->useScript('js/laporan-pengeluaran-kerumahtanggaan.js');
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->view('print-laporan-pengeluaran-kerumahtanggaan.php', 
      ['laporan' => $laporan, 'tanggal' => $tanggal]
    );
  }
  public function kuitansipembayaranmahasiswa() {
    $this->ui->useStyle('css/print.css');
    $nos = $this->postv('nos');
    $nrm = $this->postv('nrm');
    $service = new TransaksiService();
    $transaksis = $service->getSelectiveCatatanPembayaranMahasiswa($nos);
    $service = new MahasiswaService();
    $mahasiswa = $service->getMahasiswa($nrm);
    $this->ui->useScript('js/kuitansi-pembayaran-mahasiswa.js');
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->view('print-kuitansi-pembayaran-mahasiswa.php', 
      ['transaksis' => $transaksis, 'mahasiswa' => $mahasiswa]
    );
  }
  public function jurnalkaskecil() {
    $data['bulan'] = $this->postv('bulan');
    $data['tahun'] = $this->postv('tahun');
    $data['col'] = $this->postv('col');
    $data['order'] = $this->postv('order');
    $service = new LaporanService();
    $result = $service->getJurnalKasKecil($data['bulan'], $data['tahun'], $data['col'], $data['order']);
    $data['transaksis'] = $result->transaksi;

    // Begin MPDF
    require_once('.shared/lib/mpdf/autoload.php');
    $html = $this->ui->view('print-jurnal-kas-kecil.php', $data, CoreView::RETURN);
    $defaultConfig = (new Mpdf\Config\ConfigVariables())->getDefaults();
    $fontDirs = $defaultConfig['fontDir'];
    $defaultFontConfig = (new Mpdf\Config\FontVariables())->getDefaults();
    $fontData = $defaultFontConfig['fontdata'];
    $mpdf = new \Mpdf\Mpdf([
      'fontDir' => array_merge($fontDirs, [
        CORE_ROOT_PATH . '.shared/font',
      ]),
      'orientation' => 'L',
      'fontdata' => $fontData + [ // lowercase letters only in font key
        'firasanscondensed' => [
          'R' => 'FiraSansCondensed-Regular.ttf',
          'I' => 'FiraSansCondensed-Italic.ttf',
          'B' => 'FiraSansCondensed-Bold.ttf',
          'BI' => 'FiraSansCondensed-BoldItalic.ttf',
          'T' => 'FiraSansCondensed-Thin.ttf',
          'TI' => 'FiraSansCondensed-ThinItalic.ttf',
        ],
        'firasans' => [
          'R' => 'FiraSans-Regular.ttf',
          'I' => 'FiraSans-Italic.ttf',
          'B' => 'FiraSans-Bold.ttf',
          'BI' => 'FiraSans-BoldItalic.ttf',
          'T' => 'FiraSans-Thin.ttf',
          'TI' => 'FiraSans-ThinItalic.ttf',
        ]
      ],
      'default_font' => 'firasanscondensed',
      'shrink_tables_to_fit' => 1,
    ]);
    $css = file_get_contents('kv-mpdf-bootstrap.min.css');
    $mpdf->defaultheaderline = 0;
    $mpdf->defaultfooterline = 0;
    $mpdf->setFooter('<div class="text-primary" style="font-family:firasanscondensed;font-style:normal;font-weight:normal">Halaman {PAGENO}/{nb}</div>');
    $mpdf->WriteHTML($css,1);
    $mpdf->WriteHTML($html,2);
    $mpdf->Output();
  }
  public function test() {
    require_once('.shared/lib/mpdf/autoload.php');
    // $html = $this->ui->view('test.php', null, CoreView::RETURN);
    echo CORE_ROOT_PATH . '.shared/font';
    // echo $html; return;
    // $mpdf = new \Mpdf\Mpdf();
    $defaultConfig = (new Mpdf\Config\ConfigVariables())->getDefaults();
    $fontDirs = $defaultConfig['fontDir'];

    $defaultFontConfig = (new Mpdf\Config\FontVariables())->getDefaults();
    $fontData = $defaultFontConfig['fontdata'];

    // $mpdf = new \Mpdf\Mpdf([
    //   'fontDir' => array_merge($fontDirs, [
    //     CORE_ROOT_PATH . '.shared/font',
    //   ]),
    //   'fontdata' => $fontData + [ // lowercase letters only in font key
    //     'firasanscondensed' => [
    //       'R' => 'FiraSansCondensed-Regular.ttf',
    //       'I' => 'FiraSansCondensed-Italic.ttf',
    //       'B' => 'FiraSansCondensed-Bold.ttf',
    //       'BI' => 'FiraSansCondensed-BoldItalic.ttf',
    //       'T' => 'FiraSansCondensed-Thin.ttf',
    //       'TI' => 'FiraSansCondensed-ThinItalic.ttf',
    //     ]
    //   ],
    //   'default_font' => 'firasanscondensed'
    // ]);
    // $mpdf->setFooter('Halaman {PAGENO}/{nb}');
    // $mpdf->WriteHTML($html);
    // $mpdf->Output();

    $mpdf = new \Mpdf\Mpdf();

    // $mpdf->useOddEven = 1;
    
    $html = '
    <style>
        @page {
            size: auto;
            odd-header-name: html_myHeader1;
            even-header-name: html_myHeader2;
            odd-footer-name: html_myFooter1;
            even-footer-name: html_myFooter2;
        }
        @page chapter2 {
            odd-header-name: html_Chapter2HeaderOdd;
            even-header-name: html_Chapter2HeaderEven;
            odd-footer-name: html_Chapter2FooterOdd;
            even-footer-name: html_Chapter2FooterEven;
        }
        @page noheader {
            odd-header-name: _blank;
            even-header-name: _blank;
            odd-footer-name: _blank;
            even-footer-name: _blank;
        }
        div.chapter2 {
            page-break-before: right;
            page: chapter2;
        }
        div.noheader {
            page-break-before: right;
            page: noheader;
        }
    </style>
    
        <htmlpageheader name="myHeader1" style="display:none">
            <div style="text-align: right; border-bottom: 1px solid #000000; font-weight: bold; font-size: 10pt;">
                My document
            </div>
        </htmlpageheader>
    
        <htmlpageheader name="myHeader2" style="display:none">
            <div style="border-bottom: 1px solid #000000; font-weight: bold;  font-size: 10pt;">
                My document
            </div>
        </htmlpageheader>
    
        <htmlpagefooter name="myFooter1" style="display:none">
            <table width="100%">
                <tr>
                    <td width="33%">
                        <span style="font-weight: bold; font-style: italic;">{DATE j-m-Y}</span>
                    </td>
                    <td width="33%" align="center" style="font-weight: bold; font-style: italic;">
                        {PAGENO}/{nbpg}
                    </td>
                    <td width="33%" style="text-align: right;">
                        My document
                    </td>
                </tr>
            </table>
        </htmlpagefooter>
    
        <htmlpagefooter name="myFooter2" style="display:none">
            <table width="100%">
                <tr>
                    <td width="33%">My document</td>
                    <td width="33%" align="center">{PAGENO}/{nbpg}</td>
                    <td width="33%" style="text-align: right;">{DATE j-m-Y}</td>
                </tr>
            </table>
        </htmlpagefooter>
    
        <htmlpageheader name="Chapter2HeaderOdd" style="display:none">
            <div style="text-align: right;">Chapter 2</div>
        </htmlpageheader>
    
        <htmlpageheader name="Chapter2HeaderEven" style="display:none">
            <div>Chapter 2</div>
        </htmlpageheader>
    
        <htmlpagefooter name="Chapter2FooterOdd" style="display:none">
            <div style="text-align: right;">Chapter 2 Footer</div>
        </htmlpagefooter>
    
        <htmlpagefooter name="Chapter2FooterEven" style="display:none">
            <div>Chapter 2 Footer</div>
        </htmlpagefooter>
    
        Hello World
    
        <div class="chapter2">Text of Chapter 2</div>
    
        <div class="noheader">No-Header page</div>
    ';
    
    $mpdf->WriteHTML($html);
    
    $mpdf->Output();

  }

}