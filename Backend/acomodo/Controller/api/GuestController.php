<?php
class GuestController
{
    public function newGuest()
    {
        if ($_SERVER["REQUEST_METHOD"] != "POST") {
            customError("method");
        }

        $validator = new Validation();
        try {
            $userId = $validator->authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);
        } catch (Throwable $e) {
            customError("jwt");
        }

        if (!$userId) {
            // arguably should still be 401
            customError("jwt");
        }

        if (!isset($_POST["guestName"], $_POST["guestDoB"], $_POST["guestDocNr"], $_POST["email"])) {
            customError("param");
        }

        //verify params here
        $guestName = $_POST["guestName"];
        $guestDoB = $_POST["guestDoB"];
        $guestDocNr = $_POST["guestDocNr"];
        $email = $_POST["email"];

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

        $inserted = $guestModel->createGuest($userId, $guestName, $guestDoB, $guestDocNr, $email);

        if ($inserted) {
            $response = new stdClass();
            $response->status = "Success";
            $response->guestId = $inserted;
            $response->details = new stdClass();
            $response->details->guestName = $guestName;
            $response->details->guestDoB = $guestDoB;
            $response->details->guestDocNr = $guestDocNr;
            $response->details->email = $email;
            echo json_encode($response);
        } else {
            customError("?");
        }
    }
}
