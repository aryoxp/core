<?php

class SampleService extends CoreService {
  public function doService() {
    $db = self::instance('_example');
    var_dump($db);
    $qb = QB::instance('table1 t1')
     ->innerJoin('table2 t2', array('t1.a' => 't2.a', 't1.b' => 't2.b'));
    echo $qb->get();
  }
}