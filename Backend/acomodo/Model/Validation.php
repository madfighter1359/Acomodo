<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Validation
{
    // Function that converts a value to a date
    public static function toDate($val)
    {
        try {
            return new DateTime($val);
        } catch (Exception $e) {
            return false;
        }
    }

    // Function that checks if a pair of check in and out dates are valid
    public static function validDates($in, $out, $min, $max, $nights)
    {
        $inFormatted = Validation::toDate($in);
        $outFormatted = Validation::toDate($out);
        if ($inFormatted === false || $outFormatted === false) {
            return false;
        }
        return $inFormatted >= $min && $outFormatted <= $max && $inFormatted < $outFormatted && Validation::daysBetween($in, $out) < $nights;
    }

    // Function that returns the days between two dates
    public static function daysBetween($d1, $d2)
    {
        return (new DateTime($d1))->diff(new DateTime($d2))->days;
    }

    // Function that validates that a value is an integer between two numbers
    public static function isNumberBetween($nr, $min, $max)
    {
        return ctype_digit($nr) && $min <= $nr && $nr <= $max;
    }

    // Function that validates a JSON web token used to authenticate users
    public static function authenticateToken($jwt)
    {
        // Getting public keys from website
        $publicKeys = json_decode(file_get_contents("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"));

        $decoded = "";

        JWT::$leeway = 60; // $leeway in seconds
        // Looping through each key attempting to find a match
        foreach ($publicKeys as $key) {
            try {
                $decoded = JWT::decode($jwt, new Key($key, 'RS256'));
                break;
            } catch (Exception $e) {
                continue;
            }
        }

        // Validates that a decoded token has valid properties
        function validateToken($token)
        {
            $time = time();
            $leeway = 60;
            $valid = $token->exp > (time() - $leeway) &&
            $token->iat < (time() + $leeway) && $token->aud == "acomodoro-29361" &&
            $token->iss == "https://securetoken.google.com/acomodoro-29361" &&
            $token->sub && $token->auth_time < (time() + $leeway);
            return $valid;
        }

        // Gets user id from token (if it's valid)
        if ($decoded && validateToken($decoded)) {
            return $decoded->user_id;
        } else {
            return false;
        }
    }
}
