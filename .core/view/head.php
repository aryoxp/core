<!DOCTYPE html>
<html lang="<?php echo isset($lang) ? $lang : "en"; ?>">
  <head>
    <meta charset="<?php echo isset($charset) ? $charset : "utf-8"; ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="<?php echo isset($description) ? $description : ""; ?>">
    <meta name="author" content="<?php echo isset($author) ? $author : ""; ?>">
<?php $this->metaConfig(); ?>
<?php $this->headStyle(); ?>
<?php $this->customHead(); ?>
    <link rel="icon" href="favicon.ico">
    <link href='https://fonts.googleapis.com/css?family=Fira+Sans' rel='stylesheet'>
    <title><?php echo isset($title) ? $title : str_replace("Controller", "", Core::lib(Core::URI)->get(CoreUri::CONTROLLER)) . " &rsaquo; " . ucfirst(Core::lib(Core::URI)->get(CoreUri::METHOD)); ?></title>
  </head>
  <body>
