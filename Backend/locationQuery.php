<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");


ini_set('display_errors', 1);


function makeSearch($hotelName) {
    // Get global variables
    global $conn, $checkIn, $checkOut, $nrGuests;

    //Create and execute statement for hotel passed
    $stmt = $conn->prepare("SELECT count(room_type.type_id) as count, room_type.type_id as type_id, price, type_name, capacity FROM " . $hotelName . "_rooms, room_type WHERE 
    (NOT room_number = ANY 
    (SELECT room_number FROM reservation WHERE (? < check_out_date) AND (check_in_date < ?)))
    AND " . $hotelName . "_rooms.type_id = room_type.type_id
    AND capacity >= ? GROUP BY room_type.type_id;");
    $stmt -> bind_param("ssi", $checkIn, $checkOut, $nrGuests);
    $stmt->execute();
    $result = $stmt->get_result();

    return $result;
}


if ($_SERVER["REQUEST_METHOD"] == "GET") {

    //Retrieve search params
    $checkIn = $_GET["checkInDate"];
    $checkOut = $_GET["checkOutDate"];
    $nrGuests = $_GET["numberOfPeople"];
    $locationId = $_GET["locationId"];
    

    //Connect to DB
    require("acomodoConnect.php");

    //Create empty response object
    $response = new stdClass();

    // Make the search with the passed location id
    $result = makeSearch($locationId);

    foreach ($result as $row) {
        // Create empty object for the current room type
        $response->{$row["type_id"]} = new stdClass();

        // Store attributes of current room type in response object
        $response->{$row["type_id"]}->available = $row["count"];
        $response->{$row["type_id"]}->price = $row["price"];
        $response->{$row["type_id"]}->typeName = $row["type_name"];
        $response->{$row["type_id"]}->capacity = $row["capacity"];
    }


    //Return the response object in JSON format
    echo json_encode($response);

}

