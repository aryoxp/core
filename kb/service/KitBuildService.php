<?php

class KitBuildService extends CoreService {

  function insertOrUpdate($id, $title, $data) {
    $insert['id'] = QB::esc($id);
    $insert['title'] = QB::esc($title);
    $insert['data'] = QB::esc($data);
    $update['title'] = QB::esc($title);
    $update['data'] = QB::esc($data);

    $db = self::instance('kb');
    $qb = QB::instance('conceptmap')
      ->insert($insert, $update);
    $result = $db->query($qb->get());
    return $result;
  }

  function getConceptMaps($keyword) {
    $db = self::instance('kb');
    $qb = QB::instance('conceptmap')
      ->select('id', 'title', 'created')
      ->where('id', QB::LIKE, QB::esc($keyword))
      ->where('title', QB::LIKE, '%'.QB::esc($keyword).'%', QB::OR)
      ->where('created', QB::LIKE, '%'.QB::esc($keyword).'%', QB::OR)
      ->orderBy('created', QB::DESC)
      ->limit(100);
    $result = $db->query($qb->get());
    return $result;
  }

  function searchConceptMaps($keyword, $limit=100) {
    $db = self::instance('kb');
    $qb = QB::instance('conceptmap')
      ->select('id', 'title', 'created')
      ->where('id', QB::LIKE, QB::esc($keyword))
      ->where('title', QB::LIKE, '%'.QB::esc($keyword).'%', QB::OR)
      ->where('created', QB::LIKE, '%'.QB::esc($keyword).'%', QB::OR)
      ->orderBy('created', QB::DESC)
      ->limit($limit);
    $result = $db->query($qb->get());
    return $result;
  }

  function openConceptMap($cmid) {
    $db = self::instance('kb');
    $qb = QB::instance('conceptmap')
      ->select('id', 'title', 'data', 'content', 'created')
      ->where('id', QB::LIKE, QB::esc($cmid));
    $result = $db->getRow($qb->get());
    return $result;
  }

  function getKitListByConceptMap($cmid, $limit=100) {
    $db = self::instance('kb');
    $qb = QB::instance('kit')
      ->select('id', 'title', 'cmid', 'options', 'created', 'enabled')
      ->where('cmid', QB::LIKE, QB::esc($cmid))
      ->orderBy('created', QB::DESC)
      ->limit($limit);
    $result = $db->query($qb->get());
    return $result;
  }

  function insertOrUpdateKitMap($id, $title, $cmid, $data, $options) {
    $insert['id'] = QB::esc($id);
    $insert['title'] = QB::esc($title);
    $insert['cmid'] = QB::esc($cmid);
    $insert['data'] = QB::esc($data);
    $insert['options'] = QB::esc($options);

    $update['title'] = QB::esc($title);
    $update['cmid'] = QB::esc($cmid);
    $update['data'] = QB::esc($data);
    $update['options'] = QB::esc($options);

    $db = self::instance('kb');
    $qb = QB::instance('kit')
      ->insert($insert, $update);
    $result = $db->query($qb->get());
    return $result;
  }

  function updateKitMap($id, $newid, $title, $cmid, $data, $options) {
    $update['id'] = QB::esc($newid);
    $update['title'] = QB::esc($title);
    $update['cmid'] = QB::esc($cmid);
    $update['data'] = QB::esc($data);
    $update['options'] = QB::esc($options);

    $db = self::instance('kb');
    $qb = QB::instance('kit')
      ->update($update)
      ->where('id', $id);
    $result = $db->query($qb->get());
    return $result;
  }

  function getKitMap($id) {
    $db = self::instance('kb');
    $qb = QB::instance('kit')
      ->select('id', 'title', 'cmid', 'data', 'options', 'created', 'enabled')
      ->where('id', QB::LIKE, QB::esc($id));
    $result = $db->getRow($qb->get());
    return $result;
  }

  function getConceptMapReferenceList($cmid) {
    $db = self::instance('kb');
    $qb = QB::instance('reference')
      ->select('id', 'cmid', 'type')
      ->where('cmid', QB::LIKE, QB::esc($cmid));
    $result = $db->query($qb->get());
    return $result;
  }

  function getConceptMapReferences($cmid) {
    $db = self::instance('kb');
    $qb = QB::instance('reference')
      ->select('id', 'cmid', 'type', 'data')
      ->where('cmid', QB::LIKE, QB::esc($cmid));
    $result = $db->query($qb->get());
    return $result;
  }

  function getConceptMapReference($id, $cmid) {
    $db = self::instance('kb');
    $qb = QB::instance('reference')
      ->select('id', 'cmid', 'type', 'data')
      ->where('id', QB::esc($id))
      ->where('cmid', QB::esc($cmid));
    $result = $db->getRow($qb->get());
    return $result;
  }

  function addConceptMapResource($id, $cmid, $type, $data) {
    $insert['id'] = QB::esc($id);
    $insert['cmid'] = QB::esc($cmid);
    $insert['type'] = QB::esc($type);
    $insert['data'] = QB::esc($data);

    $update['type'] = QB::esc($type);
    $update['data'] = QB::esc($data);

    $db = self::instance('kb');
    $qb = QB::instance('reference')
      ->insert($insert, $update);
    $result = $db->query($qb->get());
    return $result;
  }

  function deleteConceptMapResource($id, $cmid) {
    $db = self::instance('kb');
    $qb = QB::instance('reference')
      ->delete()
      ->where('id', QB::esc($id))
      ->where('cmid', QB::esc($cmid));
    $result = $db->query($qb->get());
    return $result;
  }

}