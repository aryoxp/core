<div class="d-flex flex-column flex-fill" style="height: 100%;">
  <header class="border-bottom">
    <div class="d-flex flex-nowrap align-items-stretch">

      <div class="sidebar-panel overflow-hidden">
        <a href="#" class="text-dark text-decoration-none mx-3 my-2 d-flex align-items-center" style="white-space: nowrap;">
          <i class="bi bi-slash-square-fill me-2 text-danger fs-4" role="img" aria-label="Bootstrap"></i>
          <span class="text-dark">Core Framework</span>
        </a>
      </div>


      <div class="d-flex nav col me-lg-auto shadow align-items-stretch flex-nowrap">

        <div class="d-flex align-items-center">
          <a class="d-flex px-3 admin-toggle-sidebar" role="button">
            <i class="bi bi-list fs-3"></i>
          </a>
        </div>

        <span id="page-title" class="fs-5 d-flex align-items-center">
          <span class="text-dark text-nowrap"><?php echo $title ?? ""; ?></span>
          <!-- <span class="fs-4 mx-3 text-muted">&middot;</span> -->
        </span>

        <div class="flex-fill flex-nowrap text-nowrap overflow-hidden d-flex align-items-stretch" style="position:relative; width: 100px">
        </div>

        <div class="d-flex align-items-center ms-3">
          <form action="compose/search" method="get">
            <input type="search" name="q" class="form-control form-control-sm" placeholder="Search..." aria-label="Search">
          </form>
          <div class="dropdown ms-3" id="lang-selection">
            <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="current-lang" data-bs-toggle="dropdown" aria-expanded="false">
              <small id="lang-label" data-lang="jp" class="text-primary">日本語</small>
            </a>
            <ul id="dd-lang" class="dropdown-menu text-small" aria-labelledby="current-lang">
              <li><a class="dropdown-item item-lang" role="button" data-code="en">English</a></li>
              <li><a class="dropdown-item item-lang text-primary" role="button" data-code="jp">日本語</a></li>
              <li><a class="dropdown-item item-lang" role="button" data-code="id">Bahasa Indonesia</a></li>
            </ul>
          </div>
          <div class="dropdown text-end mx-3">
            <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="h4 text-secondary bi bi-person-circle"></i>
              <!-- <img src="https://github.com/mdo.png" alt="mdo" width="28" height="28" class="rounded-circle"> -->
            </a>
            <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1">
              <!-- <li><a class="dropdown-item" href="#">Settings</a></li> -->
              <li><a class="dropdown-item" href="home/profile">
                  Profile </a>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <?php if (UAC::isSignedIn()): ?>
                <a class="dropdown-item bt-app-sign-out" href="<?php echo $this->location('home/signOut'); ?>">
                  <span class="btn btn-sm btn-danger">
                  Sign out <i class="bi bi-box-arrow-right"></i>
                  </span>
                </a>
                <?php else: ?>
                <a class="dropdown-item bt-app-sign-in" href="#">
                  <span class="btn btn-sm btn-primary">
                  <i class="bi bi-box-arrow-in-right"></i> Sign in</span>
                </a>
                <?php endif; ?>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </header>
  <div id="admin-app-container" class="d-flex flex-fill">
    <div id="admin-sidebar-panel" class="sidebar-panel border-end scroll-y bg-light">

      <?php
      $ui = $this; // var_dump($ui);
      function generateMenus($menu, &$ui, $sub = false)
      {

        $app = Core::lib(Core::URI)->get(CoreUri::APP);
        $controller = Core::lib(Core::URI)->get(CoreUri::CONTROLLERID);
        $method = Core::lib(Core::URI)->get(CoreUri::METHOD);

        $menuId = Core::lib(Core::CONFIG)->get('menuid');
        $active = $menuId == $menu->id ? " active" : "";

        if (!$menu->id || ($menu->type && $menu->type == "public") || CoreAuth::isMenuAuthorized($menu->app, $menu->id)) :
          if (!$sub && !count($menu->subs)) :
      ?>
            <li class="nav-item">
              <a class="nav-link menu-<?php echo $menu->id, $active; ?>" href="<?php echo $menu->url ? $ui->location($menu->url) : "#"; ?>">
                <span class="nav-icon">
                  <i class="bi bi-<?php echo $menu->icon; ?>"></i>
                </span>
                <span class="nav-link-text"><?php echo $menu->label; ?></span>
              </a><!--//nav-link-->
            </li><!--//nav-item-->
          <?php elseif (!$sub && count($menu->subs)) : //var_dump($menu); 
          ?>
            <li class="nav-item has-submenu">
              <a class="nav-link submenu-toggle <?php echo $active; ?>" href="#" data-bs-toggle="collapse" data-bs-target="#submenu-<?php echo $menu->id; ?>" aria-expanded="false" aria-controls="submenu-<?php echo $menu->id; ?>">
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
                  <?php foreach ($menu->subs as $sub) : ?>
                    <?php generateMenus($sub, $ui, true); ?>
                  <?php endforeach; ?>
                </ul>
              </div>
            </li>
          <?php else : // var_dump($menu); 
          ?>
            <?php if (property_exists($menu, 'type') && $menu->type == "separator") {
              echo '<li class="submenu-item ms-4"><hr class="m-0 p-0 mt-2 mb-2"></li>';
              return;
            } ?>
            <?php if (property_exists($menu, 'type') && $menu->type == "group") {
              echo '<li class="submenu-item ms-4 my-2 text-danger text-uppercase">' . $menu->label . '</li>';
              return;
            } ?>
            <?php if (count($menu->subs)) : ?>
              <li class="submenu-item text-nowrap nav-item has-submenu">
                <span id="menu-<?php echo $app ?>-<?php echo $menu->id; ?>" class="text-uppercase text-danger ms-4 my-2 d-block mb-1">
                  <?php // if ($menu->icon) echo '<i class="bi bi-'.$menu->icon.' me-2"></i>'; 
                  ?>
                  <?php echo $menu->label; ?></span>
                <div id="submenu-<?php echo $menu->id; ?>" class="submenu submenu-<?php echo $menu->id; ?>" data-bs-parent="#menu-accordion">
                  <ul class="submenu-list list-unstyled">
                    <?php foreach ($menu->subs as $sub) : ?>
                      <?php generateMenus($sub, $ui, true); ?>
                    <?php endforeach; ?>
                  </ul>
                </div>
              </li>
            <?php else : ?>
              <li class="submenu-item text-nowrap">
                <a id="menu-<?php echo $app ?>-<?php echo $menu->id; ?>" class="submenu-link<?php echo $active; ?>" href="<?php echo $ui->location($menu->url); ?>">
                  <?php if ($menu->icon) echo '<i class="bi bi-' . $menu->icon . ' me-2"></i>'; ?>
                  <?php echo $menu->label; ?></a>
              </li>
            <?php endif; ?>
      <?php endif;
        endif;
      }
      ?>

      <nav id="app-nav-main" class="app-nav app-nav-main flex-grow-1 admin-sidebar-inner">
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
            foreach ($modules as $module) {
              $menus = $module->menu();
              foreach ($menus as $menu)
                generateMenus($menu, $ui);
            }
          endif;
          ?>

          <?php // echo $this->view('sidepanel-menu-dummy.php'); 
          ?>
        </ul> <!--//app-menu-->
      </nav>


    </div>
    <div id="admin-content-panel" class="d-flex flex-column flex-fill scroll-y">
      <?php /*
<div class="app-header-inner">
  <div class="container-fluid py-2">
    <div class="app-header-content">
      <div class="row justify-content-between align-items-center">

        <div class="col-auto">
          <a id="sidepanel-toggler" class="sidepanel-toggler d-inline-block d-xl-none" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" role="img">
              <title>Menu</title>
              <path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"
                d="M4 7h22M4 15h22M4 23h22"></path>
            </svg>
          </a>
        </div>
        <!--//col-->
        <div class="search-mobile-trigger d-sm-none col">
          <i class="search-mobile-trigger-icon fas fa-search"></i>
        </div>
        <!--//col-->
        <div class="app-search-box col">
          <form class="app-search-form">
            <input type="text" placeholder="Search..." autocomplete="new-password" class="form-control search-input">
            <button type="submit" class="btn search-btn btn-primary" value="Search"><i
                class="fas fa-search"></i></button>
          </form>
        </div>
        <!--//app-search-box-->

        <div class="app-utilities col-auto d-flex align-items-center">
          <div class="app-utility-item app-notifications-dropdown dropdown">
            <a class="dropdown-toggle no-toggle-arrow" id="notifications-dropdown-toggle" data-bs-toggle="dropdown"
              href="#" role="button" aria-expanded="false" title="Notifications">
              <i class="bi bi-bell icon"></i>
              <!-- <span class="icon-badge">3</span> -->
            </a>
            <!--//dropdown-toggle-->

            <div class="dropdown-menu p-0" aria-labelledby="notifications-dropdown-toggle">
              <div class="dropdown-menu-header p-3">
                <h5 class="dropdown-menu-title mb-0">Notifications</h5>
              </div>
              <!--//dropdown-menu-title-->
              <div class="dropdown-menu-content">
                <div class="item p-3">
                  <em>No notifications.</em>
                </div>
                <?php //$this->view('header-notifications-dummy.php'); ?>
              </div>
              <!--//dropdown-menu-content-->

              <div class="dropdown-menu-footer p-2 text-center">
                <a href="<?php echo $this->location('notifications'); ?>">View all</a>
              </div>

            </div>
            <!--//dropdown-menu-->
          </div>
          <!--//app-utility-item-->
          <div class="app-utility-item">
            <a href="<?php echo $this->location('settings'); ?>" title="Settings">
              <i class="bi bi-gear icon"></i>
            </a>
          </div>
          <!--//app-utility-item-->

          <div class="app-utility-item app-user-dropdown dropdown">
            <a class="dropdown-toggle" id="user-dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
              aria-expanded="false" style="padding-top:-2px"><i class="bi bi-person-circle icon"></i></a>
            <ul class="dropdown-menu" aria-labelledby="user-dropdown-toggle">
              <?php if (UAC::isSignedIn()) : ?>
              <li><a class="dropdown-item" href="<?php echo $this->location('account'); ?>">Account</a></li>
              <li><a class="dropdown-item" href="<?php echo $this->location('settings'); ?>">Settings</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="<?php echo $this->location('home/signOut'); ?>">Sign Out <i class="bi bi-door-open text-danger ms-2"></i><i class="bi bi-arrow-right text-danger"></i></a></li>
              <?php else: ?>
              <li><a class="dropdown-item" href="<?php echo $this->location('sso', CoreView::APP); ?>">Sign In <i class="bi bi-arrow-right text-primary ms-2"></i><i class="bi bi-door-open text-primary"></i> </a></li>
              <?php endif; ?>
            </ul>
          </div>
          <!--//app-user-dropdown-->
        </div>
        <!--//app-utilities-->
      </div>
      <!--//row-->
    </div>
    <!--//app-header-content-->
  </div>
  <!--//container-fluid-->
</div><!--//app-header-inner--> */
      ?>