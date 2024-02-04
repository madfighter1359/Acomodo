<?php
class BookingController extends BaseController
{
    public function bookAction()
    {
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            die();
        }

        $validator = new Validation();

        $userId = $validator->authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);

        if (!$userId) {
            die("Invalid jwt");
        }

        echo $userId;

        $guestModel = new GuestModel();
        $guestId = $guestModel->getGuestId($userId);

        if (!isset($_POST["checkInDate"], $_POST["checkOutDate"], $_POST["numberOfPeople"], $_POST["price"], $_POST["locationId"], $_POST["roomType"])) {
            die("");
        }

        if (!($validator->isDate($_POST["checkInDate"]) && $validator->isDate($_POST["checkOutDate"]) /* */)) {
            die();
        }

        $checkIn = $_POST["checkInDate"];
        $checkOut = $_POST["checkOutDate"];
        $nrGuests = $_POST["numberOfPeople"];
        $price = $_POST["price"];
        $locId = $_POST["locationId"];
        $roomType = $_POST["roomType"];

        $nights = $validator->daysBetween($checkIn, $checkOut);

        $bookingModel = new BookingModel();
        $reservation = $bookingModel->makeReservation($checkIn, $checkOut, $guestId, $nrGuests, $price, $locId, $roomType, $nights);

        if ($reservation !== false) {
            $response = new stdClass();
            $response->status = "Success";
            $response->reservationId = $reservation;
            $response->details = new stdClass();
            $response->details->checkIn = $checkIn;
            $response->details->checkOut = $checkOut;
            $response->details->guestId = $guestId;
            $response->details->nrGuests = $nrGuests;
            $response->details->price = $price;
            $response->details->locId = $locId;
            $response->details->roomType = $roomType;
            $response->details->nights = $nights;
            echo json_encode($response);
        }

    }
}
