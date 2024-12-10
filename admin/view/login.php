<div class="row m-5">
  <div class="col">

    <h2 class="app-page-title pb-4 mb-4 border-bottom">
      <i class="bi bi-key-fill d-inline-block text-center text-primary bg-primary-subtle px-4 py-2 rounded border-primary me-3"></i>
      Sign In
    </h2>

    <?php if (isset($error)) : ?>
      <div class="alert alert-danger"><?php echo $error; ?></div>
    <?php endif; ?>

    <p>Please sign-in to access this page.</p>
    <a class="btn btn-lg btn-primary" href="<?php echo SSO::authUrl('/admin', $this->location()); ?>">Sign In <i class="bi bi-arrow-right ms-2"></i><i class="bi bi-door-open"></i> </a>

  </div>
</div> <!--//app-wrapper-->