<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
class BookingModel extends Database
{
    // Function for inserting a new reservation into reservation table
    public function makeReservation($checkIn, $checkOut, $guestId, $nrGuests, $price, $locId, $roomType, $nights)
    {

        if ($roomNr = $this->verifyReservation($checkIn, $checkOut, $nrGuests, $price, $locId, $roomType, $nights)) {
            $booked = $this->insert("INSERT INTO
            reservation (
                room_number,
                guest_id,
                location_id,
                check_in_date,
                check_out_date,
                number_guests,
                price
            ) VALUES (?, ?, ?, ?, ?, ?, ?);", [$roomNr, $guestId, strtoupper($locId), $checkIn, $checkOut, $nrGuests, $price], "iisssii");
            if ($booked[0] == 1) {
                $resId = $booked[1];
                return [$resId, $roomNr];
            } else {
                customError("?");
            }
        } else {
            customError("?");
        }

    }
    
    // Function which checks that a requested reservation is valid, and returns an acceptable room number for it
    private function verifyReservation($checkIn, $checkOut, $nrGuests, $price, $locId, $roomType, $nights)
    {
        $details = $this->select("SELECT room_number, price FROM {$locId}_rooms, room_type WHERE
        (NOT room_number = ANY
        (SELECT room_number FROM reservation WHERE (? < check_out_date) AND (check_in_date < ?)))
        AND {$locId}_rooms.type_id = room_type.type_id AND {$locId}_rooms.type_id = ?
        AND capacity >= ? ORDER BY room_number ASC LIMIT 1;", [$checkIn, $checkOut, $roomType, $nrGuests], "sssi");

        if (sizeof($details) != 1) {
            customError("", "No rooms available", 409);
        }
        // echo $details[0]["price"];
        if ($details[0]["price"] * $nights != $price) {
            customError("", "Price mismatch");
        }
        return $details[0]["room_number"];
    }

    // Gets a guest's reservations
    public function getReservations($guestId)
    {
        return $this->select("SELECT reservation.*, location_name, image FROM reservation, location WHERE
        guest_id = ? AND location.location_id = reservation.location_id;", [$guestId], "i");
    }

    // Gets the details of a specific reservation
    public function getReservationDetails($reservationId)
    {
        return $this->select("SELECT room_number, location_id FROM reservation WHERE reservation_id = ?;", [$reservationId], "i")[0];
    }

    // Gets the full name of a room type
    public function getRoomTypeName($roomNr, $locationId)
    {
        return $this->select("SELECT type_name FROM room_type, {$locationId}_rooms WHERE
        room_number=? AND room_type.type_id = {$locationId}_rooms.type_id", [$roomNr], "i")[0]["type_name"];
    }

    // Gets the image link of a room type
    public function getRoomTypeImage($roomNr, $locationId)
    {
        return $this->select("SELECT image FROM room_type, {$locationId}_rooms WHERE
        room_number=? AND room_type.type_id = {$locationId}_rooms.type_id", [$roomNr], "i")[0]["image"];
    }

    // Gets the guest id associated with a reservation
    public function getReservationOwner($reservationId)
    {
        return $this->select("SELECT guest_id FROM reservation WHERE reservation_id = ?;", [$reservationId], "i")[0]["guest_id"];
    }

    // Gets the name of a location from its id
    public function getLocationName($locId)
    {
        return $this->select("SELECT location_name from location WHERE location_id = ?;", [$locId], "s")[0]["location_name"];
    }

    // Inserts a new transaction into the transaction table
    public function createTransaction($resId, $date, $paymentMethod, $amount, $paid)
    {
        $created = $this->insert("INSERT INTO transaction ( reservation_id, transaction_date, payment_method, amount, paid)
        values (?,?,?,?,?);", [$resId, $date, $paymentMethod, $amount, $paid], "issii");
        if ($created[0] == 1) {
            $transactionId = $created[1];
            return $transactionId;
        } else {
            customError("?");
        }
    }

    // Gets the details of a transaction from its reservation id
    public function getTransactionDetails($reservationId)
    {
        return $this->select("SELECT * FROM transaction WHERE reservation_id = ?;", [$reservationId], "i")[0];
    }

}
