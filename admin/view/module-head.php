<?php
if (!isset($title)) 
  $title = ucfirst(CoreModule::part(CoreModule::CONTROLLERID)) . " &rsaquo; " 
  . ucfirst(CoreModule::part(CoreModule::METHOD));  
$this->view('head.php', array('title' => $title), CoreView::CORE); 
?>
<header class="app-header fixed-top">
  <?php $this->view('header.php', null, CoreModuleView::APP); ?>
  <?php $this->view('sidepanel.php', null, CoreModuleView::APP); ?>
</header> <!--//app-header-->
<div class="app-wrapper pt-5 flex-grow-1 d-flex align-items-stretch">

