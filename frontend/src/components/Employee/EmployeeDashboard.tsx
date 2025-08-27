
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeHeader from './EmployeeHeader';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeProfile from './EmployeeProfile';
import ApplyLeave from './ApplyLeave';
import LeaveHistory from './LeaveHistory';
import ChangePassword from './ChangePassword';

const EmployeeDashboard: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const DashboardHome = () => (
    <div className="row">
      <div className="col-12">
        <h2 className="mb-4">Employee Dashboard</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Apply for Leave</h5>
                <p className="card-text">Submit a new leave application</p>
                <a href="/employee/apply-leave" className="btn btn-primary">Apply Leave</a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Leave History</h5>
                <p className="card-text">View your leave application history</p>
                <a href="/employee/leave-history" className="btn btn-primary">View History</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex">
      <EmployeeSidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
      
      <div className="flex-grow-1">
        <EmployeeHeader onMenuClick={() => setSidebarVisible(true)} />
        
        <div className="container-fluid p-4">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/profile" element={<EmployeeProfile />} />
            <Route path="/apply-leave" element={<ApplyLeave />} />
            <Route path="/leave-history" element={<LeaveHistory />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
