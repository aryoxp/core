<?php

class HomeController extends CoreController {
  
  function index($mapid = null) {
    // $host = Core::lib(Core::CONFIG)->get('default_collab_host');
    // $port = Core::lib(Core::CONFIG)->get('default_collab_port');
    // Core::lib(Core::CONFIG)->set('collabhost', $host, CoreConfig::CONFIG_TYPE_CLIENT);
    // Core::lib(Core::CONFIG)->set('collabport', $port, CoreConfig::CONFIG_TYPE_CLIENT);
    // Core::lib(Core::CONFIG)->set('seq', $seq ?? 0, CoreConfig::CONFIG_TYPE_CLIENT);
    $this->ui->useCoreLib('core-ui');
    // $this->ui->useCoreClients();
    $this->ui->usePlugin('core-runtime');
    $this->ui->usePlugin('kitbuild-ui', 'kitbuild', 'kitbuild-analyzer', 'kitbuild-logger', 'kitbuild-collab', 'general-ui', 'highlight', 'showdown');
    $this->ui->useScript("recompose.js");
    $this->ui->useStyle("recompose.css");

    $kit = null;
    // if ($mapid) {
    //   try {
    //     $service = new KitService();
    //     $kit = $service->open($mapid);
    //   } catch(Exception $e) {}
    // }
    // Core::lib(Core::CONFIG)->set('conceptmap', $kit ? CoreApi::compress($kit->mapdata) : null, CoreConfig::CONFIG_TYPE_CLIENT);
    Core::lib(Core::CONFIG)->set('mapid', $mapid, CoreConfig::CONFIG_TYPE_CLIENT);
    
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->view("recompose.php", array(
      'conceptMap' => $kit, 
      'conceptMapId' => $mapid,
      'conceptMapUrl' => $mapid ? $this->location('mapApi/get/'.$mapid) : null
    ));
    $this->ui->viewPlugin("general-ui", null);
    $this->ui->view('foot.php', null, CoreView::CORE);
  }

}