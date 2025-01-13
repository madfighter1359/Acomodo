<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class GuestModel extends Database
{
    // Function which returns a guest id from a Firebase user id
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
    // Function that inserts a guest into the guest table
    public function createGuest($uid, $name, $doB, $docNr, $email)
    {
        $created = $this->insert("INSERT INTO guest (guest_name, date_of_birth, document_number, firebase_uid, email)
        VALUES (?, ?, ?, ?, ?);", [$name, $doB, $docNr, $uid, $email], "sssss");

        if ($created[0] === 1) {
            $id = $created[1];
            return $id;
        } else {
            customError("", "Error creating", 500);
        }

    }

    // Function which gets a guest's name and email address from the guest table
    public function getGuestDetails($guestId)
    {
        $result = $this->select("SELECT guest_name, email FROM guest WHERE guest_id = ?;", [$guestId], "i");
        return $result[0];
    }
}
