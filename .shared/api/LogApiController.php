<?php

defined('CORE') or (header($_SERVER["SERVER_PROTOCOL"] . " 403 Forbidden") and die('403.14 - Access denied.'));
defined('CORE') or die();

class LogApiController extends CoreApi {

  function log() {

    $tstampc  = $this->postv('tstampc');
    $userid   = $this->postv('userid');
    $cmid     = $this->postv('cmid');
    $kid      = $this->postv('kid');
    $sessid   = $this->postv('sessid');
    $action   = $this->postv('action');
    $canvasid = $this->postv('canvasid');
    $seq      = $this->postv('seq');
    $data     = $this->postv('data');
    $canvas   = $this->postv('canvas');
    $compare  = $this->postv('compare');
    
    $logService = new LogService();
    $lid = $logService->log(
      $tstampc, $userid, $cmid, $kid, $sessid, $action, $canvasid, $seq,
      $data, $canvas, $compare
    );

    // if ($cmid) {
    //   $lcmap = $logService->logCmap($lid, $cmid);
    //   // var_dump($action, $lcmap, $flag == 'cmap', $flag); exit;
    //   if ($flag == 'cmap' && $lcmap) {
    //     $concept     = $this->postv('concept');
    //     $link        = $this->postv('link');
    //     $edge        = $this->postv('edge');
    //     $map         = $this->postv('map');
    //     $proposition = $this->postv('proposition');
    //     $nc          = $this->postv('nc');
    //     $nl          = $this->postv('nl');
    //     $ne          = $this->postv('ne');
    //     $np          = $this->postv('np');
    //     $result = $logService->logCmapState($lid, $concept, $link, $edge, $map, $proposition, $nc, $nl, $ne, $np);
    //   }
    // }

    // if ($lmid = $this->postv('lmid')) {
    //   $lkb = $logService->logKitBuild($lid, $lmid);
    //   if ($flag == 'kitbuild' && $lkb) {
    //     $edge        = $this->postv('edge');
    //     $map         = $this->postv('map');
    //     $proposition = $this->postv('proposition');
    //     $compare     = $this->postv('compare');
    //     $ne          = $this->postv('ne');
    //     $np          = $this->postv('np');  
    //     $result = $logService->logKitBuildState($lid, $edge, $map, $proposition, $compare, $ne, $np);
    //   }
    // }

    return CoreResult::instance($lid)->show();   
  }

  function logsc() {

    $tstampc     = $this->postv('tstampc');
    $userid      = $this->postv('userid');
    $cmid        = $this->postv('cmid');
    $sessid      = $this->postv('sessid');
    $action      = $this->postv('action');
    $canvasid    = $this->postv('canvasid');
    $seq         = $this->postv('seq');
    $data        = $this->postv('data');
    $canvas      = $this->postv('canvas');
    $concept     = $this->postv('concept');
    $link        = $this->postv('link');
    $proposition = $this->postv('proposition');
    $nc          = $this->postv('nc');
    $nl          = $this->postv('nl');
    $np          = $this->postv('np');
    
    $logService = new LogService();
    $lid = $logService->logsc(
      $tstampc, $userid, $cmid, $sessid, $action, $canvasid, $seq,
      $data, $canvas, $concept, $link, $proposition, $nc, $nl, $np
    );

    return CoreResult::instance($lid)->show();   
  }

}