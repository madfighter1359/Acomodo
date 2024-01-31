<?php
// echo print_r($date);

if ($date = DateTime::createFromFormat('Y-m-d', $_GET["d"])) {
    $date = '2012-09-09 03:09:00';
    $dt = new DateTime($date);
    $date2 = '2012-09-10 03:09:00';
    $dt2 = new DateTime($date2);
    echo $dt->format('Y-m-d') > $dt2->format('Y-m-d');
}
else {
    echo 2;
    var_dump($date);
}
