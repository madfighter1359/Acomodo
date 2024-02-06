<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Validation
{
    public function isDate($val)
    {
        return true;
    }

    public function daysBetween($d1, $d2)
    {
        return (new DateTime($d1))->diff(new DateTime($d2))->days;
    }

    public function authenticateToken($jwt)
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
