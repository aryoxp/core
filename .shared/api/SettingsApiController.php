<?php

class SettingsApiController extends CoreApi {
  public function registerApp() {
    try {
      $app = $this->postv('app');
      $name = $this->postv('name');
      $result = (new RBACService())->registerApp($app, $name);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deregisterApp() {
    try {
      $app = $this->postv('app');
      $result = (new RBACService())->deregisterApp($app);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getRegisteredApps() {
    try {
      $result = (new ModuleService())->getRegisteredApps();
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAppMenu() {
    try {
      $app = $this->postv('app');
      $result = (new ModuleService())->getAppMenu($app);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getRegisteredMenus() {
    try {
      $app = $this->postv('app');
      $result = (new ModuleService())->getRegisteredMenus($app);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function registerMenu() {
    try {
      $app = $this->postv('app');
      $mid = $this->postv('mid');
      $label = $this->postv('label');
      $url = $this->postv('url');
      $icon = $this->postv('icon');
      $result = (new RBACService())->registerMenu($app, $mid, $label, $url, $icon);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deregisterMenu() {
    try {
      $app = $this->postv('app');
      $mid = $this->postv('mid');
      $result = (new RBACService())->deregisterMenu($app, $mid);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function createRole() {
    try {
      $app = $this->postv('app');
      $rid = $this->postv('rid');
      $name = $this->postv('name');
      $result = (new RBACService())->createRole($app, $rid, $name);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteRole() {
    try {
      $app = $this->postv('app');
      $rid = $this->postv('rid');
      $result = (new RBACService())->deleteRole($app, $rid);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAppRoles() {
    try {
      $app = $this->postv('app');
      $result = (new RBACService())->getAppRoles($app);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAppAuthorizedMenu() {
    try {
      $app = $this->postv('app');
      $rid = $this->postv('rid');
      $result = (new RBACService())->getAppAuthorizedMenu($app, $rid);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function authorizeMenu() {
    try {
      $app = $this->postv('app');
      $rid = $this->postv('rid');
      $mid = $this->postv('mid');
      $result = (new RBACService())->authorizeMenu($app, $rid, $mid);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deauthorizeMenu() {
    try {
      $app = $this->postv('app');
      $rid = $this->postv('rid');
      $mid = $this->postv('mid');
      $result = (new RBACService())->deauthorizeMenu($app, $rid, $mid);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getUsers() {
    try {
      $keyword = $this->postv('keyword');
      $result = (new RBACService())->getUsers($keyword);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getUser() {
    try {
      $username = $this->postv('username');
      $result = (new RBACService())->getUser($username);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function createUser() {
    try {
      $username = $this->postv('username');
      $password = $this->postv('password');
      $name = $this->postv('name');
      $result = (new RBACService())->createUser($username, $password, $name);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function updateUser() {
    try {
      $id = $this->postv('id');
      $username = $this->postv('username');
      $password = $this->postv('password');
      $name = $this->postv('name');
      $result = (new RBACService())->updateUser($id, $username, $password, $name);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deleteUser() {
    try {
      $username = $this->postv('username');
      $name = $this->postv('name');
      $result = (new RBACService())->deleteUser($username);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAssignedRoles() {
    try {
      $username = $this->postv('username');
      $app = $this->postv('app');
      $result = (new RBACService())->getAssignedRoles($username, $app);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function assignRole() {
    try {
      $username = $this->postv('username');
      $app = $this->postv('app');
      $rid = $this->postv('rid');
      $result = (new RBACService())->assignRole($username, $app, $rid);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function deassignRole() {
    try {
      $username = $this->postv('username');
      $app = $this->postv('app');
      $rid = $this->postv('rid');
      $result = (new RBACService())->deassignRole($username, $app, $rid);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function getAppUsers() {
    try {
      $app = $this->postv('app');
      $rid = $this->postv('rid');
      $result = (new ModuleService())->getAppUsers($app, $rid);
      CoreResult::instance($result)->show();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
}