<?php 

class CoreMenu {
  public $label = null;
  public $url = null;
  public $id = null;
  public $icon = "menu-button-fill";
  public $subs = [];

  public function __construct($label = null, $url = null, $id = null, $icon = null, $subs = []) {
    if ($label) $this->label = $label;
    if ($url) $this->url = $url;
    if ($id) $this->id = $id;
    if ($icon) $this->icon = $icon;
    if ($subs && is_array($subs)) $this->subs = $subs;
  }

  public function addSub($menu) {
    $this->subs[] = $menu;
  }

}