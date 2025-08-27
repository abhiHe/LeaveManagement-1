
<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get total employees
$empQuery = "SELECT COUNT(*) as total FROM tblemployees";
$empStmt = $db->prepare($empQuery);
$empStmt->execute();
$empCount = $empStmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get total departments
$deptQuery = "SELECT COUNT(*) as total FROM tbldepartments";
$deptStmt = $db->prepare($deptQuery);
$deptStmt->execute();
$deptCount = $deptStmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get total leave types
$leaveTypeQuery = "SELECT COUNT(*) as total FROM tblleavetype";
$leaveTypeStmt = $db->prepare($leaveTypeQuery);
$leaveTypeStmt->execute();
$leaveTypeCount = $leaveTypeStmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get pending leaves
$pendingQuery = "SELECT COUNT(*) as total FROM tblleaves WHERE Status = 0";
$pendingStmt = $db->prepare($pendingQuery);
$pendingStmt->execute();
$pendingCount = $pendingStmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get approved leaves
$approvedQuery = "SELECT COUNT(*) as total FROM tblleaves WHERE Status = 1";
$approvedStmt = $db->prepare($approvedQuery);
$approvedStmt->execute();
$approvedCount = $approvedStmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get rejected leaves
$rejectedQuery = "SELECT COUNT(*) as total FROM tblleaves WHERE Status = 2";
$rejectedStmt = $db->prepare($rejectedQuery);
$rejectedStmt->execute();
$rejectedCount = $rejectedStmt->fetch(PDO::FETCH_ASSOC)['total'];

echo json_encode(array(
    "success" => true,
    "data" => array(
        "totalEmployees" => $empCount,
        "totalDepartments" => $deptCount,
        "totalLeaveTypes" => $leaveTypeCount,
        "pendingLeaves" => $pendingCount,
        "approvedLeaves" => $approvedCount,
        "rejectedLeaves" => $rejectedCount
    )
));
?>
