<?php
class GuestController extends BaseController
{
    public function newGuest()
    {
        if ($_SERVER["REQUEST_METHOD"] != "POST") {
            http_response_code(405);
            die();
        }

        $validator = new Validation();
        try {
            $userId = $validator->authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);
        } catch (Throwable $e) {
            http_response_code(401);
            die();
        }

        if (!$userId) {
            // arguably should still be 401
            http_response_code(403);
            die("Invalid jwt");
        }

        if (!isset($_POST["guestName"], $_POST["guestDoB"], $_POST["guestDocNr"], $_POST["email"])) {
            http_response_code(400);
            die();
        }

        //verify params here
        $guestName = $_POST["guestName"];
        $guestDoB = $_POST["guestDoB"];
        $guestDocNr = $_POST["guestDocNr"];
        $email = $_POST["email"];

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
            $this->sendOutput(json_encode($response));
        }

    }
}
