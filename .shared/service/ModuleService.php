<?php

class ModuleService extends CoreService {
  public function getRegisteredApps() {
    $db = self::instance('sso');
    $qb = QB::instance('app')
      ->select();
    $result = $db->query($qb->get());
    return $result;
  }
  public function getAppMenu($app) {
    $menutree = CoreModule::instance($app)->menu();
    $menus = [];
    function walk($menu, &$menus) {
      if (!$menu->id) return;
      $m = new stdClass;
      $m->id = $menu->id;
      $m->label = $menu->label;
      $m->icon = $menu->icon;
      if ($menu->type) $m->type = $menu->type;
      $menus[] = $m;
      if($menu->subs) {
        foreach($menu->subs as $sub) {
          walk($sub, $menus);
        }
      }
    };
    foreach($menutree as $menu)
      walk($menu, $menus);
    return $menus;
  }
  public function getRegisteredMenus($app) {
    $db = self::instance('sso');
    $qb = QB::instance('menu')
      ->select('mid')
      ->where('app', QB::esc($app));
    $result = $db->query($qb->get());
    $mids = [];
    foreach($result as $r) $mids[] = $r->mid;
    return $mids;
  }
  public function getAppUsers($app, $rid) {
    $db = self::instance('sso');
    $qb = QB::instance('user_role ur')
      ->select()
      ->leftJoin('user u', 'u.username', 'ur.username')
      ->where('ur.app', QB::esc($app))
      ->where('ur.rid', QB::esc($rid));
    $result = $db->query($qb->get());
    return $result;
  }
}