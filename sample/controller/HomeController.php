<?php
class HomeController extends CoreController {
  public function index() {
    $this->ui->useCoreLib();
    Core::lib(Core::CONFIG)->load('config.ini', 
      CoreConfig::CONFIG_FILE_TYPE_INI, 
      CoreConfig::CONFIG_TYPE_CLIENT);
    Core::lib(Core::CONFIG)->load('config.ini');
    echo Core::lib(Core::CONFIG)->get('name');
    echo Core::lib(Core::CONFIG)->get('age');
    // var_dump(Core::lib(Core::CONFIG)->dump());
    $this->ui->view('head.php', null, CoreView::CORE);
    $this->ui->useScript('script.js');
    echo "Hello World!<br>\n";
    // $this->ui->useScript('a.js', 'hehe');

    $uri = Core::lib(Core::URI);
    echo $uri->get(CoreUri::SCHEME), "<br>\n";
    echo $uri->get(CoreUri::HOST), "<br>\n";
    echo $uri->get(CoreUri::PORT), "<br>\n";
    echo $uri->get(CoreUri::SCRIPT), "<br>\n";
    echo $uri->get(CoreUri::QUERYSTRING), "<br>\n";
    echo $uri->get(CoreUri::PATHINFO), "<br>\n";
    echo $uri->get(CoreUri::BASEPATH), "<br>\n";
    echo $uri->get(CoreUri::BASEURL), "<br>\n";
    echo $uri->get(CoreUri::BASELINKURL), "<br>\n";
    echo $uri->get(CoreUri::BASEFILEURL), "<br>\n";
    echo $uri->get(CoreUri::APP), "<br>\n";
    echo $uri->get(CoreUri::CONTROLLER), "<br>\n";
    echo $uri->get(CoreUri::CONTROLLERID), "<br>\n";
    echo $uri->get(CoreUri::METHOD), "<br>\n";
    print_r($uri->get(CoreUri::ARGS)) . "<br>\n";
    echo $uri->get(CoreUri::URI), "<br>\n";


    $sv = new SampleService();
    $sv->doService();

    $this->ui->view('foot.php', null, CoreView::CORE);
  }
}
