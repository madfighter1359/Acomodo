<?php
class BookingController
{
    public function book()
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

        if (!isset($_POST["checkInDate"], $_POST["checkOutDate"], $_POST["numberOfPeople"], $_POST["price"],
            $_POST["locationId"], $_POST["roomType"], $_POST["paymentMethod"], $_POST["paid"])) {
            customError("param");
        }

        $checkIn = $_POST["checkInDate"];
        $checkOut = $_POST["checkOutDate"];
        $nrGuests = $_POST["numberOfPeople"];
        $price = $_POST["price"];
        $locId = $_POST["locationId"];
        $roomType = $_POST["roomType"];
        $paymentMethod = $_POST["paymentMethod"];
        $paid = $_POST["paid"];

        $minDate = new DateTime('today');
        $maxDate = (new DateTime('today'))->modify('+1 year');

        if (!Validation::validDates($checkIn, $checkOut, $minDate, $maxDate, 16)) {
            customError("date");
        }

        if (!Validation::isNumberBetween($nrGuests, 1, 4)) {
            customError("guest");
        }

        if (!is_numeric($price)) {
            customError("param");
        }

        if (!in_array(strtolower($locId), ["apa", "acm"])) {
            customError("param");
        }

        if (!strlen($roomType) === 3) {
            customError("param");
        }

        if (strlen($paymentMethod) > 32) {
            customError("param");
        }

        if (!in_array($paid, [0, 1])) {
            customError("param");
        }

        $nights = Validation::daysBetween($checkIn, $checkOut);

        $bookingModel = new BookingModel();
        [$reservation, $roomNr] = $bookingModel->makeReservation($checkIn, $checkOut, $guestId, $nrGuests, $price, strtolower($locId), $roomType, $nights);

        if ($reservation !== false) {

            $date = date("Y-m-d");

            $transaction = $bookingModel->createTransaction($reservation, $date, $paymentMethod, $price, $paid);

            if ($transaction !== false) {
                $response = new stdClass();
                $response->status = "Success";
                $response->reservationId = $reservation;
                $response->reservation = new stdClass();
                $response->reservation->checkIn = $checkIn;
                $response->reservation->checkOut = $checkOut;
                $response->reservation->guestId = $guestId;
                $response->reservation->nrGuests = $nrGuests;
                $response->reservation->price = $price;
                $response->reservation->locId = $locId;
                $response->reservation->roomType = $roomType;
                $response->reservation->nights = $nights;
                $response->reservation->roomNr = $roomNr;
                $response->reservation->roomTypeName = $bookingModel->getRoomTypeName($roomNr, strtolower($locId));
                $response->reservation->locationName = $bookingModel->getLocationName(strtolower($locId));

                $guestModel = new GuestModel();
                $guestDetails = $guestModel->getGuestDetails($guestId);
                $guestEmail = $guestDetails["email"];
                $guestName = $guestDetails["guest_name"];
                $response->transactionId = $transaction;
                $response->transaction = new stdClass();
                $response->transaction->date = $date;
                $response->transaction->paymentMethod = $paymentMethod;
                $response->transaction->email = $guestEmail;
                $response->transaction->fullName = $guestName;
                $response->transaction->paid = $paid;
                echo json_encode($response);
            }

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

    public function getBookingDetails($reservationId)
    {
        if ($_SERVER["REQUEST_METHOD"] != "GET") {
            customError("method");
        }

        if (!isset(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1])) {
            customError("jwt");
        }

        if (!Validation::isNumberBetween($reservationId, 0, 10000000)) {
            customError("param");
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

        $reservationOwner = $bookingModel->getReservationOwner($reservationId);

        if ($reservationOwner != $guestId) {
            customError("unauthorized");
        }

        $results = $bookingModel->getReservationDetails($reservationId);

        $roomImage = $bookingModel->getRoomTypeImage($results["room_number"], strtolower($results["location_id"]));

        $response = new stdClass();

        $response->roomNr = $results["room_number"];
        $response->image = $roomImage;

        echo json_encode($response);
    }

    public function getTransactionDetails($reservationId)
    {
        if ($_SERVER["REQUEST_METHOD"] != "GET") {
            customError("method");
        }

        if (!isset(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1])) {
            customError("jwt");
        }

        if (!Validation::isNumberBetween($reservationId, 0, 10000000)) {
            customError("param");
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

        $reservationOwner = $bookingModel->getReservationOwner($reservationId);

        if ($reservationOwner != $guestId) {
            customError("unauthorized");
        }

        $bookingModel = new BookingModel();

        $transaction = $bookingModel->getTransactionDetails($reservationId);

        $guestModel = new GuestModel();
        $guestInfo = $guestModel->getGuestDetails($guestId);

        $response = new stdClass();

        $response->transactionId = $transaction["transaction_id"];
        $response->reservationId = $transaction["reservation_id"];
        $response->date = $transaction["transaction_date"];
        $response->paymentMethod = $transaction["payment_method"];
        $response->amount = $transaction["amount"];
        $response->paid = $transaction["paid"];
        $response->name = $guestInfo["guest_name"];
        $response->email = $guestInfo["email"];

        echo json_encode($response);
    }
}
