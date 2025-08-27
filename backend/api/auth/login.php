
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password) && !empty($data->role)) {
    $email = $data->email;
    $password = md5($data->password);
    $role = $data->role;

    if ($role === 'admin') {
        $query = "SELECT UserName, Password FROM admin WHERE UserName = :email AND Password = :password";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(array(
                "success" => true,
                "message" => "Login successful",
                "role" => "admin",
                "user" => $email
            ));
        } else {
            echo json_encode(array("success" => false, "message" => "Invalid credentials"));
        }
    } else {
        $query = "SELECT EmailId, Password, Status, id, FirstName, LastName FROM tblemployees WHERE EmailId = :email AND Password = :password";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row['Status'] == 0) {
                echo json_encode(array("success" => false, "message" => "Your account is inactive. Please contact admin"));
            } else {
                echo json_encode(array(
                    "success" => true,
                    "message" => "Login successful",
                    "role" => "employee",
                    "user" => array(
                        "id" => $row['id'],
                        "email" => $row['EmailId'],
                        "firstName" => $row['FirstName'],
                        "lastName" => $row['LastName']
                    )
                ));
            }
        } else {
            echo json_encode(array("success" => false, "message" => "Invalid credentials"));
        }
    }
} else {
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>
