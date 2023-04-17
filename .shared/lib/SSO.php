<?php

class SSO {

  public static function authUrl($redirect = '') {
    $uri = Core::lib(Core::URI);
    return $uri->get(CoreUri::BASELINKURL) . 'sso?redirect=' . $redirect;
  }

  public static function verify($token, &$error = "") {
    $uri = Core::lib(Core::URI);
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, $uri->get(CoreUri::BASELINKURL) . 'sso/home/verify');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
    curl_setopt($ch, CURLOPT_POSTFIELDS, array('token' => $token));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $output = curl_exec($ch);
    if ($output === false) {
      $error = "Could not verify SSO credentials.";
      $result = $output;
    } else {
      try {
        $result = json_decode($output);
        $error = $result->coreError ?? null;
        $result = $result->coreResult ?? false;  
      } catch(Exception $e) {
        $error = "Invalid SSO response.";
        $result = false;
      }
    } 
    curl_close($ch);
    return $result;
  }
}