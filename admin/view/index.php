<?php $this->view('head.php', null, CoreView::CORE); // var_dump($modules); ?>
<header class="app-header fixed-top">
  <?php $this->view('header.php'); ?>
  <?php $this->view('sidepanel.php'); ?>
</header> <!--//app-header-->
<?php if (UAC::isSignedIn()) : ?>
<?php $this->view('dashboard.php'); ?>
<?php else : ?>
<?php $this->view('login.php'); ?>
<?php endif; ?>
<?php $this->viewPlugin('core-ui'); ?>
<?php $this->view('foot.php', null, CoreView::CORE); ?>