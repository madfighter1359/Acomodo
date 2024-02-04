<?php
class Validation {
    public function isDate($val) {
        return true;
    }
    public function daysBetween($d1, $d2) {
        return (new DateTime($d1))->diff(new DateTime($d2))->days;
    }
}