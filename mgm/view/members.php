<?php $this->view('head.php', null, CoreView::CORE); ?>
<div class="container p-3 flex-fill d-flex flex-column">
  <div class="row flex-fill d-flex flex-column">
    <div class="col-auto mt-3 border-bottom pb-4">
    <div class="d-flex flex-row align-items-end">
      <img src="<?php echo $this->asset('images/mgm.png'); ?>" style="width:180px;" alt="MGM: Media, Game, and Mobile Laboratory" />
      <?php $this->view('nav.php'); ?>
    </div>
    </div>
    <div class="display-5 pb-3 mt-3 text-primary">Lab Members</div>
    <h3 class="h4">Aryo Pinandito, ST, M.MT, Ph.D.<br><small class="text-secondary">Head of Laboratory</small></h3>
    <p>
      He have strong knowledge and expertise in web and mobile application development especially in Unix/Linux platform using Apache-PHP-MySQL and Google Android platform. He also fluent in most industrial standard programming language such as Java, Javascript, C, and C#. He have been experiencing in several mobile and web application development. Hence, strong interest in mobile and web application development and/or its implementation among other fields.
    </p>
    <h3 class="h4">Agi Putra Kharisma, ST, MT<br><small class="text-secondary">Vice Head of Laboratory</small></h3>
    <h3 class="h4">Dr.Eng. Ir. Herman Tolle, ST, MT<br><small class="text-secondary">Head of MGM Research Group</small></h3>

    <h2 class="display-6 text-primary mt-5">Master's Students</h2>

    <h2 class="display-6 text-primary mt-5">Undergraduate Students</h2>

    <h2 class="display-6 text-primary mt-5">Former Members and Current Affiliations</h2>

    <div class="fs-4">Master's Students</div>
    <div class="fs-4">Undergraduate Students</div>
    <div class="fs-4">Fellow Members</div>

  </div>
  <?php echo $this->view('footer.php'); ?>
</div>

<?php $this->view('foot.php', null, CoreView::CORE);