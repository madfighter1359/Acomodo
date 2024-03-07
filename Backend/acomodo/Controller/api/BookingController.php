<?php
class BookingController
{
    public function book()
    {
        // Checking request method
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            customError("method");
        }

        // Attempt to retrieve authorization, and validate the JWT. If something goes wrong return error
        if (!isset(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1])) {
            customError("jwt");
        }
        try {
            $userId = Validation::authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);
        } catch (Throwable $e) {
            customError("jwt");
        }

        if (!$userId) {
            customError("jwt");
        }

        // Check if there is a guest associated with the id of the requesting user
        $guestModel = new GuestModel();
        if (!$guestId = $guestModel->getGuestId($userId)) {
            customError("jwt");
        }

        // Check correct params are set
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

        // Setting acceptable date range and checking that the dates fall within this and are valid
        $minDate = new DateTime('today');
        $maxDate = (new DateTime('today'))->modify('+1 year');

        if (!Validation::validDates($checkIn, $checkOut, $minDate, $maxDate, 16)) {
            customError("date");
        }

        // Validate numbers
        if (!Validation::isNumberBetween($nrGuests, 1, 4)) {
            customError("guest");
        }

        if (!is_numeric($price)) {
            customError("param");
        }

        // Validate location id
        if (!in_array(strtolower($locId), ["apa", "acm"])) {
            customError("param");
        }

        // Validate strings
        if (!strlen($roomType) === 3) {
            customError("param");
        }

        if (strlen($paymentMethod) > 32) {
            customError("param");
        }

        // Validate boolean
        if (!in_array($paid, [0, 1])) {
            customError("param");
        }

        // Get number of nights
        $nights = Validation::daysBetween($checkIn, $checkOut);

        $bookingModel = new BookingModel();
        // Attempt to create a reservation with given parameters
        [$reservation, $roomNr] = $bookingModel->makeReservation($checkIn, $checkOut, $guestId, $nrGuests, $price, strtolower($locId), $roomType, $nights);

        if ($reservation !== false) {

            // If reservation is created successfully, create an associated transaction
            $date = date("Y-m-d");

            $transaction = $bookingModel->createTransaction($reservation, $date, $paymentMethod, $price, $paid);

            if ($transaction !== false) {
                // If transaction insertion is successfull, add all attributes to response and output it as JSON
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
        // Checking request method
        if ($_SERVER["REQUEST_METHOD"] != "GET") {
            customError("method");
        }

        // Attempt to retrieve authorization, and validate the JWT. If something goes wrong return error
        if (!isset(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1])) {
            customError("jwt");
        }

        try {
            $userId = Validation::authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);
        } catch (Throwable $e) {
            customError("jwt");
        }

        if (!$userId) {
            customError("jwt");
        }


        $guestModel = new GuestModel();
        // Check if there is a guest associated with the id of the requesting user
        if (!$guestId = $guestModel->getGuestId($userId)) {
            customError("jwt");
        }

        $bookingModel = new BookingModel();

        // Attempt to retrieve all of the guest's reservations
        $results = $bookingModel->getReservations($guestId);
        $response = new stdClass();
        // Create an empty array to store all of the reservations
        $response->reservations = [];
        foreach ($results as $row) {
            // Add all details of each reservation to an object
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
            // Append the details object to the array of all the reservations
            $response->reservations[] = $reservation;
        }

        // Output response as JSON
        echo json_encode($response);
    }

    public function getBookingDetails($reservationId)
    {
        // Checking request method
        if ($_SERVER["REQUEST_METHOD"] != "GET") {
            customError("method");
        }

        // Attempt to retrieve authorization, and validate the JWT. If something goes wrong return error
        if (!isset(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1])) {
            customError("jwt");
        }

        // Check that the reservation id is an integer within an acceptable range
        if (!Validation::isNumberBetween($reservationId, 0, 10000000)) {
            customError("param");
        }

        try {
            $userId = Validation::authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);
        } catch (Throwable $e) {
            customError("jwt");
        }
        
        if (!$userId) {
            customError("jwt");
        }

        // Check if there is a guest associated with the id of the requesting user
        $guestModel = new GuestModel();
        if (!$guestId = $guestModel->getGuestId($userId)) {
            customError("jwt");
        }

        $bookingModel = new BookingModel();

        // Get the owner of the reservation requested and check if it matches the requesting user
        $reservationOwner = $bookingModel->getReservationOwner($reservationId);

        if ($reservationOwner != $guestId) {
            customError("unauthorized");
        }

        // Get the details, image and room number of the requested reservation
        $results = $bookingModel->getReservationDetails($reservationId);

        $roomImage = $bookingModel->getRoomTypeImage($results["room_number"], strtolower($results["location_id"]));

        $response = new stdClass();

        $response->roomNr = $results["room_number"];
        $response->image = $roomImage;

        // Output response as JSON
        echo json_encode($response);
    }

    public function getTransactionDetails($reservationId)
    {
        // Checking request method
        if ($_SERVER["REQUEST_METHOD"] != "GET") {
            customError("method");
        }

        // Attempt to retrieve authorization, and validate the JWT. If something goes wrong return error
        if (!isset(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1])) {
            customError("jwt");
        }

        // Check that the reservation id is an integer within an acceptable range
        if (!Validation::isNumberBetween($reservationId, 0, 10000000)) {
            customError("param");
        }

        try {
            $userId = Validation::authenticateToken(explode(" ", $_SERVER['HTTP_AUTHORIZATION'])[1]);
        } catch (Throwable $e) {
            customError("jwt");
        }

        if (!$userId) {
            customError("jwt");
        }

        // Check if there is a guest associated with the id of the requesting user
        $guestModel = new GuestModel();
        if (!$guestId = $guestModel->getGuestId($userId)) {
            customError("jwt");
        }

        $bookingModel = new BookingModel();

        // Get the owner of the reservation requested and check if it matches the requesting user
        $reservationOwner = $bookingModel->getReservationOwner($reservationId);

        if ($reservationOwner != $guestId) {
            customError("unauthorized");
        }

        $bookingModel = new BookingModel();

        // Attempt to retrieve details of transaction of requested reservation id
        $transaction = $bookingModel->getTransactionDetails($reservationId);

        $guestModel = new GuestModel();
        // Get details of guest who's transaction it is
        $guestInfo = $guestModel->getGuestDetails($guestId);

        $response = new stdClass();

        // Add results to a response object
        $response->transactionId = $transaction["transaction_id"];
        $response->reservationId = $transaction["reservation_id"];
        $response->date = $transaction["transaction_date"];
        $response->paymentMethod = $transaction["payment_method"];
        $response->amount = $transaction["amount"];
        $response->paid = $transaction["paid"];
        $response->name = $guestInfo["guest_name"];
        $response->email = $guestInfo["email"];

        // Output response as JSON
        echo json_encode($response);
    }
}
