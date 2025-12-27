<?php
    //Inlcude database class
    require_once '../config/db.php';

    //set header to JSON
    header("content-type: application/json;");

    try{
        //Database connection
        $db = new Database();
        $conn = $db->connection();

        //sql execution
        $sql = "SELECT * FROM Car";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        //outputs to JSON
        $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($cars);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "connection failed: " . $e->getMessage()]);
    }
?>