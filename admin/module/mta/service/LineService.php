<?php

class LineService extends CoreService {

  public function getLines() {
    $db = self::instance('mta');
    $qb = QB::instance('line l')
      ->select()
      ->distinct()
      ->select(QB::raw('(SELECT COUNT(*) FROM linepoint lp WHERE lp.idline = l.idline) AS count'))
      ->orderBy('name')
      ->orderBy('direction', QB::DESC);
    return $db->query($qb->get());
  }

  public function getLine($id) {
    $db = self::instance('mta');
    $qb = QB::instance('linepoint l')
      ->select('p.idpoint', 'p.lat', 'p.lng', 'l.sequence', 'l.stop', 'l.idinterchange', 'ln.name', 'ln.direction', 'ln.linecolor')
      ->select(QB::raw(QB::qt($id) . ' AS idline'))
      ->leftJoin('point p', 'p.idpoint', 'l.idpoint')
      ->leftJoin('line ln', 'ln.idline', 'l.idline')
      ->where('l.idline', QB::IN, QB::raw(QB::OG . QB::esc($id) . QB::CG))
      ->orderBy('l.sequence');
    return $db->query($qb->get());
  }

  public function getInterchanges() {
    $db = self::instance('mta');
    $qb = QB::instance('interchange i')
      ->select('i.idinterchange')
      ->select(QB::raw('GROUP_CONCAT(lp.idpoint) AS idpoints'))
      ->select(QB::raw('GROUP_CONCAT(lp.idline) AS idlines'))
      ->leftJoin('linepoint lp', 'lp.idinterchange', 'i.idinterchange')
      ->groupBy('i.idinterchange')
      ->orderBy('i.idinterchange');
    return $db->query($qb->get());
  }

  public function saveLine($idline, $points = []) {
    $db = self::instance('mta');
    $db->begin();
    try {

      // Mark all points for removal
      $qb = QB::instance('linepoint l')
        ->update('keep', 0)
        ->where('idline', QB::esc($idline));
      $db->query($qb->get());
  
      foreach($points as $p) {

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
                UNION SELECT idpointstart AS idpoint FROM linepath 
                UNION SELECT idpointend AS idpoint FROM linepath
              ) ";
      $res = $db->query($sql);
      if ($res === true) $db->commit();
      return true;
    } catch(Exception $e) {
      $db->rollback();
      throw $e;
    }

  }

  public function deleteLine($idline) {
    try {
      $db = self::instance('mta');
      $qb = QB::instance('point')
        ->delete()
        ->where('idpoint', QB::IN, QB::raw("(SELECT idpoint FROM linepoint WHERE idline = '".QB::esc($idline)."')"));
      $db->begin();
      $db->query($qb->get());
      // Enable below to also delete the line
      $qb = QB::instance('line')->delete()->where('idline', QB::esc($idline));
      $db->query($qb->get());
      $db->commit();
      return true;
    } catch(Exception $e) {
      $db->rollback();
      throw $e;
    }
  }

  public function updateLine($idline, $name, $linecolor, $direction, $enabled) {
    try {
      $db = self::instance('mta');

      $update['name'] = QB::esc($name);
      $update['direction'] = QB::esc($direction);
      $update['linecolor'] = QB::esc($linecolor); 
      $update['enabled'] = QB::esc($enabled); 

      $qb = QB::instance('line')
        ->update($update)
        ->where('idline', QB::esc($idline));
      $db->query($qb->get());
      return true;
    } catch(Exception $e) {
      throw $e;
    }
  }

  public function createLine($name, $linecolor, $direction, $idlinetype, $enabled) {
    try {
      $db = self::instance('mta');

      $insert['name'] = QB::esc($name);
      $insert['direction'] = QB::esc($direction);
      $insert['linecolor'] = QB::esc($linecolor);
      $insert['idlinetype'] = QB::esc($idlinetype); 
      $insert['enabled'] = QB::esc($enabled); 

      $qb = QB::instance('line')->insert($insert);
      $db->query($qb->get());
      return true;
    } catch(Exception $e) {
      throw $e;
    }
  }


}