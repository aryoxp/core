<?php

class UAC {
  public static function isSignedIn() {
    return (isset($_SESSION['user'])); 
  }
}