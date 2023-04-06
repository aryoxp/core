<div class="app-content pt-3 p-md-3 p-lg-4 d-flex flex-grow-1">
  <div class="container-xl mt-3 d-flex flex-grow-1 flex-column">


  <h1 class="app-page-title pb-4 mb-4" style="color: #1571a3; border-bottom: 1px solid #e7e9ed;"><div class="app-icon-holder d-inline me-2 p-2" style="background-color: #edf7fd; border-radius: 50%;"><i class="bi bi-hammer d-inline-block text-center" style="width: 28px; height: 28px;"></i></div> Setup</h1>

  <?php if(isset($error)) : ?>
  <div class="alert alert-danger"><strong>Error:</strong> <?php echo $error; ?></div>
  <div>
    <p>Resolve the above error message to continue.</p>
  </div>
  <?php else : ?>

  <div class="col">
    <p>You're ready to setup! <br>Click the Setup button to begin the setup process.</p>
    <button type="button" class="btn btn-primary btn-setup">Setup</button>
  </div>


  <?php endif; ?>
  <?php $this->view('copyright.php'); ?>
  </div> <!--//container-fluid-->
</div> <!--//app-content-->