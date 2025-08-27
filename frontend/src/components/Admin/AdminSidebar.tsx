
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';

interface AdminSidebarProps {
  visible: boolean;
  onHide: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ visible, onHide }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => navigate('/admin')
    },
    {
      label: 'Employees',
      icon: 'pi pi-users',
      command: () => navigate('/admin/employees')
    },
    {
      label: 'Departments',
      icon: 'pi pi-building',
      command: () => navigate('/admin/departments')
    },
    {
      label: 'Leave Types',
      icon: 'pi pi-list',
      command: () => navigate('/admin/leave-types')
    },
    {
      label: 'Manage Leaves',
      icon: 'pi pi-calendar',
      command: () => navigate('/admin/leaves')
    }
  ];

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      className="w-300px"
      header="Navigation"
    >
      <Menu model={menuItems} className="w-100 border-0" />
    </Sidebar>
  );
};

export default AdminSidebar;
