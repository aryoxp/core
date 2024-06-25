<?php use PSpell\Config;  ?>
<div id="app-sidepanel" class="app-sidepanel">
  <div id="sidepanel-drop" class="sidepanel-drop"></div>
  <div class="sidepanel-inner d-flex flex-column">
    <a href="#" id="sidepanel-close" class="sidepanel-close d-xl-none">&times;</a>
    <div class="app-branding"><a href="#">X</a>
      <!-- <a class="app-logo" href="<?php


 echo $this->location(); ?>"><img class="logo-icon me-2"
          src="<?php echo $this->asset('images/app-logo.svg'); ?>" alt="logo"><span
          class="logo-text">Admin</span></a> -->

    </div><!--//app-branding-->

    <?php
      $ui = $this;
      // var_dump($ui);
      function generateMenus($menu, &$ui, $sub = false) {

        $app = Core::lib(Core::URI)->get(CoreUri::APP);
        $controller = Core::lib(Core::URI)->get(CoreUri::CONTROLLERID);
        $method = Core::lib(Core::URI)->get(CoreUri::METHOD);

        $menuId = Core::lib(Core::CONFIG)->get('menuid');
        $active = $menuId == $menu->id ? " active" : "";

        if(!$menu->id || ($menu->type && $menu->type == "public") || CoreAuth::isMenuAuthorized($menu->app, $menu->id)) :
        if(!$sub && !count($menu->subs)) :
        ?>
          <li class="nav-item">
            <a class="nav-link menu-<?php echo $menu->id, $active; ?>" href="<?php echo $menu->url ? $ui->location($menu->url) : "#"; ?>">
              <span class="nav-icon">
                <i class="bi bi-<?php echo $menu->icon; ?>"></i>
              </span>
              <span class="nav-link-text"><?php echo $menu->label; ?></span>
            </a><!--//nav-link-->
          </li><!--//nav-item-->
        <?php elseif (!$sub && count($menu->subs)): //var_dump($menu); ?>
          <li class="nav-item has-submenu">
            <a class="nav-link submenu-toggle <?php echo $active; ?>" href="#" data-bs-toggle="collapse" data-bs-target="#submenu-<?php echo $menu->id; ?>"
              aria-expanded="false" aria-controls="submenu-<?php echo $menu->id; ?>">
              <span class="nav-icon">
              <i class="bi bi-<?php echo $menu->icon; ?>"></i>
              </span>
              <span class="nav-link-text"><?php echo $menu->label; ?></span>
              <span class="submenu-arrow">
                <i class="bi bi-chevron-down"></i>
              </span><!--//submenu-arrow-->
            </a><!--//nav-link-->
            <div id="submenu-<?php echo $menu->id; ?>" class="collapse submenu submenu-<?php echo $menu->id; ?>" data-bs-parent="#menu-accordion">
              <ul class="submenu-list list-unstyled">
                <?php foreach($menu->subs as $sub) : ?>
                <?php generateMenus($sub, $ui, true); ?>
                <?php endforeach; ?> 
              </ul>
            </div>
          </li>
        <?php else: // var_dump($menu); ?>
          <?php if (property_exists($menu, 'type') && $menu->type == "separator") {
            echo '<li class="submenu-item ms-4"><hr class="m-0 p-0 mt-2 mb-2"></li>';
            return;
          } ?>
            <?php if (property_exists($menu, 'type') && $menu->type == "group") {
            echo '<li class="submenu-item ms-5 my-1 text-primary text-uppercase">'.$menu->label.'</li>';
            return;
          } ?>
          <?php if(count($menu->subs)) : ?>
          <li class="submenu-item text-nowrap nav-item has-submenu">
            <span id="menu-<?php echo $app ?>-<?php echo $menu->id; ?>" 
            class="text-uppercase text-primary ms-5 d-block mb-1">
            <?php // if ($menu->icon) echo '<i class="bi bi-'.$menu->icon.' me-2"></i>'; ?>
            <?php echo $menu->label; ?></span>
            <div id="submenu-<?php echo $menu->id; ?>" class="submenu submenu-<?php echo $menu->id; ?>" data-bs-parent="#menu-accordion">
              <ul class="submenu-list list-unstyled">
                <?php foreach($menu->subs as $sub) : ?>
                <?php generateMenus($sub, $ui, true); ?>
                <?php endforeach; ?> 
              </ul>
            </div>
          </li>
          <?php else: ?>
          <li class="submenu-item text-nowrap">
            <a id="menu-<?php echo $app ?>-<?php echo $menu->id; ?>" 
            class="submenu-link<?php echo $active; ?>" href="<?php echo $ui->location($menu->url); ?>">
            <?php if ($menu->icon) echo '<i class="bi bi-'.$menu->icon.' me-2"></i>'; ?>
            <?php echo $menu->label; ?></a>
          </li>
          <?php endif; ?>
        <?php endif;
        endif;
      }
    ?>

    <nav id="app-nav-main" class="app-nav app-nav-main flex-grow-1 bg-light">
      <ul class="app-menu list-unstyled accordion" id="menu-accordion">
        <li class="nav-item">
          <a class="nav-link menu-admin-home-index" href="<?php echo $this->location(); ?>">
            <span class="nav-icon">
              <i class="bi bi-speedometer"></i>
            </span>
            <span class="nav-link-text">Dashboard</span>
          </a><!--//nav-link-->
        </li><!--//nav-item-->

        <?php 
        if (UAC::isSignedIn()) :
          $modules = CoreModule::getModules();
          foreach($modules as $module) {
            $menus = $module->menu();
            foreach($menus as $menu)
              generateMenus($menu, $ui); 
          }
        endif;
        ?>

        <?php // echo $this->view('sidepanel-menu-dummy.php'); ?>
      </ul> <!--//app-menu-->
    </nav> <!--//app-nav-->
    <div class="app-sidepanel-footer">
      <nav class="app-nav app-nav-footer">
        <ul class="app-menu footer-menu list-unstyled">
          <li class="nav-item">
            <a class="nav-link menu-admin-settings-index" href="<?php echo $this->location('settings'); ?>">
              <span class="nav-icon">
                <i class="bi bi-gear"></i>
              </span>
              <span class="nav-link-text">Settings</span>
            </a> <!--//nav-link-->
          </li> <!--//nav-item-->
        </ul> <!--//footer-menu-->
      </nav>
    </div>
    <!--//app-sidepanel-footer-->

  </div>
  <!--//sidepanel-inner-->
</div><!--//app-sidepanel-->
