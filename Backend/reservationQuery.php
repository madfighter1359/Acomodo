<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");


ini_set('display_errors', 1);

$servername = "localhost";
$user = "root";
$pword = "";
$dbname = "acomodo";


function makeSearch($hotelName) {
    global $conn, $checkIn, $checkOut, $nrGuests;

    //Create and execute statement for hotel passed
    $stmt = $conn->prepare("SELECT room_number, price FROM " . $hotelName . ", room_type WHERE 
    (NOT room_number = ANY 
    (SELECT room_number FROM reservation WHERE (? < check_out_date) AND (check_in_date < ?)))
    AND " . $hotelName . ".type_id = room_type.type_id
    AND capacity >= ?");
    $stmt -> bind_param("ssi", $checkIn, $checkOut, $nrGuests);
    $stmt->execute();
    $result = $stmt->get_result();
    $rooms = $result->fetch_all();

    //Find cheapest matching room
    $min = PHP_INT_MAX;
    foreach ($rooms as $room) {
        $min = min($min, $room[1]);
    }

    return [$result->num_rows, $min];
}


if ($_SERVER["REQUEST_METHOD"] == "GET") {

    //Retrieve search params
    $checkIn = $_GET["checkInDate"];
    $checkOut = $_GET["checkOutDate"];
    $nrGuests = $_GET["numberOfPeople"];
    

    //Connect to DB
    $conn = new mysqli($servername, $user, $pword, $dbname);
    if ($conn->connect_error) {
        die("Failed to connect");
    }

    //Create empty response object
    $response = new stdClass();


    //Get every hotel location
    $stmt = "SELECT * FROM location";
    $result = $conn->query($stmt);

    foreach ($result as $row) {
        $response->{$row["location_id"]} = new stdClass();
        $response->{$row["location_id"]}->locationName = $row["location_name"];
        $response->{$row["location_id"]}->area = $row["area"];
        $search = makeSearch($row["area"] . "_rooms");
        $response->{$row["location_id"]}->available = $search[0];
        $response->{$row["location_id"]}->cheapest = $search[1];
    }


    //Return the object in JSON format
    echo json_encode($response);

}

