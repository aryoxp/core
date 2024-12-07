<?php

class WadmGeneralApiController extends CoreApi {

  public function listAgama() {
    try {
      $generalService = new GeneralService();
      $result = $generalService->listAgama();
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function listPropinsi() {
    try {
      $generalService = new GeneralService();
      $result = $generalService->listPropinsi();
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
  public function listKotaKabupaten($propinsi_id) {
    try {
      $generalService = new GeneralService();
      $result = $generalService->listKotaKabupaten($propinsi_id);
      CoreResult::instance($result)->show();    
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

}