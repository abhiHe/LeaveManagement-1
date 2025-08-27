
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $query = "SELECT e.*, d.DepartmentName FROM tblemployees e LEFT JOIN tbldepartments d ON e.Department = d.DepartmentName ORDER BY e.id DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(array("success" => true, "data" => $employees));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO tblemployees (EmpId, FirstName, LastName, EmailId, Password, Gender, Dob, Department, Address, City, Country, Phonenumber, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        
        $password = md5($data->password);
        $status = 1;
        
        if ($stmt->execute([
            $data->empId, $data->firstName, $data->lastName, $data->emailId, 
            $password, $data->gender, $data->dob, $data->department, 
            $data->address, $data->city, $data->country, $data->phonenumber, $status
        ])) {
            echo json_encode(array("success" => true, "message" => "Employee added successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to add employee"));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE tblemployees SET FirstName=?, LastName=?, Gender=?, Dob=?, Department=?, Address=?, City=?, Country=?, Phonenumber=?, Status=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([
            $data->firstName, $data->lastName, $data->gender, $data->dob, 
            $data->department, $data->address, $data->city, $data->country, 
            $data->phonenumber, $data->status, $data->id
        ])) {
            echo json_encode(array("success" => true, "message" => "Employee updated successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update employee"));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "DELETE FROM tblemployees WHERE id = ?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$data->id])) {
            echo json_encode(array("success" => true, "message" => "Employee deleted successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to delete employee"));
        }
        break;
}
?>
