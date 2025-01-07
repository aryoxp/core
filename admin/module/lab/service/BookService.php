<?php

class BookService extends CoreService {

  public function search($keyword, $filter = "", $page = 1,
  $perpage=100, $sort) {
    $path = CORE_ROOT_PATH . "../.file/books";
    $books = array_diff(scandir($path), array('.', '..'));
    sort($books);
    $books = array_filter($books, function($b) use($keyword) {
      if(!$keyword) return true;
      return str_contains(strtolower($b), strtolower($keyword));
    });
    $count = count($books);
    $offset = ($page - 1) * $perpage;
    $books = array_slice( $books, $offset, $perpage );
    $result = new stdClass;
    $result->book = $books;
    $result->count = $count;
    return $result;
  }

}
