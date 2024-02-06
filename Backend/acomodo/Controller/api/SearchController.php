<?php
class SearchController extends BaseController
{
    /**
     * "/user/list" Endpoint - Get list of users
     */
    public function searchAction()
    {
        // $strErrorDesc = '';
        // $requestMethod = $_SERVER["REQUEST_METHOD"];
        // if (strtoupper($requestMethod) == 'GET') {
        //     try {
        //         $searchModel = new SearchModel();
        //         if (!isset($_GET["checkInDate"], $_GET["checkOutDate"], $_GET["numberOfPeople"])) {
        //             $strErrorDesc = 'Bad params';
        //             http_response_code(400);
        //         } else {
        //             $checkIn = $_GET["checkInDate"];
        //             $checkOut = $_GET["checkOutDate"];
        //             $nrGuests = $_GET["numberOfPeople"];
        //             $arrResults = $searchModel->SearchAllLocations($checkIn, $checkOut, $nrGuests);
        //             $responseData = json_encode($arrResults);
        //         }

        //     } catch (Error $e) {
        //         $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
        //         $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
        //     }
        // } else {
        //     $strErrorDesc = 'Method not supported';
        //     $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        // }
        // // send output
        // if (!$strErrorDesc) {
        //     $this->sendOutput(
        //         $responseData,
        //         array('Content-Type: application/json', 'HTTP/1.1 200 OK')
        //     );
        // } else {
        //     $this->sendOutput(json_encode(array('error' => $strErrorDesc)),
        //         array('Content-Type: application/json', $strErrorHeader)
        //     );
        // }

        if ($_SERVER["REQUEST_METHOD"] == "GET") {

            //Retrieve search params
            if (!isset($_GET["checkInDate"], $_GET["checkOutDate"], $_GET["numberOfPeople"])) {
                http_response_code(400);
                die(json_encode(["message" => "Bad parameters"]));
            }

            $checkIn = $_GET["checkInDate"];
            $checkOut = $_GET["checkOutDate"];
            $nrGuests = $_GET["numberOfPeople"];

            $minDate = new DateTime('today');
            $maxDate = (new DateTime('today'))->modify('+1 year');

            if ($inFormatted === false || $outFormatted === false) {
                http_response_code(400);
                die(json_encode(["message" => "Invalid dates"]));
            }

            $minDate = new DateTime('today');
            $maxDate = (new DateTime('today'))->modify('+1 year');

            if (Validation::validDates($inFormatted, $outFormatted, $minDate, $maxDate) === false) {
                http_response_code(400);
                die(json_encode(["message" => "Invalid dates"]));
            }

            if (Validation::daysBetween($checkIn, $checkOut) > 15) {
                http_response_code(400);
                die(json_encode(["message" => "Invalid dates"]));
            }

            if (!ctype_digit($nrGuests) || $nrGuests < 1 || $nrGuests > 4) {
                http_response_code(400);
                die(json_encode(["message" => "Invalid guest count"]));
            }

            //Create empty response object
            $response = new stdClass();

            $searchModel = new SearchModel();

            //Get every hotel location
            $locations = $searchModel->getLocationDetails();

            // Iterate through each location
            foreach ($locations as $row) {
                // try {

                // } catch (Exception $e) {

                // }
                $response->{$row["location_id"]} = new stdClass();
                $response->{$row["location_id"]}->locationName = $row["location_name"];
                $response->{$row["location_id"]}->area = $row["area"];
                $response->{$row["location_id"]}->image = $row["image"];

                // Use the search function with the current location and the passed params
                $details = $searchModel->searchLocation($checkIn, $checkOut, $nrGuests, $row["location_id"]);
                // var_dump($details);
                $details = $searchModel->getCheapestAndCount($details);
                // $response->{$row["location_id"]} = $details;
                // Add results to response object
                $response->{$row["location_id"]}->available = $details[0];
                $response->{$row["location_id"]}->cheapest = $details[1];
            }

            echo json_encode($response);

        }

    }

    public function specificSearch()
    {
        if ($_SERVER["REQUEST_METHOD"] == "GET") {

            if (!isset($_GET["checkInDate"], $_GET["checkOutDate"], $_GET["numberOfPeople"], $_GET["locationId"])) {
                http_response_code(400);
                die(json_encode(["message" => "Bad parameters"]));
            }

            //Retrieve search params
            $checkIn = $_GET["checkInDate"];
            $checkOut = $_GET["checkOutDate"];
            $nrGuests = $_GET["numberOfPeople"];
            $locationId = $_GET["locationId"];

            if (!in_array(strtolower($locationId), ["pip", "dri"])) {
                http_response_code(400);
                die();
            }

            $inFormatted = Validation::toDate($checkIn);
            $outFormatted = Validation::toDate($checkOut);

            if ($inFormatted === false || $outFormatted === false) {
                http_response_code(400);
                die(json_encode(["message" => "Invalid dates"]));
            }

            $minDate = new DateTime('today');
            $maxDate = (new DateTime('today'))->modify('+1 year');

            if (Validation::validDates($inFormatted, $outFormatted, $minDate, $maxDate) === false) {
                http_response_code(400);
                die(json_encode(["message" => "Invalid dates"]));
            }

            if (Validation::daysBetween($checkIn, $checkOut) > 15) {
                http_response_code(400);
                die(json_encode(["message" => "Invalid dates"]));
            }

            //Create empty response object
            $response = new stdClass();

            $searchModel = new SearchModel();

            // Make the search with the passed location id
            $result = $searchModel->searchLocationDetailed($checkIn, $checkOut, $nrGuests, $locationId);

            foreach ($result as $row) {
                // Create empty object for the current room type
                $response->{$row["type_id"]} = new stdClass();

                // Store attributes of current room type in response object
                $response->{$row["type_id"]}->available = $row["count"];
                $response->{$row["type_id"]}->price = $row["price"];
                $response->{$row["type_id"]}->typeName = $row["type_name"];
                $response->{$row["type_id"]}->capacity = $row["capacity"];
                $response->{$row["type_id"]}->image = $row["image"];
            }

            //Return the response object in JSON format
            echo json_encode($response);

        }
    }
}
