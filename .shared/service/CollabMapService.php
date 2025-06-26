<?php

class CollabMapService extends CoreService {

  function insert($room, $userid, $mapid, $cmid, $kid, $type, $data, $cmapdata, $kitdata) {
    $insert['room']     = QB::esc($room);
    $insert['userid']   = QB::esc($userid);
    $insert['mapid']    = QB::esc($mapid);
    $insert['kid']      = QB::esc($kid);
    $insert['type']     = QB::esc($type);
    $insert['data']     = QB::esc($data);
    $insert['cmapdata'] = QB::esc($cmapdata);
    $insert['kitdata']  = QB::esc($kitdata);
    $insert['cmid']     = QB::esc($cmid);

    $db = self::instance();
    try {
      $qb = QB::instance('collabmap')->insert($insert);
      $db->query($qb->get());
      $lmid = $db->getInsertId();
      return $lmid;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function insertDraft($room, $userid, $mapid, $cmid, $kid, $data) {
    $insert['room']   = QB::esc($room);
    $insert['userid'] = QB::esc($userid);
    $insert['mapid']  = QB::esc($mapid);
    $insert['cmid']   = QB::esc($cmid);
    $insert['kid']    = QB::esc($kid);
    $insert['type']   = 'draft';
    $insert['data']   = QB::esc($data);

    $update['data']   = QB::esc($data);

    $db = self::instance();
    try {
      $qb = QB::instance('collabmap')
        ->select('id')
        ->where('userid', QB::esc($userid))
        ->where('cmid', QB::esc($cmid))
        ->where('kid', QB::esc($kid))
        ->where('type', 'draft');
      $id = $db->getVar($qb->get());
      
      if ($id) $insert['id'] = $id;

      $qb = QB::instance('collabmap')->insert($insert, $update);
      $db->query($qb->get());
      $lmid = $db->getInsertId();
      return $lmid;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function getCollabMapList($room, $mapid, $limit) {
    try {
      $db = self::instance();
      $result = new stdClass;
      $qb = QB::instance('collabmap');
      $qb->select('id', 'room', 'mapid', 'userid', 'cmid', 'kid', 'type', QB::raw("DATE_FORMAT(created, '%d/%m %H:%i') AS created"))
        ->where('room', QB::esc($room))
        ->where('mapid', QB::esc($mapid))
        ->orderBy('created', QB::DESC)
        ->limit($limit);
      $result = $db->query($qb->get());
      return $result;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function getCollabMap($id) {
    try {
      $db = self::instance();
      $result = new stdClass;
      $qb = QB::instance('collabmap');
      $qb->select()
        ->where('id', QB::esc($id));
      $result = $db->getRow($qb->get());
      return $result;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function getCollabMapsOfConceptMap($cmid) {
    try {
      $db = self::instance();
      $qb = QB::instance('collabmap l');
      $qb->select('l.id AS id', 'l.room AS room', 'l.userid AS userid', 
                  'l.cmid', 'l.kid', 'l.data', 'l.created')
        ->where('l.cmid', $cmid)
        ->orderBy('l.userid')
        ->orderBy('l.kid')
        ->orderBy('l.created');
      $learnerMaps = $db->query($qb->get());
      return $learnerMaps;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function searchCollabmaps($keyword, $page = 1, $perpage = 10) {
    try {
      $db = self::instance();
      $qb = QB::instance('collabmap l')
        ->select(QB::raw('l.*'), 'u.name AS creator', 'k.name AS kit')
        ->leftJoin('user u', 'u.username', 'l.author')
        ->leftJoin('kit k', 'k.kid', 'l.kid')
        ->where('u.username', QB::LIKE, "%$keyword%")
        ->where('u.name', QB::LIKE, "%$keyword%", QB::OR)
        ->where('k.name', QB::LIKE, "%$keyword%", QB::OR)
        ->orderBy('l.author')
        ->orderBy('l.create_time', QB::DESC)
        ->limit(($page-1)*$perpage, $perpage);
      $learnerMaps = $db->query($qb->get());
      return $learnerMaps;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function searchCollabmapsCount($keyword) {
    try {
      $db = self::instance();
      $qb = QB::instance('collabmap l')
        ->select(QB::raw('COUNT(*) AS count'))
        ->where('u.username', QB::LIKE, "%$keyword%")
        ->where('u.name', QB::LIKE, "%$keyword%", QB::OR)
        ->where('k.name', QB::LIKE, "%$keyword%", QB::OR);
      return $db->getVar($qb->get());
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

}