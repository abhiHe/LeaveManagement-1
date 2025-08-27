
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $empId = $_GET['empId'];
        
        $query = "SELECT * FROM tblemployees WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$empId]);
        $employee = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($employee) {
            echo json_encode(array("success" => true, "data" => $employee));
        } else {
            echo json_encode(array("success" => false, "message" => "Employee not found"));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE tblemployees SET FirstName=?, LastName=?, Gender=?, Dob=?, Department=?, Address=?, City=?, Country=?, Phonenumber=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([
            $data->firstName, $data->lastName, $data->gender, $data->dob, 
            $data->department, $data->address, $data->city, $data->country, 
            $data->phonenumber, $data->id
        ])) {
            echo json_encode(array("success" => true, "message" => "Profile updated successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update profile"));
        }
        break;
}
?>
