<?php
class BookingController extends BaseController
{
    public function bookAction()
    {
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            customError("method");
        }

        if (!isset(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1])) {
            customError("jwt");
        }

        $userId = Validation::authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);

        if (!$userId) {
            customError("jwt");
        }

        $guestModel = new GuestModel();
        if (!$guestId = $guestModel->getGuestId($userId)) {
            customError("jwt");
        }

        if (!isset($_POST["checkInDate"], $_POST["checkOutDate"], $_POST["numberOfPeople"], $_POST["price"], $_POST["locationId"], $_POST["roomType"])) {
            customError("param");
        }

        $checkIn = $_POST["checkInDate"];
        $checkOut = $_POST["checkOutDate"];
        $nrGuests = $_POST["numberOfPeople"];
        $price = $_POST["price"];
        $locId = $_POST["locationId"];
        $roomType = $_POST["roomType"];

        $minDate = new DateTime('today');
        $maxDate = (new DateTime('today'))->modify('+1 year');

        if (!Validation::validDates($checkIn, $checkOut, $minDate, $maxDate, 15)) {
            customError("date");
        }

        if (!Validation::isNumberBetween($nrGuests, 1, 4)) {
            customError("guest");
        }

        if (!is_numeric($price)) {
            customError("param");
        }

        if (!in_array(strtolower($locId), ["pip", "dri"])) {
            customError("param");
        }

        if (!strlen($roomType) === 3) {
            customError("param");
        }

        $nights = Validation::daysBetween($checkIn, $checkOut);

        $bookingModel = new BookingModel();
        [$reservation, $roomNr] = $bookingModel->makeReservation($checkIn, $checkOut, $guestId, $nrGuests, $price, $locId, $roomType, $nights);

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
            $response->details->roomNr = $roomNr;
            echo json_encode($response);
        }

    }

    public function getBookings()
    {
        if ($_SERVER["REQUEST_METHOD"] != "GET") {
            customError("method");
        }

        if (!isset(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1])) {
            customError("jwt");
        }

        $userId = Validation::authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);

        if (!$userId) {
            customError("jwt");
        }

        $guestModel = new GuestModel();
        if (!$guestId = $guestModel->getGuestId($userId)) {
            customError("jwt");
        }

        $bookingModel = new BookingModel();

        $results = $bookingModel->getReservations($guestId);
        $response = new stdClass();
        $response->reservations = [];
        foreach ($results as $row) {
            $reservation = new stdClass();
            $reservation->reservationId = $row["reservation_id"];
            $reservation->guestId = $row["guest_id"];
            $reservation->roomNr = $row["room_number"];
            $reservation->locationId = $row["location_id"];
            $reservation->checkIn = $row["check_in_date"];
            $reservation->checkOut = $row["check_out_date"];
            $reservation->nrGuests = $row["number_guests"];
            $reservation->price = $row["price"];
            $reservation->locationName = $row["location_name"];
            $reservation->locationImage = $row["image"];
            $reservation->roomType = $bookingModel->getRoomTypeName($row["room_number"], strtolower($row["location_id"]));
            $response->reservations[] = $reservation;
        }

        echo json_encode($response);

    }
}
