<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");


ini_set('display_errors', 1);

$servername = "localhost";
$user = "root";
$pword = "";
$dbname = "acomodo";




if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $checkIn = $_GET["checkInDate"];
    $checkOut = $_GET["checkOutDate"];
    $nrGuests = $_GET["numberOfPeople"];
    

    $conn = new mysqli($servername, $user, $pword, $dbname);
    if ($conn->connect_error) {
        die("Failed to connect");
    }

    $response = new stdClass();

    $stmt = $conn->prepare("SELECT room_number FROM dristor_rooms, room_type WHERE 
    (NOT room_number = ANY 
    (SELECT room_number FROM reservation WHERE (? < check_out_date) AND (check_in_date < ?)))
    AND dristor_rooms.type_id = room_type.type_id
    AND capacity >= ?");
    $stmt -> bind_param("ssi", $checkIn, $checkOut, $nrGuests);
    $stmt->execute();
    $result = $stmt->get_result();

    // echo $result->num_rows;
    $response->available = $result->num_rows;

    echo "\n";
    
    //Getting cheapest

    $stmt = $conn->prepare("SELECT price FROM room_type WHERE capacity >= ? AND type_id = ANY (SELECT type_id FROM dristor_rooms) ORDER BY price LIMIT 1;");
    $stmt->bind_param("i", $nrGuests);
    $stmt->execute();
    $result = $stmt->get_result();

    // echo $result->fetch_assoc()["price"];
    $response->cheapest = $result->fetch_assoc()["price"];

    echo json_encode($response);

    

    // while ($row = $result->fetch_assoc()) {
    //     echo $row["room_number"] . "\n";
    // }
}

