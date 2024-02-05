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

            try {
                $inFormatted = new DateTime($checkIn);
                $outFormatted = new DateTime($checkOut);
            } catch (Exception $e) {
                http_response_code(400);
                die(json_encode(["message" => "Invalid dates"]));
            }

            if (!$inFormatted || !$outFormatted || $inFormatted < $minDate || $outFormatted > $maxDate) {
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
}
