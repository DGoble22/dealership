<?php
    require_once "../config/db.php";
    require_once "../api_header.php";

    try{
        //Database connection
        $db = new Database();
        $conn = $db->connection();

        //sql execution
        $sql = "SELECT * FROM Car";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        //outputs to JSON
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $result]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "connection failed: " . $e->getMessage()]);
    }
?>