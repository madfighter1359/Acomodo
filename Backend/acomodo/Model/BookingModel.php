<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
class BookingModel extends Database
{
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

    public function getReservations($guestId)
    {
        return $this->select("SELECT reservation.*, location_name, image FROM reservation, location WHERE
        guest_id = ? AND location.location_id = reservation.location_id;", [$guestId], "i");
    }

    public function getRoomTypeName($roomNr, $locationId)
    {
        return $this->select("SELECT type_name FROM room_type, {$locationId}_rooms WHERE
        room_number=? AND room_type.type_id = {$locationId}_rooms.type_id", [$roomNr], "i")[0]["type_name"];
    }

    public function getLocationName($locId)
    {
        return $this->select("SELECT location_name from location WHERE location_id = ?;", [$locId], "s")[0]["location_name"];
    }

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
}
