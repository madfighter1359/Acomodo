<?php

$servername = "localhost";
$user = "root";
$pword = "";
$dbname = "acomodo";

$conn = new mysqli($servername, $user, $pword, $dbname);
    if ($conn->connect_error) {
        die("Failed to connect");
    }