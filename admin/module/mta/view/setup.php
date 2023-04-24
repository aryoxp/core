<div class="row">
  <div class="col p-5">
    <?php
      $sqlFile = CORE_MODULE_PATH . "file/routing.sql";
      if(file_exists($sqlFile) && is_readable($sqlFile)) {
        echo '<div class="alert alert-info">Ready for Setup.</div>';
      }
    ?>

    <select id="setup-select-dbkey" type="select" class="form-select" name="dbkey">
      <option value="">Select database configuration key...</option>
      <?php foreach($dbkeys as $key => $val) : ?>
      <option value="<?php echo $key; ?>"><?php echo $key; ?></option>
      <?php endforeach; ?>
    </select>

    <div id="setup-config" class="mt-5"></div>

    <div id="mta-controls" class="p-3 border-top">
      <button id="btn-begin-setup" class="btn btn-primary">Begin Setup</button>
    </div>
  </div>
</div>