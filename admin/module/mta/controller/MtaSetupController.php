<?php

class MtaSetupController extends CoreModuleController {
  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function index() {
    Core::lib(Core::CONFIG)->loadDatabaseConfig();
    $dbConfig = Core::lib(Core::CONFIG)->get('dbkeys', CoreConfig::CONFIG_TYPE_DB);
    $this->ui->useScript('js/setup.js');
    $this->menuId('mta-setup');
    $this->ui->view('setup.php', array('dbkeys' => $dbConfig), CoreModuleView::MODULE);
  }

  public function check($key = null) {

    if (empty($key)) return "<em>Select a database configuration key</em>";

    Core::lib(Core::CONFIG)->loadDatabaseConfig();
    $dbConfigs = Core::lib(Core::CONFIG)->get('dbkeys', CoreConfig::CONFIG_TYPE_DB);
    $dbConfig = $dbConfigs[$key] ?? array();

    $setup = new SetupService();
    $dbExists = $setup->checkDb($key);
    $tableCount = $setup->getTableCount($key);

    if ($dbExists) {
      echo '<div class="alert alert-success">Target database exists.</div>';
    } else echo '<div class="alert alert-danger">Target database not exists.</div>';

    if ($tableCount) {
      echo '<div class="alert alert-danger">Target database not empty.</div>';
    } else echo '<div class="alert alert-success">Target database is empty.</div>';

    if (count($dbConfig)) {
      echo '<table class="table">';
      foreach($dbConfig as $key => $item) {
        echo '<tr><td>'.$key.'</td><td>'.$item.'</td></tr>';
      }
      echo '</table>';
    } 

  }
}