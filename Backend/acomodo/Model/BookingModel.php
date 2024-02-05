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
                return $resId;
            } else {
                die("Reservation failed");
            }
        } else {
            die("Bad reservation");
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
            return false;
        }
        // echo $details[0]["price"];
        if ($details[0]["price"] * $nights != $price) {
            return false;
        }
        return $details[0]["room_number"];
    }
}
