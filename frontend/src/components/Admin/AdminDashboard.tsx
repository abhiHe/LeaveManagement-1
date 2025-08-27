
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import EmployeeManagement from './EmployeeManagement';
import DepartmentManagement from './DepartmentManagement';
import LeaveTypeManagement from './LeaveTypeManagement';
import LeaveManagement from './LeaveManagement';
import { adminAPI } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const DashboardHome = () => (
    <div className="row">
      <div className="col-12">
        <h2 className="mb-4">Admin Dashboard</h2>
        
        <div className="row g-4">
          <div className="col-md-3">
            <Card className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Total Employees</h5>
                  <h2>{dashboardData?.totalEmployees || 0}</h2>
                </div>
                <i className="pi pi-users" style={{ fontSize: '2rem' }}></i>
              </div>
            </Card>
          </div>
          
          <div className="col-md-3">
            <Card className="bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Departments</h5>
                  <h2>{dashboardData?.totalDepartments || 0}</h2>
                </div>
                <i className="pi pi-building" style={{ fontSize: '2rem' }}></i>
              </div>
            </Card>
          </div>
          
          <div className="col-md-3">
            <Card className="bg-info text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Leave Types</h5>
                  <h2>{dashboardData?.totalLeaveTypes || 0}</h2>
                </div>
                <i className="pi pi-list" style={{ fontSize: '2rem' }}></i>
              </div>
            </Card>
          </div>
          
          <div className="col-md-3">
            <Card className="bg-warning text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Pending Leaves</h5>
                  <h2>{dashboardData?.pendingLeaves || 0}</h2>
                </div>
                <i className="pi pi-clock" style={{ fontSize: '2rem' }}></i>
              </div>
            </Card>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <Panel header="Leave Statistics">
              <div className="row text-center">
                <div className="col-4">
                  <h4 className="text-success">{dashboardData?.approvedLeaves || 0}</h4>
                  <p>Approved</p>
                </div>
                <div className="col-4">
                  <h4 className="text-warning">{dashboardData?.pendingLeaves || 0}</h4>
                  <p>Pending</p>
                </div>
                <div className="col-4">
                  <h4 className="text-danger">{dashboardData?.rejectedLeaves || 0}</h4>
                  <p>Rejected</p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex">
      <AdminSidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
      
      <div className="flex-grow-1">
        <AdminHeader onMenuClick={() => setSidebarVisible(true)} />
        
        <div className="container-fluid p-4">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/departments" element={<DepartmentManagement />} />
            <Route path="/leave-types" element={<LeaveTypeManagement />} />
            <Route path="/leaves" element={<LeaveManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
