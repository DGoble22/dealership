<?php
    require_once "../config/db.php";
    require_once "../api_header.php";

    //Get raw data from stream need to read JSON sent from React
    $data = json_decode(file_get_contents("php://input"), true);
    $picid = $data["picid"];
    $carid = $data["carid"];

    if((!isset($data["picid"]) || $data["picid"] === "") || (!isset($data["carid"]) || $data["carid"] === "")){
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    // Validate integers
    $carid = filter_var($data["carid"], FILTER_VALIDATE_INT);
    $picid = filter_var($data["picid"], FILTER_VALIDATE_INT);
    if($carid === false){echo json_encode(["status" => "error", "message" => "Car id integer expected"]); exit(); }
    if($picid === false){echo json_encode(["status" => "error", "message" => "Picture id integer expected"]); exit(); }
    unset($data['carid']);
    unset($data['picid']);

    try {
        $db = new Database();
        $conn = $db->connection();
        $conn->beginTransaction();

            // get image path amd check if it is a cover image
            $stmt = $conn->prepare("SELECT image_path, is_main FROM Pictures WHERE picid = ?");
            $stmt->execute([$picid]);
            $img = $stmt->fetch(PDO::FETCH_ASSOC);

            if($img){
                if($img["is_main"] === 1){
                    $promostmt = $conn->prepare("UPDATE Pictures SET is_main = 1 WHERE carid = ? AND picid != ? ORDER BY picid LIMIT 1");
                    $promostmt->execute([$carid, $picid]);
                }

                $filename = basename($img["image_path"]);
                $local_path = __DIR__ . "/../uploads/" . $filename;

                // delete file
                if(file_exists($local_path)){
                    unlink($local_path);
                }

                //delete from database
                $delstmt = $conn->prepare("DELETE FROM Pictures WHERE picid = ? LIMIT 1");
                $delstmt->execute([$picid]);
            }
            $conn->commit();
            echo json_encode(["status" => "success", "message" => "Image deleted"]);

    } catch (Exception $e) {
        if(isset ($conn)){$conn->rollback();}
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
?>