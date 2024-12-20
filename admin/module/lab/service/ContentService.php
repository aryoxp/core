<?php

class ContentService extends CoreService {
  public function search($keyword, $filter = "", $page = 1, $perpage=100, $sort) {
    // $filters = [];
    function filter($qb, $filter) {
      if(is_array($filter) and !empty($filter)) {
        $qb->where(QB::OG);
        foreach($filter as $c => $v) {
          $vs = explode(",", $v);
          foreach($vs as $s) { // echo $c, $s;
            if ($s == '-') $qb->where($c, QB::IS, QB::raw(QB::NULL), QB::OR);
            else $qb->where($c, QB::EQ, QB::esc(trim($s)), QB::OR);
          }
        }
        $qb->where(QB::EG);
      }
    }
    // var_dump($filters);
    $offset = ($page-1) * $perpage;
    $db = self::instance('lab');
    $qb = QB::instance('content')
      ->select()
      ->where(QB::OG)
      ->where('key', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('title', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('subtitle', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('content', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where(QB::EG);
    filter($qb, $filter);
    $qb->orderBy('created', QB::DESC)
      ->limit($offset, $perpage);
    // echo $qb->get();
    $content = $db->query($qb->get());
    $qb = QB::instance('content')
      ->select(QB::raw('COUNT(*)'))
      ->where(QB::OG)
      ->where('key', 'LIKE', QB::esc('%'.$keyword.'%'))
      ->where('title', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('subtitle', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where('content', 'LIKE', QB::esc('%'.$keyword.'%'), QB::OR)
      ->where(QB::EG);
    filter($qb, $filter);
    $result = new stdClass;
    $result->content = $content;
    $result->count = $db->getVar($qb->get());
    return $result;
  }
  public function save($type, $key, $title, $content, $subtitle = null, $id = null) {
    $db = self::instance('lab');
    $insert['type'] = QB::esc($type);
    $insert['key'] = QB::esc($key);
    $insert['title'] = QB::esc($title);
    $insert['content'] = QB::esc($content);
    $insert['subtitle'] = QB::esc($subtitle);
    $insert['updated'] = QB::raw('NOW()');
    if ($id) $insert['cid'] = QB::esc($id);

    $update['type'] = QB::esc($type);
    $update['key'] = QB::esc($key);
    $update['title'] = QB::esc($title);
    $update['content'] = QB::esc($content);
    $update['subtitle'] = QB::esc($subtitle);
    $update['updated'] = QB::raw('NOW()');
    // if ($id) $update['cid'] = QB::esc($id);
    $qb = QB::instance('content')
      ->insert($insert, $update);
    // echo $qb->get(); exit;
    $result = $db->query($qb->get());
    // var_dump($db);
    return $result;
  }
  public function getContent($cid) {
    $db = self::instance('lab');
    $qb = QB::instance('content')
      ->select()
      ->where('cid', QB::esc($cid))
      ->limit(1);
    $result = $db->getRow($qb->get());
    return $result;
  }
  public function deleteContent($cid) {
    $db = self::instance('lab');
    $qb = QB::instance('content')
      ->delete()
      ->where('cid', QB::esc($cid))
      ->limit(1);
    $result = $db->query($qb->get());
    return $result;
  }
}