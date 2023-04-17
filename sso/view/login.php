<?php echo $this->view('head.php', null, CoreView::CORE); ?>
<div class="pt-5 flex-grow-1 d-flex flex-column align-items-stretch">

  <div class="app-content pt-3 p-md-3 p-lg-4 d-flex">
    <div class="container-xl mt-3 d-flex flex-grow-1 flex-column">

    <h1 class="app-page-title pb-4 mb-4" style="color: #1571a3; border-bottom: 1px solid #e7e9ed;"><div class="app-icon-holder d-inline me-2 p-2" style="background-color: #edf7fd; border-radius: 50%;"><i class="bi bi-key-fill d-inline-block text-center" style="width: 28px; height: 28px;"></i></div> SignIn</h1>

    <?php if(isset($_GET['e'])) : ?>
    <div class="col-md-4 alert alert-danger mx-auto">
      <i class="bi bi-exclamation-triangle"></i> <?php 
        switch($_GET['e']) {
          case 1 : echo "Invalid username and/or password."; break;
          case 2 : echo "SSO token generation error."; break;
          default : echo "Unknown error.";
        }; ?>
    </div>
    <?php endif; ?>
    
    <div class="text-center row">
      <main class="form-signin col-md-6 col-xs-12 mx-auto" style="max-width: 300px;">
        <form id="form-sign-in" action="<?php echo $this->location('home/signIn'); ?>" method="post">
          <input type="hidden" id="redirect" name="redirect" value="<?php echo $_GET['redirect'] ?? $this->location('admin', CoreView::APP); ?>" />
          <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
          <div class="form-floating">
            <input type="text" name="username" class="form-control" id="input-username" placeholder="User ID" autocomplete="new-password" value="<?php echo $_COOKIE['username'] ?? ""; ?>">
            <label for="input-username">User ID</label>
          </div>
          <div class="form-floating mt-2">
            <input type="password" name="password" class="form-control" id="input-password" autocomplete="new-password" placeholder="Password" value="">
            <label for="input-password">Password</label>
          </div>
          <div class="checkbox my-3">
            <label>
              <input type="checkbox" name="remember" value="true" <?php echo isset($_COOKIE['username']) ? "checked" : ""; ?>> Remember my User ID
            </label>
          </div>
          <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
          <p class="mt-5 mb-3 text-muted">&copy; 2017–<?php echo date('Y'); ?></p>
        </form>
      </main>
    </div>
    </div> <!--//container-fluid-->
  </div> <!--//app-content-->

  <?php //$this->view('attribution.php'); ?>
</div> <!--//app-wrapper-->
<?php echo $this->view('foot.php', null, CoreView::CORE); ?>