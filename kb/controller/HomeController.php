<?php

class HomeController extends CoreController {
  
  function index($mapid = null) {
    // Core::lib(Core::CONFIG)->set('seq', $seq ?? 0, CoreConfig::CONFIG_TYPE_CLIENT);
    $this->ui->useCoreLib('core-ui');
    // $this->ui->useCoreClients();
    $this->ui->usePlugin('core-runtime');
    $this->ui->usePlugin('kitbuild-ui', 
      'kitbuild', 'kitbuild-analyzer', 'kitbuild-collab', 'kitbuild-logger', 
      'general-ui', 'highlight', 'showdown', 'pdfjs');
    $this->ui->useScript("recompose.js");
    $this->ui->useScript("recompose.timer.js");
    $this->ui->useScript("recompose.reftool.js");
    $this->ui->useScript("recompose.pdfapp.js");
    $this->ui->useStyle("recompose.css");

    $configlib = Core::lib(Core::CONFIG); 

    $host = $configlib->get('collabhost');
    $port = $configlib->get('collabport');
    $enablecollab = $configlib->get('enablecollab');

    $configlib->set('mapid', $mapid, CoreConfig::CONFIG_TYPE_CLIENT);
    $configlib->set('collabhost', $host, CoreConfig::CONFIG_TYPE_CLIENT);
    $configlib->set('collabport', $port, CoreConfig::CONFIG_TYPE_CLIENT);
    $configlib->set('enablecollab', $enablecollab, CoreConfig::CONFIG_TYPE_CLIENT);
    
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->view("recompose.php", array(
      'conceptMap' => $kit ?? null, 
      'conceptMapId' => $mapid,
      'conceptMapUrl' => $mapid ? $this->location('mapApi/get/'.$mapid) : null
    ));
    $this->ui->viewPlugin("general-ui", null);
    $this->ui->view('foot.php', null, CoreView::CORE);
  }

  function manage() {
    $this->ui->useCoreLib('core-ui');
    $this->ui->usePlugin('core-runtime');
    $this->ui->usePlugin('general-ui', 'kitbuild-collab-manager', 'dragula');
    $this->ui->useScript("manage.js");
    $this->ui->useStyle("manage.css");

    $configlib = Core::lib(Core::CONFIG); 

    $host = $configlib->get('collabhost');
    $port = $configlib->get('collabport');

    $configlib->set('collabhost', $host, CoreConfig::CONFIG_TYPE_CLIENT);
    $configlib->set('collabport', $port, CoreConfig::CONFIG_TYPE_CLIENT);
    
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->view("manage.php");
    $this->ui->viewPlugin("general-ui", null);
    $this->ui->view('foot.php', null, CoreView::CORE);
  }

  function test() {
    $this->ui->useCoreLib('core-ui');
    $this->ui->usePlugin('pdfjs');
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->view('test.php');
    // $this->ui->view("recompose.php", array(
    //   'conceptMap' => $kit, 
    //   'conceptMapId' => $mapid,
    //   'conceptMapUrl' => $mapid ? $this->location('mapApi/get/'.$mapid) : null
    // ));
    // $this->ui->viewPlugin("general-ui", null);
    $this->ui->view('foot.php', null, CoreView::CORE);
  }

}