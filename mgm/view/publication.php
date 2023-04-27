<?php $this->view('head.php', null, CoreView::CORE); ?>
<div class="container p-3 flex-fill d-flex flex-column">
  <div class="row flex-fill d-flex flex-column">
    <div class="col-auto mt-3 border-bottom pb-4">
    <div class="d-flex flex-row align-items-end">
      <img src="<?php echo $this->asset('images/mgm.png'); ?>" style="width:180px;" alt="MGM: Media, Game, and Mobile Laboratory" />
      <?php $this->view('nav.php'); ?>
    </div>
    </div>
    <div class="display-5 pb-3 mt-3 text-primary">Publication</div>
    <div class="display-6 pb-3 mt-3">Journal Articles</div>
    <hr>
    <div class="col-md-12 col-lg-9">
    <?php usort($bib, function($a, $b) {
              return $b['year'] <=> $a['year'];
          });
    ?>
    <?php foreach($bib as $b) {
      if ($b['type'] != 'article') continue;
      // var_dump($b);
      echo '<p style="padding-left: 1.5em; text-indent:-1.5em;">';
      echo '<span> '. $b['author'].' </span>';
      echo '<span> '. ($b['year'] ?? '').'. </span>';
      echo '<span> <em>'. $b['title'].'.</em> </span>';
      echo '<span> '. $b['journal'].'. </span>';
      echo '<span> '. (isset($b['volume']) && !empty($b['volume']) ? 'Vol.' . $b['volume'] : '').(isset($b['number']) && !empty($b['number']) ? '('.$b['number'].')' : ''). '. </span>';
      echo '<span> '. (isset($b['publisher']) ? '' . $b['publisher'] . '.' : '') .' </span>';
      echo '<span> '. (isset($b['pages']) ? 'pp. ' . $b['pages'] . '.' : '') .' </span>';
      echo '<span> '. (isset($b['doi']) ? 'doi:<a href="https://dx.doi.org/' . $b['doi'] . '">' . $b['doi'] . '</a>' : '') .' </span>';
      echo '<span> '. (isset($b['ee']) ? 'URL: <a href="'.$b['ee'].'">' . $b['ee'] . '</a>' : '') .' </span>';
      echo '<span> '. (isset($b['bibsource']) ? 'URL: ' . $b['bibsource'] : '') .' </span>';
      echo '<span> '. (isset($b['url']) ? 'URL: <a href="'.$b['url'].'">' . $b['url'] . '</a>' : '') .' </span>';
      echo '</p>';
    }
    ?>
    </div>
    <div class="display-6 pb-3 mt-3">Conference Proceedings</div>
    <hr>
    <div class="col-md-12 col-lg-9">
    <?php foreach($bib as $b) {
      if ($b['type'] != 'inproceedings' || $b['type'] == 'incollection') continue;
      echo '<p style="padding-left: 1.5em; text-indent:-1.5em;">';
      echo '<span> '. $b['author'].' </span>';
      echo '<span> '. ($b['year'] ?? '').'. </span>';
      echo '<span> <em>'. $b['title'].'.</em> </span>';
      echo '<span> '. (isset($b['booktitle']) ? $b['booktitle'] . '.' : '').' </span>';
      echo '<span> '. (isset($b['volume']) && !empty($b['volume']) ? 'Vol.' . $b['volume'] : '').(isset($b['number']) && !empty($b['number']) ? '('.$b['number'].')' : ''). '. </span>';
      echo '<span> '. (isset($b['publisher']) ? '' . $b['publisher'] . '.' : '') .' </span>';
      echo '<span> '. (isset($b['pages']) ? 'pp. ' . $b['pages'] . '.' : '') .' </span>';
      echo '<span> '. (isset($b['doi']) ? 'doi:<a href="https://dx.doi.org/' . $b['doi'].'">' . $b['doi'] . '</a>' : '') .' </span>';
      echo '<span> '. (isset($b['ee']) ? 'URL: <a href="'.$b['ee'].'">' . $b['ee'] . '</a>' : '') .' </span>';
      echo '<span> '. (isset($b['bibsource']) ? 'URL: <a href="'.$b['bibsource'].'">' . $b['bibsource'] . '</a>' : '') .' </span>';
      echo '<span> '. (isset($b['url']) ? 'URL: <a href="'.$b['url'].'">' . $b['url'] . '</a>' : '') .' </span>';
      echo '</p>';
    }
    ?>
    </div>
    <div class="display-6 pb-3 mt-3">Books</div>
    <hr>
    <div class="w-75">
    <?php foreach($bib as $b) {
      if ($b['type'] != 'book') continue;
      echo '<p style="padding-left: 1.5em; text-indent:-1.5em;">';
      echo '<span> '. (isset($b['author']) ? $b['author'] : 'anonymous') . '. </span>';
      echo '<span> '. ($b['year'] ?? '').'. </span>';
      echo '<span> <em>'. $b['title'].'.</em> </span>';
      echo '<span> '. (isset($b['booktitle']) ? $b['booktitle'] . '.' : '').' </span>';
      echo '<span> '. (isset($b['publisher']) ? '' . $b['publisher'] . '.' : '') .' </span>';
      echo '<span> '. (isset($b['pages']) ? 'pp. ' . $b['pages'] . '.' : '') .' </span>';
      echo '<span> '. (isset($b['doi']) ? 'DOI:' . $b['doi'] : '') .' </span>';
      echo '<span> '. (isset($b['ee']) ? 'URL: ' . $b['ee'] : '') .' </span>';
      echo '<span> '. (isset($b['bibsource']) ? 'URL: ' . $b['bibsource'] : '') .' </span>';
      echo '</p>';
    }
    ?>
    </div>
    <?php //var_dump($bib); ?>
    <!-- <div class="col-auto my-5">
      <a href="<?php echo $this->location('../admin'); ?>" type="button" class="btn btn-lg btn-secondary">Enter &rsaquo;</a>
    </div> -->
  </div>
  <?php echo $this->view('footer.php'); ?>
</div>

<?php $this->view('foot.php', null, CoreView::CORE);