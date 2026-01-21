<?php
    require_once "../config/db.php";
    require_once "../api_header.php";

    $carid = isset($_POST["carid"]) ? filter_var($_POST["carid"], FILTER_VALIDATE_INT) : null;

    if(!carid || empty($_FILES["images"])){
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing carid or image"]);
        exit;
    }

    try {
        $db = new Database();
        $conn = $db->connection();

        $upload_dir = "../uploads/";
        $uploaded_images = [];


    } catch (exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }


?>
