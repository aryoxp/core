<?php $this->view('head.php', null, CoreView::CORE); // var_dump($modules); ?>
<?php $this->view('header.php'); ?>
<?php // $this->view('sidepanel.php'); ?>
<?php if (UAC::isSignedIn()) : ?>
<?php $this->view('dashboard.php'); ?>
<?php else : ?>
<?php $this->view('login.php', isset($error) ? array('error' => $error) : array()); ?>
<?php endif; ?>
<?php $this->view('footer.php'); ?>
<?php $this->viewPlugin('core-ui'); ?>
<?php $this->view('foot.php', null, CoreView::CORE); ?>