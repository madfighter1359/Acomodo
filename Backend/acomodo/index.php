<?php
header("Access-Control-Allow-Headers: Authorization, *");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
require __DIR__ . "/inc/bootstrap.php";

function customError($preset, $msg = "", $code = 500)
{
    switch ($preset) {
        case "param":
            $code = 400;
            $msg = "Bad params";
            break;
        case "method":
            $code = 405;
            $msg = "Bad method";
            break;
        case "jwt":
            $code = 401;
            $msg = "Failed to authenticate";
            break;
        case "date":
            $code = 400;
            $msg = "Bad dates";
            break;
        case "guest":
            $code = 400;
            $msg = "Invalid guest count";
            break;
        case "unauthorized":
            $code = 403;
            $msg = "Forbidden";
            break;
        case "unauthenticated":
            $code = 401;
            $msg = "Unauthenticated";
            break;
        case "?":
            $code = 500;
            $msg = "Unkown error";
            break;
    }

    http_response_code($code);
    die(json_encode(["message" => $msg]));
}

function defaultError($errno, $errstr)
{
    customError("", $errstr);
}

set_error_handler("defaultError");

mysqli_report(MYSQLI_REPORT_OFF);
ini_set('display_errors', 1);
date_default_timezone_set("UTC");
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriArr = explode('/', $uri);
// var_dump($uriArr);

function resolveUrl($uriArr)
{
    if (isset($uriArr[1], $uriArr[2], $uriArr[3]) && $uriArr[1] == "backend" && $uriArr[2] == "acomodo") {
        switch ($uriArr[3]) {
            case "search":
                if (isset($uriArr[4])) {
                    switch ($uriArr[4]) {
                        case "details":
                            require PROJECT_ROOT_PATH . "/Controller/api/SearchController.php";
                            $objFeedController = new SearchController();
                            $objFeedController->specificSearch();
                            return true;

                    }
                    return false;
                } else {
                    require PROJECT_ROOT_PATH . "/Controller/api/SearchController.php";
                    $objFeedController = new SearchController();
                    $objFeedController->searchAction();
                    return true;
                }

            case "book":
                require PROJECT_ROOT_PATH . "/Controller/api/BookingController.php";
                $objFeedController = new BookingController();
                $objFeedController->bookAction();
                return true;
            case "signup":
                require PROJECT_ROOT_PATH . "/Controller/api/GuestController.php";
                $objFeedController = new GuestController();
                $objFeedController->newGuest();
                return true;
            case "guest":
                if (isset($uriArr[4])) {
                    switch ($uriArr[4]) {
                        case "bookings":
                            if (isset($uriArr[5])) {
                                if (isset($uriArr[6])) {
                                    switch ($uriArr[6]) {
                                        case "transaction":
                                            require PROJECT_ROOT_PATH . "/Controller/api/BookingController.php";
                                            $objFeedController = new BookingController();
                                            $objFeedController->getTransactionDetails($uriArr[5]);
                                            return true;
                                    }
                                    return false;
                                }
                                require PROJECT_ROOT_PATH . "/Controller/api/BookingController.php";
                                $objFeedController = new BookingController();
                                $objFeedController->getBookingDetails($uriArr[5]);
                                return true;
                            }
                            require PROJECT_ROOT_PATH . "/Controller/api/BookingController.php";
                            $objFeedController = new BookingController();
                            $objFeedController->getBookings();
                            return true;
                    }
                    return false;
                } else {
                    return false;
                }
        }
        return false;
    }
}

if (!resolveUrl($uriArr)) {
    http_response_code(404);
    exit();
}

// switch ($uri) {
//     case '/backend/acomodo/search':
//         require PROJECT_ROOT_PATH . "/Controller/api/SearchController.php";
//         $objFeedController = new SearchController();
//         $objFeedController->searchAction();
//         break;
//     //Could do /search/dri (loc id) instead of using param to make sleeker
//     case '/backend/acomodo/search/details':
//         require PROJECT_ROOT_PATH . "/Controller/api/SearchController.php";
//         $objFeedController = new SearchController();
//         $objFeedController->specificSearch();
//         break;
//     case '/backend/acomodo/book':
//         require PROJECT_ROOT_PATH . "/Controller/api/BookingController.php";
//         $objFeedController = new BookingController();
//         $objFeedController->bookAction();
//         break;
//     case '/backend/acomodo/signup':
//         require PROJECT_ROOT_PATH . "/Controller/api/GuestController.php";
//         $objFeedController = new GuestController();
//         $objFeedController->newGuest();
//         break;
//     case '/backend/acomodo/guest/bookings':
//         require PROJECT_ROOT_PATH . "/Controller/api/BookingController.php";
//         $objFeedController = new BookingController();
//         $objFeedController->getBookings();
//         break;
//     default:
//         http_response_code(404);
//         exit();

// }

// require PROJECT_ROOT_PATH . "/Controller/api/SearchController.php";
// $objFeedController = new SearchController();
// $strMethodName = $uri[4] . 'Action';
// $objFeedController->{$strMethodName}();
