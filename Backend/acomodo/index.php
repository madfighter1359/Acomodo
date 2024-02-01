<?php
require __DIR__ . "/inc/bootstrap.php";
header("Content-Type: application/json");
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
if ((isset($uri[2]) && $uri[2] != 'search') || !isset($uri[3])) {
    http_response_code(404);
    exit();
}
require PROJECT_ROOT_PATH . "/Controller/Api/SearchController.php";
$objFeedController = new SearchController();
$strMethodName = $uri[3] . 'Action';
$objFeedController->{$strMethodName}();
