<div class="app-wrapper pt-5 flex-grow-1 d-flex flex-column align-items-stretch">

  <div class="app-content pt-3 p-md-3 p-lg-4 d-flex">
    <div class="container-xl mt-3 d-flex flex-grow-1 flex-column">

    <h1 class="app-page-title pb-4 mb-4" style="color: #1571a3; border-bottom: 1px solid #e7e9ed;"><div class="app-icon-holder d-inline me-2 p-2" style="background-color: #edf7fd; border-radius: 50%;"><i class="bi bi-key-fill d-inline-block text-center" style="width: 28px; height: 28px;"></i></div> SignIn</h1>

    <?php if (isset($error)) : ?>
      <div class="alert alert-danger"><?php echo $error; ?></div>
    <?php endif; ?>

    <p>Please sign-in to access this page.
      <a class="btn btn-sm btn-outline-primary border ms-2" href="<?php echo SSO::authUrl($this->location()); ?>">Sign In <i class="bi bi-arrow-right ms-2"></i><i class="bi bi-door-open"></i> </a>
    </p>

</div> <!--//app-wrapper-->