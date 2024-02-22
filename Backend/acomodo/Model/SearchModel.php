<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
class SearchModel extends Database
{
    public function searchLocation($checkIn, $checkOut, $nrGuests, $hotelName)
    {
        return $this->select("SELECT room_number, price FROM {$hotelName}_rooms, room_type WHERE
        (NOT room_number = ANY
        (SELECT room_number FROM reservation WHERE (? < check_out_date) AND (check_in_date < ?)))
        AND {$hotelName}_rooms.type_id = room_type.type_id
        AND capacity >= ?;", [$checkIn, $checkOut, $nrGuests], "ssi");
    }

    public function getLocationDetails()
    {
        return $this->select("SELECT * FROM location");
    }

    public function searchLocationDetailed($checkIn, $checkOut, $nrGuests, $hotelName)
    {
        return $this->select("SELECT count(room_type.type_id) as count, room_type.type_id as type_id, price, type_name, capacity, beds, image FROM {$hotelName}_rooms, room_type WHERE
        (NOT room_number = ANY
        (SELECT room_number FROM reservation WHERE (? < check_out_date) AND (check_in_date < ?)))
        AND {$hotelName}_rooms.type_id = room_type.type_id
        AND capacity >= ? GROUP BY room_type.type_id;", [$checkIn, $checkOut, $nrGuests], "ssi");
    }

    public function getCheapestAndCount($rooms)
    {
        $min = PHP_INT_MAX;
        $cnt = 0;
        foreach ($rooms as $room) {
            $min = min($min, $room["price"]);
            $cnt++;
        }
        return [$cnt, $min];
    }
}
