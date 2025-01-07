<?php

class LabBookApiController extends CoreApi {

  public function search($page = 1, $perpage=100, $sort='asc') {
    try {
      $service = new BookService();
      $keyword = $this->postv('keyword');
      $filter = $this->postv('filter');
      $result = $service->search($keyword, $filter, $page, $perpage, $sort);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function cover($file = null) {
    if (!$file) return;
    $path = CORE_ROOT_PATH . ".file/books";
    $tnpath = CORE_ROOT_PATH . "admin/files/tnbooks/";
    $tnfile = $tnpath . $file . ".jpg";
    if (!file_exists($tnpath)) mkdir($tnpath, 0777, true);

    if (file_exists($tnfile)) {
      $blob = file_get_contents($tnfile);
      header('content-type:image/jpg');
      echo $blob;
      return;
    }

    require_once('.shared/lib/mpdf/autoload.php');

    $sourceFilePath = $path . "/" . $file;
    $mpdfConfig = [];

    $mpdf = new \Mpdf\Mpdf($mpdfConfig);
    $mpdf->setSourceFile($sourceFilePath); 
    $tplId = $mpdf->importPage(1);
    $arrSize = $mpdf->getTemplateSize($tplId);    
    $mpdf = new \Mpdf\Mpdf(['mode' => 'utf-8', 'format' => $arrSize]);
    $mpdf->setSourceFile($sourceFilePath); 
    $tplId = $mpdf->importPage(1);
    $mpdf->useTemplate($tplId);

    $imagick = new Imagick();
    $imagick->readImageBlob($mpdf->OutputBinaryData());
    $imagick->setImageBackgroundColor('#ffffff');
    $imagick->setImageAlphaChannel(Imagick::ALPHACHANNEL_REMOVE);
    $imagick = $imagick->mergeImageLayers(Imagick::LAYERMETHOD_FLATTEN);
    $imagick->setImageFormat('jpeg');
    $imagick->resizeImage(250, 0, 0, 0, 0);

    
    $blob = $imagick->getImageBlob();

    $fileHandle = fopen($tnfile, "w");
    fwrite($fileHandle, $blob);
    fclose($fileHandle);

    header('content-type:image/jpg');
    echo $blob;
    return;
  }
  public function open($bookHash = null) {
    if (!UAC::isSignedIn()) return;
    if (!$bookHash) return;
    $book = urldecode(base64_decode($bookHash));
    $path = "../.file/books/" . $book;
    if (!file_exists($path)) return;
    $fp = fopen($path, "r");
    $raw = fread($fp, filesize($path));
    fclose($fp);
    header("content-type:application/pdf");
    echo $raw;
    return;
  }

}
