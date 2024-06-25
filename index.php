<?php 

/**
 * Core framework will treat that a given request 
 * will contain an app key
 */

define('CORE_ENV', 'mgm'); // alphanumeric value only
define('CORE_DIR', '.core');
define('CORE_MULTI_APPS', true);

/**
 * Direct to the framework core.php bootloader file.
 * Hence, the base URL of the web app will be this directory.
 */
$constant = 'constant';
require_once __DIR__ . "/{$constant('CORE_DIR')}/core.php";
