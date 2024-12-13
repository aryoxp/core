<?php $this->view('head.php', null, CoreView::CORE); ?>
<?php $this->view('header.php'); ?>

<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3 class="border-bottom pb-3"><i class="bi bi-person-fill mx-2 text-primary"></i> 
      Profile</h3>
      <div class="row row-cols-2">
        <div class="col-2">Username</div> 
        <div class="col-10 text-danger"><?php echo $_SESSION['user']->username; ?></div>
        <div class="col-2">Name</div>
        <div class="col-10 text-primary"><?php echo $_SESSION['user']->name; ?></div>
      </div>
    </div>
  </div>
  

  <div class="row m-5">
    <div class="col">
    <h5 class="mb-3 pb-3 border-bottom">Change Password</h5>
    <form id="change-password">
      <input type="hidden" class="input-username" value="<?php echo $_SESSION['user']->username; ?>">
      <div class="form-group row mb-3">
        <label for="pass" class="col-4 col-form-label">Current Password</label> 
        <div class="col-8">
          <div class="input-group">
            <input id="pass" name="pass" placeholder="Password" type="password" class="input-current-pass form-control" aria-describedby="passHelpBlock"> 
            <div class="bt-hide-unhide btn btn-outline-secondary"><i class="bi bi-eye-fill"></i></div>
          </div>
          <span id="passHelpBlock" class="form-text text-muted">Enter your current password.</span>
        </div>
      </div>
      <div class="form-group row mb-3">
        <label for="pass" class="col-4 col-form-label">Password</label> 
        <div class="col-8">
          <div class="input-group">
            <input id="pass" name="pass" placeholder="Password" type="password" class="input-pass form-control" aria-describedby="passHelpBlock">
            <div class="bt-hide-unhide btn btn-outline-secondary"><i class="bi bi-eye-fill"></i></div>
          </div>
          <span id="passHelpBlock" class="form-text text-muted">Enter your new password.</span>
        </div>
      </div>
      <div class="form-group row mb-3">
        <label for="pass-again" class="col-4 col-form-label">Password (Again)</label> 
        <div class="col-8">
          <div class="input-group">
            <input id="pass-again" name="pass-again" placeholder="Password (Again)" type="password" class="input-pass-again form-control" aria-describedby="pass-againHelpBlock">
            <div class="bt-hide-unhide btn btn-outline-secondary"><i class="bi bi-eye-fill"></i></div>
          </div> 
          <span id="pass-againHelpBlock" class="form-text text-muted">Enter your password, again. This should match with the entered password above.</span>
        </div>
      </div> 
      <div class="form-group row">
        <div class="offset-4 col-8">
          <button name="submit" type="submit" class="btn btn-primary">Change Password</button>
        </div>
      </div>
    </form>
    </div>
  </div>

<?php $this->viewPlugin('core-ui'); ?>
<?php $this->view('foot.php', null, CoreView::CORE); ?>