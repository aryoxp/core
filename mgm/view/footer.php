<div class="row border-top pt-3 pb-3 mt-5">
  <div class="col-auto flex-fill d-flex justify-content-between">
    <span>
      <span class="d-block text-secondary" style="font-size: 1rem">
        <a class="text-decoration-none" href="<?php echo $this->location(); ?>">Home</a> &bull; 
        <a class="text-decoration-none" href="<?php echo $this->location('home/publication'); ?>">Publication</a> &bull; 
        <a class="text-decoration-none" href="<?php echo $this->location('home/members'); ?>">Members</a> &bull; 
        <a class="text-decoration-none" href="<?php echo $this->location('home/research'); ?>">Research</a> &bull;
        <a class="text-decoration-none" href="<?php echo $this->location('../admin'); ?>">Admin</a>
      </span>
      &copy; <?php echo date('Y'); ?> Media, Game, and Mobile Laboratory.<br>All rights reserved.
    </span>
    <span class="text-end">
      <a href="https://filkom.ub.ac.id">
      <img src="https://filkom.ub.ac.id/wp-content/uploads/2020/12/logo_filkom.png" height="36" />
      </a>
    </span>
  </div>
</div>