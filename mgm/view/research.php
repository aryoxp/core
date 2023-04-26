<?php $this->view('head.php', null, CoreView::CORE); ?>
<div class="container p-3 flex-fill d-flex flex-column">
  <div class="flex-fill d-flex flex-column">
    <div class="col-auto mt-3 border-bottom pb-4">
    <div class="d-flex flex-row align-items-end">
      <img src="<?php echo $this->asset('images/mgm.png'); ?>" style="width:180px;" alt="MGM: Media, Game, and Mobile Laboratory" />
      <?php $this->view('nav.php'); ?>
    </div>
    </div>
    <div class="display-5 pb-3 mt-3 text-primary">Research</div>

    <p>Our lab research topic of interests includes, but not limited to:</p>
    <ul>
      <li>AI in Media technology</li>
      <li>Web and Mobile application development</li>
      <li>Game development, Game AI</li>
      <li>Social crowdsourcing</li>
      <li>UI/UX Research and Design</li>
      <li>System Integration and API</li>
    </ul>

    <div class="display-6 mt-5">On-going Research Projects</div>
    
  </div>
  <?php echo $this->view('footer.php'); ?>
</div>

<?php $this->view('foot.php', null, CoreView::CORE);