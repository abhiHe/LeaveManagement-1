
import React from 'react';
import { Button } from 'primereact/button';
import { useAuth } from '../../contexts/AuthContext';

interface EmployeeHeaderProps {
  onMenuClick: () => void;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Button
          icon="pi pi-bars"
          className="p-button-text p-button-plain"
          onClick={onMenuClick}
        />
        
        <span className="navbar-brand ms-2">Employee Portal</span>
        
        <div className="navbar-nav ms-auto">
          <span className="navbar-text me-3">
            Welcome, {user?.firstName} {user?.lastName}
          </span>
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            className="p-button-text p-button-plain"
            onClick={logout}
          />
        </div>
      </div>
    </nav>
  );
};

export default EmployeeHeader;
