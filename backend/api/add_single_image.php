<?php
// NEEDS TO BE REWRITTEN

require_once "../config/db.php";
require_once "../api_header.php";

$carid = isset($_POST['carid']) ? $_POST['carid'] : null;

if (!$carid || !isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing car ID or image"]);
    exit;
}

try {
    $db = new Database();
    $conn = $db->connection();

    // 1. Get the next Picture Number (picNo)
    $stmt = $conn->prepare("SELECT MAX(picNo) as maxNo FROM Pictures WHERE carid = ?");
    $stmt->execute([$carid]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $picNo = (isset($row['maxNo']) ? $row['maxNo'] : 0) + 1;

    // 2. Setup Upload Directory
    // Ensure this path matches where your other images go
    $uploadDir = __DIR__ . "/../uploads/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $file = $_FILES['image'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    // Create a clean filename: car_105_pic_1.jpg
    $filename = "car_{$carid}_pic_{$picNo}." . $ext;
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // 3. Save to Database
        // We save the full URL so React can display it easily
        $dbPath = "http://localhost/dealership-project/backend/uploads/" . $filename;

        // If this is the first image, make it the main one
        $isMain = ($picNo === 1) ? 1 : 0;

        $sql = "INSERT INTO Pictures (carid, picNo, image_path, is_main) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$carid, $picNo, $dbPath, $isMain]);

        $newPicId = $conn->lastInsertId();

        echo json_encode([
            "status" => "success",
            "data" => [
                "picid" => $newPicId,
                "image_path" => $dbPath,
                "is_main" => $isMain
            ]
        ]);
    } else {
        $absPath = realpath($uploadDir);
        $sysError = error_get_last();
        throw new Exception("Failed to move file. Trying to save to: '" . $targetPath . "' (Resolved: " . $absPath . "). System Error: " . $sysError['message']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

?>