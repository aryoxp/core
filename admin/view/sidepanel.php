<div id="app-sidepanel" class="app-sidepanel">
  <div id="sidepanel-drop" class="sidepanel-drop"></div>
  <div class="sidepanel-inner d-flex flex-column">
    <a href="#" id="sidepanel-close" class="sidepanel-close d-xl-none">&times;</a>
    <div class="app-branding">
      <a class="app-logo" href="<?php echo $this->location(); ?>"><img class="logo-icon me-2"
          src="<?php echo $this->asset('images/app-logo.svg'); ?>" alt="logo"><span
          class="logo-text">Admin</span></a>

    </div>
    <!--//app-branding-->

    <nav id="app-nav-main" class="app-nav app-nav-main flex-grow-1">
      <ul class="app-menu list-unstyled accordion" id="menu-accordion">
        <li class="nav-item">
          <a class="nav-link active" href="<?php echo $this->location(); ?>">
            <span class="nav-icon">
              <i class="bi bi-speedometer"></i>
            </span>
            <span class="nav-link-text">Dashboard</span>
          </a><!--//nav-link-->
        </li><!--//nav-item-->
        <li class="nav-item has-submenu">
          <!--//Bootstrap Icons: https://icons.getbootstrap.com/ -->
          <a class="nav-link submenu-toggle" href="#" data-bs-toggle="collapse" data-bs-target="#submenu-1"
            aria-expanded="false" aria-controls="submenu-1">
            <span class="nav-icon">
            <i class="bi bi-files"></i>
            </span>
            <span class="nav-link-text">Pages</span>
            <span class="submenu-arrow">
              <i class="bi bi-chevron-down"></i>
            </span>
            <!--//submenu-arrow-->
          </a>
          <!--//nav-link-->
          <div id="submenu-1" class="collapse submenu submenu-1" data-bs-parent="#menu-accordion">
            <ul class="submenu-list list-unstyled">
              <li class="submenu-item"><a class="submenu-link" href="<?php echo $this->location('notifications'); ?>">Notifications</a></li>
              <li class="submenu-item"><a class="submenu-link" href="<?php echo $this->location('account'); ?>">Account</a></li>
              <li class="submenu-item"><a class="submenu-link" href="<?php echo $this->location('settings'); ?>">Settings</a></li>
            </ul>
          </div>
        </li>
        <!--//nav-item-->
        <li class="nav-item has-submenu">
          <!--//Bootstrap Icons: https://icons.getbootstrap.com/ -->
          <a class="nav-link submenu-toggle" href="#" data-bs-toggle="collapse" data-bs-target="#submenu-2"
            aria-expanded="false" aria-controls="submenu-2">
            <span class="nav-icon">
              <i class="bi bi-columns-gap"></i>
            </span>
            <span class="nav-link-text">External</span>
            <span class="submenu-arrow">
              <i class="bi bi-chevron-down"></i>
            </span>
            <!--//submenu-arrow-->
          </a>
          <!--//nav-link-->
          <div id="submenu-2" class="collapse submenu submenu-2" data-bs-parent="#menu-accordion">
            <ul class="submenu-list list-unstyled">
              <li class="submenu-item"><a class="submenu-link" href="<?php echo $this->location('login'); ?>">Login</a></li>
              <li class="submenu-item"><a class="submenu-link" href="<?php echo $this->location('signup'); ?>">Signup</a></li>
              <li class="submenu-item"><a class="submenu-link" href="<?php echo $this->location('reset-password'); ?>">Reset password</a></li>
              <li class="submenu-item"><a class="submenu-link" href="<?php echo $this->location('404'); ?>">404 page</a></li>
            </ul>
          </div>
        </li>
        <!--//nav-item-->


        <li class="nav-item">
          <!--//Bootstrap Icons: https://icons.getbootstrap.com/ -->
          <a class="nav-link" href="<?php echo $this->location('charts'); ?>">
            <span class="nav-icon">
              <i class="bi bi-bar-chart-line"></i>
            </span>
            <span class="nav-link-text">Charts</span>
          </a>
          <!--//nav-link-->
        </li>
        <!--//nav-item-->

        <li class="nav-item">
          <!--//Bootstrap Icons: https://icons.getbootstrap.com/ -->
          <a class="nav-link" href="<?php echo $this->location('help'); ?>">
            <span class="nav-icon">
              <i class="bi bi-question-circle"></i>
            </span>
            <span class="nav-link-text">Help</span>
          </a>
          <!--//nav-link-->
        </li>
        <!--//nav-item-->
      </ul>
      <!--//app-menu-->
    </nav>
    <!--//app-nav-->
    <div class="app-sidepanel-footer">
      <nav class="app-nav app-nav-footer">
        <ul class="app-menu footer-menu list-unstyled">
          <li class="nav-item">
            <!--//Bootstrap Icons: https://icons.getbootstrap.com/ -->
            <a class="nav-link" href="<?php echo $this->location('settings'); ?>">
              <span class="nav-icon">
                <i class="bi bi-gear"></i>
              </span>
              <span class="nav-link-text">Settings</span>
            </a>
            <!--//nav-link-->
          </li>
          <!--//nav-item-->
          <li class="nav-item">
            <!--//Bootstrap Icons: https://icons.getbootstrap.com/ -->
            <a class="nav-link"
              href="https://themes.3rdwavemedia.com/bootstrap-templates/admin-dashboard/portal-free-bootstrap-admin-dashboard-template-for-developers/">
              <span class="nav-icon">
                <i class="bi bi-download"></i>
              </span>
              <span class="nav-link-text">Download</span>
            </a>
            <!--//nav-link-->
          </li>
          <!--//nav-item-->
          <li class="nav-item">
            <!--//Bootstrap Icons: https://icons.getbootstrap.com/ -->
            <a class="nav-link"
              href="https://themes.3rdwavemedia.com/bootstrap-templates/admin-dashboard/portal-free-bootstrap-admin-dashboard-template-for-developers/">
              <span class="nav-icon">
                <i class="bi bi-file-person"></i>
              </span>
              <span class="nav-link-text">License</span>
            </a>
            <!--//nav-link-->
          </li>
          <!--//nav-item-->
        </ul>
        <!--//footer-menu-->
      </nav>
    </div>
    <!--//app-sidepanel-footer-->

  </div>
  <!--//sidepanel-inner-->
</div><!--//app-sidepanel-->