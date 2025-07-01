<?php

class ContentService extends CoreService {

  function getTexts($cmid, $keyword, $page = 1, $perpage = 5) {
    $db = self::instance('kb');
    $qb = QB::instance('reference')
      ->select('id','cmid','type')
      ->where('id', 'LIKE', '%'.QB::esc($keyword).'%')
      ->where('cmid', QB::esc($cmid))
      ->limit(($page-1)*$perpage, $perpage);
    $result = $db->query($qb->get());
    return $result;
  }
  // function search($keyword) {
  //   $db = self::instance('kb');
  //   $qb = QB::instance('pair')
  //     ->select()
  //     ->where('userid', 'LIKE', '%'.QB::esc($keyword).'%')
  //     ->where('room', 'LIKE', '%'.QB::esc($keyword).'%', QB::OR);
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
  // function insert($userid, $room) {
  //   $insert['userid'] = QB::esc($userid);
  //   $insert['room']   = QB::esc($room);
  //   $db = self::instance('kb');
  //   $qb = QB::instance('pair')
  //     ->insert($insert);
  //   $result = $db->query($qb->get());
  //   $id = $db->getInsertId();
  //   return $id;
  // }
  // function updateRoom($id, $room) {
  //   $db = self::instance('kb');
  //   $qb = QB::instance('pair')
  //     ->update('room', QB::esc($room))
  //     ->where('id', QB::esc($id));
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
  // function updateUserId($id, $userid) {
  //   $db = self::instance('kb');
  //   $qb = QB::instance('pair')
  //     ->update('userid', QB::esc($userid))
  //     ->where('id', QB::esc($id));
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
  // function deletePair($id) {
  //   $db = self::instance('kb');
  //   $qb = QB::instance('pair')
  //     ->delete()
  //     ->where('id', QB::esc($id));
  //   $result = $db->query($qb->get());
  //   return $result;
  // }
}