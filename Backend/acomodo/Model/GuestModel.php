<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class GuestModel extends Database
{
    public function getGuestId($uid)
    {
        $result = $this->select("SELECT guest_id from guest where firebase_uid = ?;", [$uid], "s");
        if (sizeof($result) === 1) {
            $id = $result[0]["guest_id"];
            return $id;
        } else {
            return false;
        }
    }
    public function createGuest($uid, $name, $doB, $docNr)
    {
        $created = $this->insert("INSERT INTO guest (guest_name, date_of_birth, document_number, firebase_uid)
        VALUES (?, ?, ?, ?);", [$name, $doB, $docNr, $uid], "ssss");

        if ($created[0] === 1) {
            $id = $created[1];
            return $id;
        } else {
            die("Error creating");
        }

    }
}
