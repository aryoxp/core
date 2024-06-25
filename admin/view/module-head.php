<?php
if (!isset($title)) 
  $title = ucfirst(CoreModule::part(CoreModule::CONTROLLERID)) . " &rsaquo; " 
  . ucfirst(CoreModule::part(CoreModule::METHOD));  
$this->view('head.php', array('title' => $title), CoreView::CORE); 
?>
<?php $this->view('header.php', array('title' => $title), CoreModuleView::APP); ?>
<!-- <div class="app-wrapper pt-5 mt-2 flex-grow-1 d-flex align-items-stretch flex-column"> -->

