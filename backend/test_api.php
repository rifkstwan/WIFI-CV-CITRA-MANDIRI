<?php
$ch = curl_init('http://127.0.0.1:8000/api/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email' => 'teknisi@citra.com', 'password' => 'password123']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);
$response = curl_exec($ch);
$data = json_decode($response, true);

if (!isset($data['token'])) {
    echo "LOGIN FAILED: " . $response . "\n";
    exit;
}
$token = $data['token'];

$ch2 = curl_init('http://127.0.0.1:8000/api/technician/installations');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token", 'Accept: application/json']);
$res2 = curl_exec($ch2);
echo "RESPONSE: " . $res2 . "\n";
