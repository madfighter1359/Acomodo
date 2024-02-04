<?php
require __DIR__ . "/inc/bootstrap.php";
header("Content-Type: application/json");
mysqli_report(MYSQLI_REPORT_OFF);
ini_set('display_errors', 1);
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// $uri = explode('/', $uri);
// if ((isset($uri[3]) && $uri[3] != 'search') || !isset($uri[4])) {
//     http_response_code(404);
//     exit();
// }

switch ($uri) {
    case '/backend/acomodo/search':
        require PROJECT_ROOT_PATH . "/Controller/Api/SearchController.php";
        $objFeedController = new SearchController();
        $objFeedController->searchAction();
        break;
    case '/backend/acomodo/book':
        require PROJECT_ROOT_PATH . "/Controller/Api/BookingController.php";
        $objFeedController = new BookingController();
        $objFeedController->bookAction();
        break;
    default:
        http_response_code(404);
        exit();

}

// require PROJECT_ROOT_PATH . "/Controller/Api/SearchController.php";
// $objFeedController = new SearchController();
// $strMethodName = $uri[4] . 'Action';
// $objFeedController->{$strMethodName}();
