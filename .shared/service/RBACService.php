<?php

class RBACService extends CoreService {
  public function registerApp($app, $name) {
    $db = self::instance('sso');
    $qb = QB::instance('app')
      ->insert([
        'app' => QB::esc($app),
        'name' => QB::esc($name)
      ])
      ->update(['name' => QB::esc($name)]);
    $result = $db->query($qb->get());
    return $result;
  }
  public function deregisterApp($app) {
    $db = self::instance('sso');
    $qb = QB::instance('app')
      ->delete()
      ->where('app', QB::esc($app));
    $result = $db->query($qb->get());
    return $result;
  }
  public function registerMenu($app, $mid, $label = null, $url = null, $icon = null) {
    $db = self::instance('sso');
    $qb = QB::instance('menu')
      ->insert([
        'app' => QB::esc($app),
        'mid' => QB::esc($mid),
        'label' => QB::esc($label),
        'url' => QB::esc($url),
        'icon' => QB::esc($icon),
      ])
      ->update(['label' => QB::esc($label), 
      'url' => QB::esc($url),
      'icon' => QB::esc($icon)]);
    $result = $db->query($qb->get());
    return $result;
  }
  public function deregisterMenu($app, $mid) {
    $db = self::instance('sso');
    $qb = QB::instance('menu')
      ->delete()
      ->where('app', QB::esc($app))
      ->where('mid', QB::esc($mid));
    $result = $db->query($qb->get());
    return $result;
  }
  public function createRole($app, $rid, $name) {
    $db = self::instance('sso');
    $qb = QB::instance('role')
      ->insert([
        'app' => QB::esc($app),
        'rid' => QB::esc($rid),
        'name' => QB::esc($name)
      ])
      ->update(['name' => QB::esc($name)]);
    $result = $db->query($qb->get());
    return $result;
  }
  public function deleteRole($app, $rid) {
    $db = self::instance('sso');
    $qb = QB::instance('app')
      ->delete()
      ->where('app', QB::esc($app))
      ->where('rid', QB::esc($rid));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getAppRoles($app) {
    $db = self::instance('sso');
    $qb = QB::instance('role')
      ->select()
      ->where('app', QB::esc($app));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getAppAuthorizedMenu($app, $rid) {
    $db = self::instance('sso');
    $qb = QB::instance('auth_menu')
      ->select()
      ->where('app', QB::esc($app))
      ->where('rid', QB::esc($rid));
    $result = $db->query($qb->get());
    return $result;
  }
  public function authorizeMenu($app, $rid, $mid) {
    $db = self::instance('sso');
    $qb = QB::instance('auth_menu')
      ->insert([
        'app' => QB::esc($app),
        'rid' => QB::esc($rid),
        'mid' => QB::esc($mid)
      ]);
    $result = $db->query($qb->get());
    return $result;
  }
  public function deauthorizeMenu($app, $rid, $mid) {
    $db = self::instance('sso');
    $qb = QB::instance('auth_menu')
      ->delete()
      ->where('app', QB::esc($app))
      ->where('rid', QB::esc($rid))
      ->where('mid', QB::esc($mid));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getUsers($keyword) {
    $db = self::instance('sso');
    $qb = QB::instance('user')
      ->select()
      ->where('username', 'LIKE', '%'.QB::esc($keyword).'%')
      ->where('name', 'LIKE', '%'.QB::esc($keyword).'%', QB::OR);
    $result = $db->query($qb->get());
    return $result;
  }
  public function getUser($username) {
    $db = self::instance('sso');
    $qb = QB::instance('user')
      ->select()
      ->where('username', QB::esc($username));
    $result = $db->getRow($qb->get());
    return $result;
  }
  public function createUser($username, $password, $name) {
    $db = self::instance('sso');
    $qb = QB::instance('user')
      ->insert([
        'username' => QB::esc($username),
        'password' => QB::raw('MD5(\''.QB::esc($password).'\')'),
        'name' => QB::esc($name)
      ]);
    $result = $db->query($qb->get());
    return $result;
  }
  public function updateUser($id, $username, $password, $name) {
    $db = self::instance('sso');
    $update['username'] = QB::esc($username);
    $update['name'] = QB::esc($name);
    if (!empty($password)) $update['password'] = QB::raw('MD5(\''.QB::esc($password).'\')');
    $qb = QB::instance('user')
      ->update($update)
      ->where('username', $id);
    $result = $db->query($qb->get());
    return $result;
  }
  public function deleteUser($username) {
    $db = self::instance('sso');
    $qb = QB::instance('user')
      ->delete()
      ->where('username', QB::esc($username));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getAssignedRoles($username, $app) {
    $db = self::instance('sso');
    $qb = QB::instance('user_role')
      ->select('rid')
      ->where('username', QB::esc($username))
      ->where('app', QB::esc($app));
    $result = $db->query($qb->get());
    $rids = [];
    foreach($result as $rid) $rids[] = $rid->rid;
    return $rids;
  }
  public function assignRole($username, $app, $rid) {
    $db = self::instance('sso');
    $qb = QB::instance('user_role')
      ->insert([
        'username' => QB::esc($username),
        'app' => QB::esc($app),
        'rid' => QB::esc($rid)
      ]);
    $result = $db->query($qb->get());
    return $result;
  }
  public function deassignRole($username, $app, $rid) {
    $db = self::instance('sso');
    $qb = QB::instance('user_role')
      ->delete()
      ->where('username', QB::esc($username))
      ->where('app', QB::esc($app))
      ->where('rid', QB::esc($rid));
    $result = $db->query($qb->get());
    return $result;
  }
  public function getAuthorizedMenus($username) {
    $db = self::instance('sso');
    $qb = QB::instance('user_role ur')
      ->select('m.app','m.mid')
      ->leftJoin('role r', ['r.rid' => 'ur.rid', 'r.app' => 'ur.app'])
      ->leftJoin('auth_menu m', ['m.rid' => 'r.rid', 'm.app' => 'r.app'])
      ->where('username', QB::esc($username))
      ->where('m.mid', "IS NOT", QB::raw('NULL'))
      ->orderBy('m.app');
    $result = $db->query($qb->get());
    $mids = [];
    $app = null;
    $auth = []; 
    foreach($result as $m) {
      if ($app != $m->app) {
        $app = $m->app;
        $auth[$app] = [];
      }
      $auth[$app][] = $m->mid;
    } 
    return $auth;
  }
  
}