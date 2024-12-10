<?php echo $this->view('head.php', null, CoreView::CORE); ?>
<div class="container d-flex flex-column align-items-stretch">

  <div class="mt-5 d-inline-flex flex-column">

    <!-- <h1 class="app-page-title pb-4 mb-4" style="color: #1571a3; border-bottom: 1px solid #e7e9ed;"><div class="app-icon-holder d-inline me-2 p-2" style="background-color: #edf7fd; border-radius: 50%;"><i class="bi bi-key-fill d-inline-block text-center" style="width: 28px; height: 28px;"></i></div> SignIn</h1> -->

    <?php if(isset($_GET['e'])) : ?>
    <div class="border border-secondary-subtle bg-secondary-subtle rounded rounded-3 p-3 px-4 m-3 mx-auto d-flex align-items-center text-secondary">
      <i class="bi bi-exclamation-triangle fs-4 me-3 text-danger"></i> <?php 
        switch($_GET['e']) {
          case 1 : echo "Invalid username and/or password."; break;
          case 2 : echo "SSO token generation error."; break;
          default : echo "Unknown error.";
        }; ?>
    </div>
    <?php endif; ?>
    
    <div class="text-center mt-3 bg-light border rounded p-3 mx-auto" style="min-width: 350px;">
      <div class="form-signin mx-auto px-3 mt-3">
        <form id="form-sign-in" action="<?php echo $this->location('home/signIn'); ?>" method="post">
          <input type="hidden" id="redirect" name="redirect" value="<?php echo $_GET['redirect'] ?? $this->location('admin', CoreView::APP); ?>" />
          <input type="hidden" id="url" name="url" value="<?php echo $_GET['url'] ?? ""; ?>" />
          <h1 class="h3 mb-3 fw-normal">Sign In</h1>
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
          <button class="w-100 btn btn-lg btn-primary" type="submit">Sign In</button>
          <span class="d-block mt-5 mb-3 text-muted">&copy; 2017–<?php echo date('Y'); ?><br>
          <small>Core Framework</small></span>
        </form>
      </div>
    </div>
  </div> <!--//app-content-->

  <?php //$this->view('attribution.php'); ?>
</div> <!--//app-wrapper-->
<?php echo $this->view('foot.php', null, CoreView::CORE); ?>