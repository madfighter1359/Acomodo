<?php
// include required dependencies (JWT decoder)
require "vendor/autoload.php";
define("PROJECT_ROOT_PATH", __DIR__ . "/..");

// include main configuration file
require_once PROJECT_ROOT_PATH . "/inc/config.php";

// include the use model files
require_once PROJECT_ROOT_PATH . "/Model/SearchModel.php";

require_once PROJECT_ROOT_PATH . "/Model/BookingModel.php";

require_once PROJECT_ROOT_PATH . "/Model/Validation.php";

require_once PROJECT_ROOT_PATH . "/Model/GuestModel.php";
