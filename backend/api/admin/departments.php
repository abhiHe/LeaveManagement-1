
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $query = "SELECT * FROM tbldepartments ORDER BY id DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(array("success" => true, "data" => $departments));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO tbldepartments (DepartmentName, DepartmentShortName, DepartmentCode) VALUES (?, ?, ?)";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$data->departmentName, $data->departmentShortName, $data->departmentCode])) {
            echo json_encode(array("success" => true, "message" => "Department added successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to add department"));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE tbldepartments SET DepartmentName=?, DepartmentShortName=?, DepartmentCode=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$data->departmentName, $data->departmentShortName, $data->departmentCode, $data->id])) {
            echo json_encode(array("success" => true, "message" => "Department updated successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update department"));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "DELETE FROM tbldepartments WHERE id = ?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$data->id])) {
            echo json_encode(array("success" => true, "message" => "Department deleted successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to delete department"));
        }
        break;
}
?>
