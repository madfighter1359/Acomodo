<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Validation
{
    public static function toDate($val)
    {
        try {
            return new DateTime($val);
        } catch (Exception $e) {
            return false;
        }
    }

    public static function validDates($in, $out, $min, $max, $nights)
    {
        $inFormatted = Validation::toDate($in);
        $outFormatted = Validation::toDate($out);
        if ($inFormatted === false || $outFormatted === false) {
            return false;
        }
        return $inFormatted >= $min && $outFormatted <= $max && $inFormatted < $outFormatted && Validation::daysBetween($in, $out) < 15;
    }

    public static function daysBetween($d1, $d2)
    {
        return (new DateTime($d1))->diff(new DateTime($d2))->days;
    }

    public static function isNumberBetween($nr, $min, $max)
    {
        return ctype_digit($nr) && $min <= $nr && $nr <= $max;
    }

    public static function authenticateToken($jwt)
    {
        $publicKeys = json_decode(file_get_contents("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"));

        $decoded = "";

        JWT::$leeway = 60; // $leeway in seconds
        foreach ($publicKeys as $key) {
            try {
                $decoded = JWT::decode($jwt, new Key($key, 'RS256'));
                break;
            } catch (Exception $e) {
                continue;
            }
        }

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

        if ($decoded && validateToken($decoded)) {
            return $decoded->user_id;
        } else {
            return false;
        }
    }
}
