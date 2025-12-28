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

        // input validation
        if(!isset($data["id"]) || $data["id"] === ""){
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing id"]);
            exit;
        }
        $id = filter_var($data["id"], FILTER_VALIDATE_INT);
        if($id === false){
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid id"]);
            exit;
        }

        //SQL
        $sql = "DELETE FROM Car WHERE carid = :id LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->execute(["id" => $id]);

        if($stmt->rowCount() === 0){
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Car not found"]);
            exit;
        }

        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Car deleted"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Database Error: " . $e->getMessage()));
    }
?>
