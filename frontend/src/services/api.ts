
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/backend/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: async (data: { email: string; password: string; role: string }) => {
    const response = await apiClient.post('/auth/login.php', data);
    return response.data;
  },
};

export const adminAPI = {
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard.php');
    return response.data;
  },
  
  getEmployees: async () => {
    const response = await apiClient.get('/admin/employees.php');
    return response.data;
  },
  
  addEmployee: async (data: any) => {
    const response = await apiClient.post('/admin/employees.php', data);
    return response.data;
  },
  
  updateEmployee: async (data: any) => {
    const response = await apiClient.put('/admin/employees.php', data);
    return response.data;
  },
  
  deleteEmployee: async (id: number) => {
    const response = await apiClient.delete('/admin/employees.php', { data: { id } });
    return response.data;
  },
  
  getDepartments: async () => {
    const response = await apiClient.get('/admin/departments.php');
    return response.data;
  },
  
  addDepartment: async (data: any) => {
    const response = await apiClient.post('/admin/departments.php', data);
    return response.data;
  },
  
  updateDepartment: async (data: any) => {
    const response = await apiClient.put('/admin/departments.php', data);
    return response.data;
  },
  
  deleteDepartment: async (id: number) => {
    const response = await apiClient.delete('/admin/departments.php', { data: { id } });
    return response.data;
  },
  
  getLeaveTypes: async () => {
    const response = await apiClient.get('/admin/leave-types.php');
    return response.data;
  },
  
  addLeaveType: async (data: any) => {
    const response = await apiClient.post('/admin/leave-types.php', data);
    return response.data;
  },
  
  updateLeaveType: async (data: any) => {
    const response = await apiClient.put('/admin/leave-types.php', data);
    return response.data;
  },
  
  deleteLeaveType: async (id: number) => {
    const response = await apiClient.delete('/admin/leave-types.php', { data: { id } });
    return response.data;
  },
  
  // Department APIs
  getDepartments: async () => {
    const response = await apiClient.get('/admin/departments.php');
    return response.data;
  },
  
  addDepartment: async (data: any) => {
    const response = await apiClient.post('/admin/departments.php', data);
    return response.data;
  },
  
  updateDepartment: async (data: any) => {
    const response = await apiClient.put('/admin/departments.php', data);
    return response.data;
  },
  
  deleteDepartment: async (id: number) => {
    const response = await apiClient.delete('/admin/departments.php', { data: { id } });
    return response.data;
  },
  
  getLeaves: async (status: string = 'all') => {
    const response = await apiClient.get(`/admin/leaves.php?status=${status}`);
    return response.data;
  },
  
  updateLeaveStatus: async (data: { id: number; status: number; adminRemark: string }) => {
    const response = await apiClient.put('/admin/leaves.php', data);
    return response.data;
  },
};

// Employee APIs
export const employeeAPI = {
  getProfile: async (empId: number) => {
    const response = await apiClient.get(`/employee/profile.php?empId=${empId}`);
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/employee/profile.php', data);
    return response.data;
  },
  
  getLeaves: async (empId: number) => {
    const response = await apiClient.get(`/employee/leaves.php?empId=${empId}`);
    return response.data;
  },
  
  applyLeave: async (data: any) => {
    const response = await apiClient.post('/employee/leaves.php', data);
    return response.data;
  },
  
  changePassword: async (data: { empId: number; currentPassword: string; newPassword: string }) => {
    const response = await apiClient.post('/employee/change-password.php', data);
    return response.data;
  },
};

export const employeeAPI = {
  getProfile: async (empId: number) => {
    const response = await apiClient.get(`/employee/profile.php?empId=${empId}`);
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/employee/profile.php', data);
    return response.data;
  },
  
  getLeaves: async (empId: number) => {
    const response = await apiClient.get(`/employee/leaves.php?empId=${empId}`);
    return response.data;
  },
  
  applyLeave: async (data: any) => {
    const response = await apiClient.post('/employee/leaves.php', data);
    return response.data;
  },
  
  changePassword: async (data: { empId: number; currentPassword: string; newPassword: string }) => {
    const response = await apiClient.post('/employee/change-password.php', data);
    return response.data;
  },
};
