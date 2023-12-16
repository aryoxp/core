<?php

class MtaDataApiController extends CoreModuleApiController {
  public function test($limit = 1) {
    $data = new stdClass;
    $dataService = new DataService();
    $data->startTime = hrtime(true);
    $data->result = json_encode($dataService->getPoints($limit));
    $data->length = strlen($data->result);
    $data->endTime = hrtime(true);
    $data->duration = ($data->endTime - $data->startTime)/1e+6;
    CoreResult::instance($data)->show();
  }
  public function testCompressed($limit = 1) {
    $data = new stdClass;
    $dataService = new DataService();
    $data->startTime = hrtime(true);
    $data->result = CoreApi::compress(json_encode($dataService->getPoints($limit)));
    $data->length = strlen($data->result);
    $data->endTime = hrtime(true);
    $data->duration = ($data->endTime - $data->startTime)/1e+6;
    CoreResult::instance($data)->show();
  }

  public function testAll($limit = 1) {
    $data = new stdClass;
    $dataService = new DataService();
    $data->startTime = hrtime(true);
    $points = $dataService->getPoints($limit);
    $data->mem = memory_get_usage();
    $data->dbTime = hrtime(true);
    $encoded = json_encode($points);
    $data->memJson = memory_get_usage();
    $data->encodeTime = hrtime(true);
    $result = CoreApi::compress($encoded);
    $data->compressTime = hrtime(true);
    $data->memCompressed = memory_get_usage();
    $data->encoded = $encoded;
    $data->compressed = $result;
    $data->lengthJson = strlen($encoded);
    $data->lengthCompressed = strlen($result);
    $data->durationJson = ($data->encodeTime - $data->startTime)/1e+6;
    $data->durationCompressing = ($data->compressTime - $data->encodeTime)/1e+6;
    $data->memCompressing = $data->memCompressed - $data->memJson;
    CoreResult::instance($data)->show();
  }

  public function getAllData() {
    try {
      $dataService = new DataService();
      $result = $dataService->dump();
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
}