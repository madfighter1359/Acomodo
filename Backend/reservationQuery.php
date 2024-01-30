<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");


ini_set('display_errors', 1);


function makeSearch($hotelName) {
    // Get global variables
    global $conn, $checkIn, $checkOut, $nrGuests;

    //Create and execute statement for hotel passed
    $stmt = $conn->prepare("SELECT room_number, price FROM " . $hotelName . "_rooms, room_type WHERE 
    (NOT room_number = ANY 
    (SELECT room_number FROM reservation WHERE (? < check_out_date) AND (check_in_date < ?)))
    AND " . $hotelName . "_rooms.type_id = room_type.type_id
    AND capacity >= ?;");
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
    if (!isset($_GET["checkInDate"],$_GET["checkOutDate"],$_GET["numberOfPeople"])) {
        http_response_code(400);
        die(json_encode(["message"=>"Bad parameters"]));
    }

    $checkIn = $_GET["checkInDate"];
    $checkOut = $_GET["checkOutDate"];
    $nrGuests = $_GET["numberOfPeople"];
    
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $checkIn) || !preg_match("/^\d{4}-\d{2}-\d{2}$/", $checkOut)) {
        http_response_code(400);
        die(json_encode(["message"=>"Invalid dates"]));
    }

    $minDate = new DateTime();
    $maxDate = (new DateTime())->modify('+1 year');

    if (DateTime::createFromFormat('Y-m-d', $checkIn) < $minDate || DateTime::createFromFormat('Y-m-d', $checkOut) > $maxDate || DateTime::createFromFormat('Y-m-d', $checkOut) <= DateTime::createFromFormat('Y-m-d', $checkIn)) {
        http_response_code(400);
        die(json_encode(["message"=>"Invalid dates"]));
    }

    //Connect to DB
    require("acomodoConnect.php");

    //Create empty response object
    $response = new stdClass();


    //Get every hotel location
    $stmt = "SELECT * FROM location";
    $result = $conn->query($stmt);

    // Iterate through each location
    foreach ($result as $row) {
        $response->{$row["location_id"]} = new stdClass();
        $response->{$row["location_id"]}->locationName = $row["location_name"];
        $response->{$row["location_id"]}->area = $row["area"];
        $response->{$row["location_id"]}->image = $row["image"];

        // Use the search function with the current location and the passed params
        $search = makeSearch(strtolower($row["location_id"]));

        // Add results to response object
        $response->{$row["location_id"]}->available = $search[0];
        $response->{$row["location_id"]}->cheapest = $search[1];
    }


    //Return the response object in JSON format
    echo json_encode($response);

}
else {
    http_response_code(405);
    die(json_encode(["message"=>"Bad method"]));
}

