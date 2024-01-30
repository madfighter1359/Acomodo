<?php
ini_set('display_errors', 0);

header("Content-Type: application/json");

function customError($errno, $errstr) {
    die(json_encode(["message"=>"Error: $errstr", "code"=>$errno]));
} 

set_error_handler("customError");


$response = new stdClass();
$response->message = "Success";
if (!isset($_POST["req"]) || $_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(400);
    // die("{\"message\": \"Incorrect method or parameters\"}");
    // die(json_encode(["message"=>"Incorrect method or parameters"]));
    trigger_error("Incorrect method or parameters",E_USER_ERROR);
    // die();
}


// if ($_POST["req"] == 1) {
//     try {
//         $conn = new mysqli("localhost", "root", "", "testy");
//     }
//     catch (Exception $e) {
//         die(json_encode(["message"=>"Error connecting to database: $e"]));
//     }
// }

mysqli_report(MYSQLI_REPORT_OFF);
$mysqli = new mysqli('localhost', 'fake_user', 'wrong_password', 'does_not_exist');
if ($mysqli->connect_error) {
    /* Use your preferred error logging method here */
    http_response_code(500);
    die(json_encode(["message"=>"Error connecting to database: $mysqli->connect_error", "code"=>$mysqli->connect_errno]));
}

echo json_encode($response);