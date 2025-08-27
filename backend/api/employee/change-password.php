
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->empId) && !empty($data->currentPassword) && !empty($data->newPassword)) {
    $empId = $data->empId;
    $currentPassword = md5($data->currentPassword);
    $newPassword = md5($data->newPassword);
    
    // Verify current password
    $query = "SELECT Password FROM tblemployees WHERE id = ? AND Password = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$empId, $currentPassword]);
    
    if ($stmt->rowCount() > 0) {
        // Update password
        $updateQuery = "UPDATE tblemployees SET Password = ? WHERE id = ?";
        $updateStmt = $db->prepare($updateQuery);
        
        if ($updateStmt->execute([$newPassword, $empId])) {
            echo json_encode(array("success" => true, "message" => "Password changed successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update password"));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "Current password is incorrect"));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>
