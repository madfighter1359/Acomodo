<?php
require "vendor/autoload.php";


use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$jwt = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjAzMmNjMWNiMjg5ZGQ0NjI2YTQzNWQ3Mjk4OWFlNDMyMTJkZWZlNzgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9hY29tb2Rvcm8tMjkzNjEiLCJhdWQiOiJhY29tb2Rvcm8tMjkzNjEiLCJhdXRoX3RpbWUiOjE3MDI2NzA5MjgsInVzZXJfaWQiOiIwanhhcmxtcllGVWp4d1Q2SkJJNlU5T2thQkozIiwic3ViIjoiMGp4YXJsbXJZRlVqeHdUNkpCSTZVOU9rYUJKMyIsImlhdCI6MTcwMzMzNjI2NCwiZXhwIjoxNzAzMzM5ODY0LCJlbWFpbCI6InN1emllQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJzdXppZUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.shaYCzJXPJxMsMpCQyDyXGkivTsKpL5AGEjyn6btrN2oba3c9KVPW4cxky2n7zzmBleB0uJ_fgHzye3yhcATCm_QSkL4NF6zXVewV464F5f-0l86DuJZMVTiBra71VCo8h1DXWlQjpY_v9ImkDNhpH9-eE_Y425HK7x4E6VP8-Vi5JzVHxBOlEhMC0ITIxKC2IOij1gLH6xQWDpkEcQYI1472xIUEPD3ZMk9dpqNqThVUrW77tT5X26YqPT2xiACAbGsZp1d-Cogru4XrJdcLLF31j71aPy1JE2QWuRat7cJ96KEFnI7_p4iiwAbL_eQrAomC3I5HiLOGsmusKwJEw";

$publicKeys = json_decode(file_get_contents("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"));

$decoded = "";
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
    $valid = $token['exp'] > time() &&
        $token['iat'] < time() && $token['aud'] == "acomodoro-29361" &&
        $token['iss'] == "https://securetoken.google.com/acomodoro-29361" &&
        $token['sub'] && $token['auth_time'] < time();
    return $valid;
}


if ($decoded) {
    $decoded_array = (array) $decoded;
    if (validateToken($decoded_array)) {
        echo "Decode:\n" . print_r($decoded_array, true) . "\n";
    } else {
        echo "Invalid token";
    }
} else {
    echo "Invalid token";
}