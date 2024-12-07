<?php $this->view('head.php', null, CoreView::CORE); ?>

<style>
body { 
  font-family: 'Fira Sans', Arial, Helvetica, sans-serif;
}
</style>

<div class="border-danger rounded bg-danger-subtle m-5 p-3 border-bottom shadow shadow-sm">
  <h3 class="text-danger">Server Error 401</h3>
  <span>Access to the requested page or resources is denied.</span>
</div>

<?php $this->view('foot.php', null, CoreView::CORE); ?>