<?php

class AnalyzerService extends CoreService {

  function getSessions() {
    try {
      $db = self::instance();    
      $qb = QB::instance('log');
      $qb->select('sessid')
        ->distinct()
        ->groupBy('sessid');
      $result = $db->query($qb->get());
      return $result;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function getSessionsOfConceptMap($cmid) {
    try {
      $db = self::instance();    
      $sql = "SELECT id, tstampc, userid, cmid, kid, sessid, action, canvasid, seq, data, tstamp, rn, etstamp, duration FROM (
              SELECT *, 
                LEAD(tstamp, 1) OVER (ORDER BY sessid, tstamp) AS etstamp, 
                CAST(TIMESTAMPDIFF(MICROSECOND, tstamp, LEAD(tstamp, 1) OVER (ORDER BY sessid, tstamp))/1000000 AS SIGNED) AS duration
              FROM (
                WITH t AS
                (
                  (
                    SELECT * FROM (
                      SELECT *, ROW_NUMBER() OVER(PARTITION BY sessid) rn
                      FROM log
                    ) t WHERE rn = 1 AND action = 'open-kit' AND cmid = '".QB::esc($cmid)."' ORDER BY tstamp
                  ) UNION (
                    SELECT * FROM (
                      SELECT *, ROW_NUMBER() OVER(PARTITION BY sessid ORDER BY tstamp DESC) rn
                      FROM log
                    ) t WHERE rn = 1 AND cmid = '".QB::esc($cmid)."' ORDER BY tstamp
                  )
                )
                SELECT * FROM t ORDER BY id
              ) y
            ) x WHERE duration > 0;";
      // echo $sql;
      $result = $db->query($sql);
      return $result;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function getSessionsOfKit($id) {
    try {
      $db = self::instance();    
      $qb = QB::instance('log');
      $qb->select()
        ->distinct()
        ->where('kid', QB::esc($id));
      $result = $db->query($qb->get());
      return $result;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

  function getSessionLogs($sessid) {
    try {
      $db = self::instance();    
      $qb = QB::instance('log');
      $qb->select()
        ->where('sessid', QB::esc($sessid))
        ->orderBy('tstamp');
      $result = $db->query($qb->get());
      return $result;
    } catch (Exception $ex) {
      throw CoreError::instance($ex->getMessage());
    }
  }

}