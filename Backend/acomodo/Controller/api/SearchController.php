<?php
class SearchController
{

    public function search()
    {
        // Checking request method
        if ($_SERVER["REQUEST_METHOD"] == "GET") {

            // Check that correct search parameters are set and retrieve them
            if (!isset($_GET["checkInDate"], $_GET["checkOutDate"], $_GET["numberOfPeople"])) {
                customError("param");
            }

            $checkIn = $_GET["checkInDate"];
            $checkOut = $_GET["checkOutDate"];
            $nrGuests = $_GET["numberOfPeople"];

            // Setting acceptable date range and checking that the dates fall within this and are valid
            $minDate = new DateTime('today');
            $maxDate = (new DateTime('today'))->modify('+1 year');

            if (!Validation::validDates($checkIn, $checkOut, $minDate, $maxDate, 16)) {
                customError("date");
            }

            // Checking that the guest count is valid
            if (!Validation::isNumberBetween($nrGuests, 1, 4)) {
                customError("guest");
            }

            //Create empty response object
            $response = new stdClass();

            $searchModel = new SearchModel();

            //Get every hotel location
            $locations = $searchModel->getLocationDetails();

            // Iterate through each location
            foreach ($locations as $row) {
                // Add results to response object
                $response->{$row["location_id"]} = new stdClass();
                $response->{$row["location_id"]}->locationName = $row["location_name"];
                $response->{$row["location_id"]}->area = $row["area"];
                $response->{$row["location_id"]}->image = $row["image"];

                // Use the search function with the current location and the passed params
                $details = $searchModel->searchLocation($checkIn, $checkOut, $nrGuests, strtolower($row["location_id"]));
                $details = $searchModel->getCheapestAndCount($details);

                // Add results to response object
                $response->{$row["location_id"]}->available = $details[0];
                $response->{$row["location_id"]}->cheapest = $details[1];
            }

            // Return response, formatted as JSON
            echo json_encode($response);

        }

    }

    public function specificSearch()
    {
        // Checking request method
        if ($_SERVER["REQUEST_METHOD"] == "GET") {

            // Check that correct search parameters are set and retrieve them
            if (!isset($_GET["checkInDate"], $_GET["checkOutDate"], $_GET["numberOfPeople"], $_GET["locationId"])) {
                customError("param");
            }
            $checkIn = $_GET["checkInDate"];
            $checkOut = $_GET["checkOutDate"];
            $nrGuests = $_GET["numberOfPeople"];
            $locationId = $_GET["locationId"];

            // Validate location id
            if (!in_array(strtolower($locationId), ["apa", "acm"])) {
                customError("param");
            }

            // Setting acceptable date range and checking that the dates fall within this and are valid
            $minDate = new DateTime('today');
            $maxDate = (new DateTime('today'))->modify('+1 year');

            if (!Validation::validDates($checkIn, $checkOut, $minDate, $maxDate, 16)) {
                customError("date");
            }

            // Checking that the guest count is valid
            if (!Validation::isNumberBetween($nrGuests, 1, 4)) {
                customError("guest");
            }

            //Create empty response object
            $response = new stdClass();

            $searchModel = new SearchModel();

            // Make the search with the passed location id
            $result = $searchModel->searchLocationDetailed($checkIn, $checkOut, $nrGuests, strtolower($locationId));

            foreach ($result as $row) {
                // Create empty object for the current room type
                $response->{$row["type_id"]} = new stdClass();

                // Store attributes of current room type in response object
                $response->{$row["type_id"]}->available = $row["count"];
                $response->{$row["type_id"]}->price = $row["price"];
                $response->{$row["type_id"]}->typeName = $row["type_name"];
                $response->{$row["type_id"]}->capacity = $row["capacity"];
                $response->{$row["type_id"]}->beds = $row["beds"];
                $response->{$row["type_id"]}->image = $row["image"];
            }

            //Return the response object in JSON format
            echo json_encode($response);

        }
    }
}
