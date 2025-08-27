
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $query = "SELECT * FROM tblleavetype ORDER BY id DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $leaveTypes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(array("success" => true, "data" => $leaveTypes));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO tblleavetype (LeaveType, Description) VALUES (?, ?)";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$data->leaveType, $data->description])) {
            echo json_encode(array("success" => true, "message" => "Leave type added successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to add leave type"));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE tblleavetype SET LeaveType=?, Description=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$data->leaveType, $data->description, $data->id])) {
            echo json_encode(array("success" => true, "message" => "Leave type updated successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update leave type"));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "DELETE FROM tblleavetype WHERE id = ?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$data->id])) {
            echo json_encode(array("success" => true, "message" => "Leave type deleted successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to delete leave type"));
        }
        break;
}
?>
