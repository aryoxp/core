<?php

class LineService extends CoreService {

  public function getLines() {
    $db = self::instance('mta');
    $qb = QB::instance('line l')
      ->select()
      ->distinct()
      ->select(QB::raw('(SELECT COUNT(*) FROM linepoint lp WHERE lp.idline = l.idline) AS count'));
    return $db->query($qb->get());
  }

  public function getLine($id) {
    $db = self::instance('mta');
    $qb = QB::instance('linepoint l')
      ->select('p.idpoint', 'p.lat', 'p.lng', 'l.sequence', 'l.stop', 'ln.linecolor')
      ->leftJoin('point p', 'p.idpoint', 'l.idpoint')
      ->leftJoin('line ln', 'ln.idline', 'l.idline')
      ->where('l.idline', QB::IN, QB::raw(QB::OG . QB::esc($id) . QB::CG))
      ->orderBy('l.sequence');
    return $db->query($qb->get());
  }

  public function saveLine($idline, $line = []) {
    $db = self::instance('mta');
    $db->begin();
    try {

      // Mark all points for removal
      $qb = QB::instance('linepoint l')
        ->update('keep', 0)
        ->where('idline', QB::esc($idline));
      $db->query($qb->get());
  
      foreach($line as $p) {

        // Insert points or update as necessary
        // Mark the updated points to be kept
        $insert = [];
        $insert['idpoint'] = empty($p->idpoint) ? QB::raw('NULL') : $p->idpoint;
        $insert['lat'] = $p->lat;
        $insert['lng'] = $p->lng;
        $update = array('lat' => QB::raw('VALUES(lat)'), 'lng' => QB::raw('VALUES(lng)'));
        $qb = QB::instance('point');
        $qb->table('point')
            ->insert($insert, $update);
        $res = $db->query($qb->get());      
        if ($res === true) {

          // Insert points to the line and update its sequence number
          $insert = [];
          $insert['idline'] = QB::esc($idline);
          $insert['idpoint'] = empty($p->idpoint) ? QB::raw('LAST_INSERT_ID()') : $p->idpoint;
          $insert['sequence'] = $p->sequence;
          $update = array('sequence' => QB::raw('VALUES(`sequence`)'), 'keep' => 1);
          $qb = QB::instance('linepoint')
            ->insert($insert, $update);
          $res = $db->query($qb->get());
        }
      }
  
      // Delete unnecessary points
      $sql = "DELETE FROM point WHERE idpoint NOT IN (
                SELECT idpoint FROM linepoint WHERE keep = 1
                UNION SELECT start AS idpoint FROM path 
                UNION SELECT end AS idpoint FROM path
              ) ";
      $res = $db->query($sql);
      if ($res === true) $db->commit();
      return true;
    } catch(Exception $e) {
      $db->rollback();
      throw $e;
    }

  }

}