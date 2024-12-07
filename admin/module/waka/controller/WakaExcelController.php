<?php

class WakaExcelController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function nilaikelas() {
    try {
      $data = json_decode(file_get_contents('php://input')); // var_dump($data);
      $service = new KelasService();
      $result = $service->getNilaiKelas($data->tahun, $data->semester, $data->kdmk, $data->kurikulum, $data->nama);

      $tahun = $data->tahun;
      $semester = $data->semester;
      $kdmk = $data->kdmk;
      $kurikulum = $data->kurikulum;
      $nama = $data->nama;

      // Begin PHPSpreadsheet
      require_once('.shared/lib/phpspreadsheet/autoload.php');

      $html = '<table><tr><td>NRM</td><td>NIM</td><td>Nama</td>';
      $html .= '<td>Tugas</td><td>Quiz</td><td>UTS</td><td>UAS</td>';
      $html .= '<td>Nilai Angka</td><td>Nilai Huruf</td></tr>';
      foreach($result as $n) {
        $html .= '<tr>';
        $html .= '<td>'.$n->nrm.'</td><td>'.$n->nim.'</td><td>'.$n->namam.'</td>';
        $html .= '<td></td><td></td><td></td><td></td>';
        $html .= '<td></td><td>'.$n->nilai.'</td>';
        $html .= '</tr>';
      }
      $html .= '</table>';
      // echo $html; return;

      $reader = new \PhpOffice\PhpSpreadsheet\Reader\Html();
      $spreadsheet = $reader->loadFromString($html);
      $sheet = $spreadsheet->getActiveSheet();
      foreach ($sheet->getColumnIterator() as $column) {
        $sheet->getColumnDimension($column->getColumnIndex())->setAutoSize(true);
      }
      $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');
      header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      header('Content-Disposition: attachment; filename="'. urlencode("nilai-".$tahun."-".$semester."-".$kdmk."-".$kurikulum."-".$nama).'.xlsx');
      $writer->save('php://output');
      exit;
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function uploadnilaikelas() {

    try {
      $filename = $_FILES['file']['name'];
      $filesize = $_FILES['file']['size'];
      // Begin PHPSpreadsheet
      require_once('.shared/lib/phpspreadsheet/autoload.php');
      $inputFileName = $_FILES['file']['tmp_name'];
      $inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify($inputFileName);
      $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
      $spreadsheet = $reader->load($inputFileName);
      $worksheet = $spreadsheet->getActiveSheet();
      $rows = $worksheet->toArray();
      // var_dump($rows);
      CoreResult::instance($rows)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

}