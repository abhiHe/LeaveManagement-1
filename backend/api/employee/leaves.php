
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $empId = $_GET['empId'];
        
        $query = "SELECT * FROM tblleaves WHERE empid = ? ORDER BY id DESC";
        $stmt = $db->prepare($query);
        $stmt->execute([$empId]);
        $leaves = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(array("success" => true, "data" => $leaves));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if ($data->fromDate > $data->toDate) {
            echo json_encode(array("success" => false, "message" => "To Date should be greater than From Date"));
            return;
        }
        
        $query = "INSERT INTO tblleaves (LeaveType, ToDate, FromDate, Description, Status, IsRead, empid) VALUES (?, ?, ?, ?, 0, 0, ?)";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$data->leaveType, $data->toDate, $data->fromDate, $data->description, $data->empId])) {
            echo json_encode(array("success" => true, "message" => "Leave applied successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to apply leave"));
        }
        break;
}
?>
