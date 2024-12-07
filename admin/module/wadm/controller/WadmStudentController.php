<?php

class WadmStudentController extends CoreModuleController {

  public function preamble() {
    $this->ui->useCoreLib('core-ui', 'admin');
  }

  public function index() {
    $this->menuId('wadm-mahasiswa');
    $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
    $this->ui->useScript('js/student.js');
    $this->ui->view('student.php', null, CoreModuleView::MODULE);
  }

  public function register() {
    $this->menuId('wadm-student-register');
    $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
    $this->ui->useScript('js/register.js');
    $this->ui->view('student-register.php', null, CoreModuleView::MODULE);
  }

  public function editbio($nrm = null) {
    $service = new MahasiswaService();
    $mahasiswa = $service->getMahasiswa($nrm);
    $this->menuId('wadm-mahasiswa');
    $this->ui->usePlugin('general-ui', 'bootstrap-datepicker');
    $this->ui->useScript('js/student-edit.js');
    $this->ui->view('student-edit.php', ['mahasiswa'=>$mahasiswa], CoreModuleView::MODULE);
  }

  public function test() {
    $this->ui->view('test.php', null, CoreModuleView::MODULE);
  }

}