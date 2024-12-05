<?php

class LogService extends CoreService {
  function log($tstampc, $userid, $cmid, $kid, $sessid, $action, $canvasid, $seq,
      $data, $canvas, $compare, $nmatch, $nexcess, $nmiss) {
    try {
      $log             = [];
      $log['tstampc']  = QB::esc($tstampc);
      $log['userid']   = QB::esc($userid);
      $log['cmid']     = QB::esc($cmid);
      $log['kid']      = QB::esc($kid);
      $log['sessid']   = QB::esc($sessid);
      $log['action']   = QB::esc($action);
      $log['canvasid'] = QB::esc($canvasid);
      $log['seq']      = QB::esc($seq);
      $log['data']     = QB::esc($data);
      $log['canvas']   = QB::esc($canvas);
      $log['compare']  = QB::esc($compare);
      $log['nma']      = QB::esc($nmatch);
      $log['nex']      = QB::esc($nexcess);
      $log['nmi']      = QB::esc($nmiss);
      $db = self::instance();
      $qb = QB::instance('log')->insert($log);
      $result = $db->query($qb->get());
      $lid = $db->getInsertId();
      return $lid;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    } 
  }

  function logsc($tstampc, $userid, $cmid, $sessid, $action, $canvasid, $seq,
      $data, $canvas, $concept, $link, $proposition, $nc, $nl, $np) {
    try {
      $log                = [];
      $log['tstampc']     = QB::esc($tstampc);
      $log['userid']      = QB::esc($userid);
      $log['cmid']        = QB::esc($cmid);
      $log['sessid']      = QB::esc($sessid);
      $log['action']      = QB::esc($action);
      $log['canvasid']    = QB::esc($canvasid);
      $log['seq']         = QB::esc($seq);
      $log['data']        = QB::esc($data);
      $log['canvas']      = QB::esc($canvas);
      $log['concept']     = QB::esc($concept);
      $log['link']        = QB::esc($link);
      $log['proposition'] = QB::esc($proposition);
      $log['nc']          = QB::esc($nc);
      $log['nl']          = QB::esc($nl);
      $log['np']          = QB::esc($np);
      $db = self::instance();
      $qb = QB::instance('logsc')->insert($log);
      $result = $db->query($qb->get());
      $lid = $db->getInsertId();
      return $lid;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    } 
  }

  function extractCompareCount() {
    try {
      set_time_limit(30000);
      $db = self::instance('kblog');
      $qb = QB::instance('log')->select('id', 'compare')->where('compare', 'IS NOT', QB::raw(QB::NULL));
      // echo $qb->get();
      $logs = $db->query($qb->get());
      // var_dump($logs);
      foreach($logs as $log) {
        $lid = $log->id;
        $c = CoreApi::decompress($log->compare);
        $c = json_decode($c);
        $update['nma'] = count($c->match);
        $update['nex'] = count($c->excess);
        $update['nmi'] = count($c->miss);
        $qb = QB::instance('log')->update($update)->where('id', $lid);
        $db->query($qb->get());
        echo "-";
        // var_dump($c);
        // unset($c);
      }
      // $qb = QB::instance('log')->insert($log);
      // $result = $db->query($qb->get());
      // $lid = $db->getInsertId();
      return true;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    } 
  }

  function extractCompareCountA() {
    try {
      set_time_limit(30000);
      $db = self::instance('kbloga');
      $qb = QB::instance('log')->select('id', 'compare')->where('compare', 'IS NOT', QB::raw(QB::NULL));
      // echo $qb->get();
      $logs = $db->query($qb->get());
      // var_dump($logs);
      foreach($logs as $log) {
        $lid = $log->id;
        $c = CoreApi::decompress($log->compare);
        $c = json_decode($c);
        $update['nma'] = count($c->match);
        $update['nex'] = count($c->excess);
        $update['nmi'] = count($c->miss);
        $qb = QB::instance('log')->update($update)->where('id', $lid);
        $db->query($qb->get());
        echo "-";
        // var_dump($c);
        // unset($c);
      }
      // $qb = QB::instance('log')->insert($log);
      // $result = $db->query($qb->get());
      // $lid = $db->getInsertId();
      return true;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    } 
  }

  // function logCmap($lid, $cmid) {
  //   try {
  //     $log = [];
  //     $log['lid'] = QB::esc($lid);
  //     $log['cmid'] = QB::esc($cmid);
  //     $db = self::instance();
  //     $qb = QB::instance('log_cmap')->insert($log);
  //     $result = $db->query($qb->get());
  //     return $result;
  //   } catch (Exception $ex) {
  //     throw CoreError::instance($ex->getMessage());
  //   } 
  // }

  // function logCmapState($lid, $concept, $link, $edge, $map, $proposition, $nc, $nl, $ne, $np) {
  //   try {

  //     $logState                = [];
  //     $logState['lid']         = QB::esc($lid);
  //     $logState['concept']     = QB::esc($concept);
  //     $logState['link']        = QB::esc($link);
  //     $logState['edge']        = QB::esc($edge);
  //     $logState['map']         = QB::esc($map);
  //     $logState['proposition'] = QB::esc($proposition);
  //     $logState['nc']          = QB::esc($nc);
  //     $logState['nl']          = QB::esc($nl);
  //     $logState['ne']          = QB::esc($ne);
  //     $logState['np']          = QB::esc($np);

  //     $db = self::instance();
  //     $qb = QB::instance('log_cmap_state')->insert($logState);
  //     $result = $db->query($qb->get());
  //     return $result;
  //   } catch (Exception $ex) {
  //     throw CoreError::instance($ex->getMessage());
  //   } 
  // }

  // function logKitBuild($lid, $lmid) {
  //   try {
  //     $log = [];
  //     $log['lid'] = QB::esc($lid);
  //     $log['lmid'] = QB::esc($lmid);
  //     $db = self::instance();
  //     $qb = QB::instance('log_kitbuild')->insert($log);
  //     $result = $db->query($qb->get());
  //     return $result;
  //   } catch (Exception $ex) {
  //     throw CoreError::instance($ex->getMessage());
  //   } 
  // }

  // function logKitBuildState($lid, $edge, $map, $proposition, $compare, $ne, $np) {
  //   try {

  //     $logState                = [];
  //     $logState['lid']         = QB::esc($lid);
  //     $logState['edge']        = QB::esc($edge);
  //     $logState['map']         = QB::esc($map);
  //     $logState['proposition'] = QB::esc($proposition);
  //     $logState['compare']     = QB::esc($compare);
  //     $logState['ne']          = QB::esc($ne);
  //     $logState['np']          = QB::esc($np);

  //     $db = self::instance();
  //     $qb = QB::instance('log_kitbuild_state')->insert($logState);
  //     $result = $db->query($qb->get());
  //     return $result;
  //   } catch (Exception $ex) {
  //     throw CoreError::instance($ex->getMessage());
  //   } 
  // }
}