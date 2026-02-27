<?php
    require_once "../config/db.php";
    require_once "../api_header.php";

    // Get raw JSON data from request
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    // Validate required fields
    if (!isset($data["email"]) || !isset($data["password"])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Email and password are required"]);
        exit;
    }

    // Sanitize email
    $email = filter_var(trim($data["email"]), FILTER_SANITIZE_EMAIL);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid email format"]);
        exit;
    }

    $conn = null;
    try {
        $db = new Database();
        $conn = $db->connection();
        $conn->beginTransaction();

        // Check if user exists
        $sql = "SELECT userid, password FROM Users WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->execute(["email" => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
            exit;
        }

        // Verify password
        if (!password_verify($data["password"], $user["password"])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
            exit;
        }

        // TODO: Create session or JWT token here
        $conn->commit();
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
        ]);

    } catch (PDOException $e) {
        if($conn && $conn->inTransaction()){$conn->rollBack();}
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
?>

