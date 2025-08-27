
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $status = isset($_GET['status']) ? $_GET['status'] : 'all';
        
        $query = "SELECT l.*, e.FirstName, e.LastName, e.EmpId FROM tblleaves l 
                 JOIN tblemployees e ON l.empid = e.id";
        
        if ($status !== 'all') {
            $query .= " WHERE l.Status = " . intval($status);
        }
        
        $query .= " ORDER BY l.id DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        $leaves = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(array("success" => true, "data" => $leaves));
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE tblleaves SET Status=?, AdminRemark=?, AdminRemarkDate=NOW() WHERE id=?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$data->status, $data->adminRemark, $data->id])) {
            echo json_encode(array("success" => true, "message" => "Leave status updated successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update leave status"));
        }
        break;
}
?>
