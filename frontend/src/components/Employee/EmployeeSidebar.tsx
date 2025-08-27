
import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';

interface EmployeeSidebarProps {
  visible: boolean;
  onHide: () => void;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ visible, onHide }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => navigate('/employee')
    },
    {
      label: 'My Profile',
      icon: 'pi pi-user',
      command: () => navigate('/employee/profile')
    },
    {
      label: 'Apply Leave',
      icon: 'pi pi-plus',
      command: () => navigate('/employee/apply-leave')
    },
    {
      label: 'Leave History',
      icon: 'pi pi-history',
      command: () => navigate('/employee/leave-history')
    },
    {
      label: 'Change Password',
      icon: 'pi pi-key',
      command: () => navigate('/employee/change-password')
    }
  ];

  return (
    <Sidebar visible={visible} onHide={onHide} className="p-sidebar-md">
      <h4 className="mb-4">Employee Menu</h4>
      <Menu model={menuItems} className="w-100" />
    </Sidebar>
  );
};

export default EmployeeSidebar;
