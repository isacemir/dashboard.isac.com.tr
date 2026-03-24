<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
session_start(); session_destroy();
echo json_encode(['ok' => true]);
