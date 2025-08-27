
import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useAuth } from '../../contexts/AuthContext';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const leftContents = (
    <div className="d-flex align-items-center">
      <Button
        icon="pi pi-bars"
        onClick={onMenuClick}
        className="p-button-text me-3"
      />
      <h4 className="mb-0">ELMS Admin</h4>
    </div>
  );

  const rightContents = (
    <div className="d-flex align-items-center">
      <span className="me-3">Welcome, {user?.email}</span>
      <Button
        label="Logout"
        icon="pi pi-sign-out"
        onClick={logout}
        className="p-button-outlined"
      />
    </div>
  );

  return (
    <Toolbar left={leftContents} right={rightContents} className="border-bottom" />
  );
};

export default AdminHeader;
