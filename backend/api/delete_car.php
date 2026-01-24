<?php
    require_once "../config/db.php";
    require_once "../api_header.php";

    //Get raw data from stream need to read JSON sent from React
    $raw_data = file_get_contents("php://input");
    $data = json_decode($raw_data, True);

    try{
        //database connection
        $db = new Database();
        $conn = $db->connection();
        $conn->beginTransaction();

        // input validation
        if(!isset($data["carid"]) || $data["carid"] === ""){
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing id"]);
            exit;
        }
        $id = filter_var($data["carid"], FILTER_VALIDATE_INT);
        if($id === false){
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid carid"]);
            exit;
        }

        // SQL for Pictures table
        $stmt = $conn->prepare("SELECT image_path FROM Pictures WHERE carid = ?");
        $stmt->execute([$id]);
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //Loop to delete images from server
        foreach($images as $image){
            // Extract "car_1_pic_1.jpg" from the URL
            $filename = basename($image["image_path"]);
            $localPath = __DIR__ . "/../uploads/" . $filename;
            if(file_exists($localPath)){
                unlink($localPath);
            }
        }

        // SQL for Car table
        $sql = "DELETE FROM Car WHERE carid = ? LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);

        if($stmt->rowCount() === 0){
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Car not found"]);
            exit;
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Car deleted"]);

    } catch (PDOException $e) {
        if(isset($conn)){ $conn->rollback(); }
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Database Error: " . $e->getMessage()));
    }
?>
