<?php
class MtaLineApiController extends CoreApi {
  public function getLines() {
    $lineService = new LineService();
    try {
      $lines = $lineService->getLines();
      CoreResult::instance($lines)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function getLine($id) {
    $lineService = new LineService();
    try {
      $line = $lineService->getLine($id);
      CoreResult::instance($line)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function getInterchanges() {
    $lineService = new LineService();
    try {
      $interchanges = $lineService->getInterchanges();
      CoreResult::instance($interchanges)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function createInterchange($idpoint) {
    $icService = new InterchangeService();
    try {
      $result = $icService->create($idpoint);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function deleteInterchange() {
    $idinterchange = $this->postv('idinterchange');
    $points = $this->postv('points');
    // var_dump('A');
    // var_dump($idinterchange, $points);
    // exit;
    $icService = new InterchangeService();
    try {
      $result = $icService->deleteInterchange($idinterchange);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function addPointToInterchange($idpoint, $idinterchange) {
    $icService = new InterchangeService();
    try {
      $result = $icService->addPoint($idpoint, $idinterchange);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function removePointFromInterchange($idpoint, $idinterchange) {
    $icService = new InterchangeService();
    try {
      $result = $icService->removePoint($idpoint, $idinterchange);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function getNearbyLineIds($lat, $lng, $distance = 20) {
    $icService = new InterchangeService();
    try {
      $result = $icService->getNearbyLineIds($lat, $lng, $distance);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function markPointAsStop() {
    $stopService = new StopService();
    try {
      $idpoint = $this->postv('id', 0);
      $result = $stopService->setStop($idpoint);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function unmarkPointFromStop() {
    $stopService = new StopService();
    try {
      $idpoint = $this->postv('id', 0);
      $result = $stopService->setStop($idpoint, false);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function saveLine() {
    $idline = $this->postv('idline');
    $points = json_decode($this->postv('points', "[]"));
    $lineService = new LineService();
    try {
      $result = $lineService->saveLine($idline, $points);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function importGpx() {
    $xml = file_get_contents($_FILES['file']['tmp_name']);
    $json = simplexml_load_string($xml);
    CoreResult::instance($json)->json();
  }

  public function deleteLine() {
    $idline = $this->postv('idline');
    $lineService = new LineService();
    try {
      $result = $lineService->deleteLine($idline);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function updateLine() {
    $idline = $this->postv('idline');
    $name = $this->postv('name');
    $linecolor = $this->postv('linecolor', '#000000');
    $direction = $this->postv('direction');
    $enabled = $this->postv('enabled');
    $lineService = new LineService();
    try {
      $result = $lineService->updateLine($idline, $name, $linecolor, $direction, $enabled);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }

  public function createLine() {
    $name = $this->postv('name');
    $linecolor = $this->postv('linecolor', '#555555');
    $direction = $this->postv('direction');
    $enabled = $this->postv('enabled');
    $idlinetype = $this->postv('idlinetype', 1);
    $lineService = new LineService();
    try {
      $result = $lineService->createLine($name, $linecolor, $direction, $idlinetype, $enabled);
      CoreResult::instance($result)->json();
    } catch(Exception $e) {
      CoreError::instance($e->getMessage())->show();
    }
  }
}