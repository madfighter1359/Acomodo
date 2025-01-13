<?php
class GuestController
{
    public function newGuest()
    {
        // Checking request method
        if ($_SERVER["REQUEST_METHOD"] != "POST") {
            customError("method");
        }

        // Attempt to retrieve authorization, and validate the JWT. If something goes wrong return error
        try {
            $userId = Validation::authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);
        } catch (Throwable $e) {
            customError("jwt");
        }

        if (!$userId) {
            customError("jwt");
        }

        // Check that correct search parameters are set and retrieve them
        if (!isset($_POST["guestName"], $_POST["guestDoB"], $_POST["guestDocNr"], $_POST["email"])) {
            customError("param");
        }
        $guestName = $_POST["guestName"];
        $guestDoB = $_POST["guestDoB"];
        $guestDocNr = $_POST["guestDocNr"];
        $email = $_POST["email"];

        // Setting acceptable date range and checking that the date of birth falls within this and is valid
        $maxDate = (new DateTime('today'))->modify('-18 years');
        $minDate = (new DateTime('today'))->modify('-125 years');

        if (!$dobFormatted = Validation::toDate($guestDoB)) {
            customError("date");
        }

        if ($minDate > $dobFormatted || $maxDate < $dobFormatted) {
            customError("date");
        }

        if (!(is_string($guestName) && is_string($guestDocNr) && is_string($email))) {
            customError("param");
        }

        $guestModel = new GuestModel();

        // Attempt to insert into guest table
        $inserted = $guestModel->createGuest($userId, $guestName, $guestDoB, $guestDocNr, $email);

        if ($inserted) {
            // If insertion is successfull, add attributes to response as well as a success message
            $response = new stdClass();
            $response->status = "Success";
            $response->guestId = $inserted;
            $response->details = new stdClass();
            $response->details->guestName = $guestName;
            $response->details->guestDoB = $guestDoB;
            $response->details->guestDocNr = $guestDocNr;
            $response->details->email = $email;
            // Output response formatted as JSON
            echo json_encode($response);
        } else {
            // If something goes wrong, return error
            customError("?");
        }
    }
}
