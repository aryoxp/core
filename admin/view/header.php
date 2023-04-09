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
            <input type="text" placeholder="Search..." name="search" class="form-control search-input">
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
              <li><a class="dropdown-item" href="<?php echo $this->location(); ?>">Sign In <i class="bi bi-arrow-right text-primary ms-2"></i><i class="bi bi-door-open text-primary"></i> </a></li>
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
</div><!--//app-header-inner-->