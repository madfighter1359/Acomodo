<?php

// ini_set('display_errors', 0);

$servername = "localhost";
$user = "root";
$pword = "";
$dbname = "acomodo";

// try {
    $conn = new mysqli($servername, $user, $pword, $dbname);
    if ($conn->connect_error) {
        http_response_code(500);
        // die(json_encode(["message"=>"Error connecting to database: $conn->connect_error", "code"=>$conn->connect_errno]));
        die();
    }
// }
// catch (Exception $e) {
//     http_response_code(500);
//     die();
// }