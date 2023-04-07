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

}