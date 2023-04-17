<?php

class HomeController extends CoreController {

  public function index() {
    $this->ui->useCoreLib('core-ui', 'admin');
    $this->ui->useScript('js/dashboard.js'); 


    if (isset($_SESSION['user'])) {
      $this->ui->view('index.php');
      return;
    } else {

      $token = $this->getv('token');

      if ($token) {
        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_URL, $this->location('sso/home/verify', CoreView::APP));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
        curl_setopt($ch, CURLOPT_POSTFIELDS, array('token' => $token));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        // curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        //   'Content-Type:application/json',
        // ));
        $output = curl_exec($ch); 
        curl_close($ch);  
        // var_dump(curl_error($ch));
        $result = json_decode($output);
        $_SESSION['user'] = $result->coreResult;
  
        $this->ui->view('index.php');
      } else {
        $this->ui->view('index.php');
      }


    }
    // echo "N";
    // exit;
    
  }

  // public function signIn() {
  //   $username = $this->postv('username');
  //   $password = $this->postv('password');
  //   $redirect = $this->postv('redirect');
  //   $remember = $this->postv('remember', false);
    
  //   $_SESSION['user'] = $username.$password;
  //   $userdata = new stdClass;
  //   $userdata->username = $username;

  //   $ch = curl_init(); 
  //   curl_setopt($ch, CURLOPT_URL, "http://admin:password@localhost:5984/sso/_find");
  //   curl_setopt($ch, CURLOPT_POST, 1);
  //   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
  //   curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userdata));
  //   $output = curl_exec($ch); 
  //   curl_close($ch);  
  //   var_dump($output);
  //   exit;
  //   // return $output;
  //   if($remember)
  //     setcookie('username', $username, time() + 30 * 24 * 60 * 60, "/");
  //   else setcookie('username', $username, time() - 1, "/");
  //   header('location: ' . $redirect ?? $this->ui->location());
  //   exit;
  // }

  public function signOut() {
    session_destroy();
    header('location: ' . $this->ui->location());
    exit;
  }

}