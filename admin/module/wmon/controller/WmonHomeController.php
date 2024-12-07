<?php

class WmonHomeController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }
  
  public function index() {
    $this->menuId('wmon-dashboard');
    $this->ui->usePlugin('general-ui');
    $this->ui->useScript('js/dashboard.js');
    $this->ui->view('dashboard.php', null, CoreModuleView::MODULE);
  }
  
  public function test() {
    require_once('.shared/lib/mpdf/autoload.php');
    $html = $this->ui->view('test.php', null, CoreView::RETURN);
    echo CORE_ROOT_PATH . '.shared/font';
    // echo $html; return;
    // $mpdf = new \Mpdf\Mpdf();
    $defaultConfig = (new Mpdf\Config\ConfigVariables())->getDefaults();
    $fontDirs = $defaultConfig['fontDir'];

    $defaultFontConfig = (new Mpdf\Config\FontVariables())->getDefaults();
    $fontData = $defaultFontConfig['fontdata'];

    $mpdf = new \Mpdf\Mpdf([
      'fontDir' => array_merge($fontDirs, [
        CORE_ROOT_PATH . '.shared/font',
      ]),
      'fontdata' => $fontData + [ // lowercase letters only in font key
        'firasanscondensed' => [
          'R' => 'FiraSansCondensed-Regular.ttf',
          'I' => 'FiraSansCondensed-Italic.ttf',
          'B' => 'FiraSansCondensed-Bold.ttf',
          'BI' => 'FiraSansCondensed-BoldItalic.ttf',
          'T' => 'FiraSansCondensed-Thin.ttf',
          'TI' => 'FiraSansCondensed-ThinItalic.ttf',
        ]
      ],
      'default_font' => 'firasanscondensed'
    ]);
    $mpdf->WriteHTML($html);
    $mpdf->Output();
  }
}