<?php $this->view('head.php', null, CoreView::CORE); ?>
<header class="app-header fixed-top">
  <?php $this->view('header.php'); ?>
  <?php $this->view('sidepanel.php'); ?>
</header> <!--//app-header-->

<div class="app-wrapper pt-5 flex-grow-1 d-flex align-items-stretch">

  <div class="app-content pt-3 p-md-3 p-lg-4 d-flex flex-grow-1">
    <div class="container-xl mt-3 d-flex flex-grow-1 flex-column">

      <h1 class="app-page-title pb-4 mb-4" style="color: #1571a3; border-bottom: 1px solid #e7e9ed;"><div class="app-icon-holder d-inline me-2 p-2" style="background-color: #edf7fd; border-radius: 50%;"><i class="bi bi-book d-inline-block text-center" style="width: 28px; height: 28px;"></i></div> Core Framework Documentation</h1>

      <?php
      
        class Menu {
          public static function draw($menu, &$path, $ui) {
            foreach($menu as $key => $m) {
              if (is_array($m)) {
                if (!count($m)) continue;
                $path[] = $key;
                echo "<ul><code>" . $key . "</code>";
                Menu::draw($m, $path, $ui);
                echo "</ul>";
                array_pop($path);
              } else {
                echo '<li><a href="'.$ui->location("doc/view/" 
                  . (empty($path) ? "" : implode("/", $path) . '/') . $m).'">' . $m . '</a></li>';
              }
            }
          }
        }
        Menu::draw($contents, $path, $this);

        // var_dump($contents); 
      ?>
      <hr>
      <div class="row">
        <div class="col">
          <?php echo $file; ?>
        </div>
      </div>

    </div> <!--//container-fluid-->
  </div> <!--//app-content-->

  <?php $this->view('attribution.php'); ?>
</div> <!--//app-wrapper-->
<?php $this->viewPlugin('core-ui'); ?>
<?php $this->view('foot.php', null, CoreView::CORE); ?>