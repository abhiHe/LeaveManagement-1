
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { adminAPI } from '../../services/api';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = useRef<Toast>(null);

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
  ];

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await adminAPI.getEmployees();
      if (response.success) {
        setEmployees(response.data);
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load employees'
      });
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await adminAPI.getDepartments();
      if (response.success) {
        setDepartments(response.data.map((dept: any) => ({
          label: dept.DepartmentName,
          value: dept.DepartmentName
        })));
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const openNew = () => {
    setSelectedEmployee({
      empId: '',
      firstName: '',
      lastName: '',
      emailId: '',
      password: '',
      gender: '',
      dob: null,
      department: '',
      address: '',
      city: '',
      country: '',
      phonenumber: '',
      status: 1
    });
    setEmployeeDialog(true);
  };

  const editEmployee = (employee: any) => {
    setSelectedEmployee({
      ...employee,
      dob: employee.Dob ? new Date(employee.Dob) : null
    });
    setEmployeeDialog(true);
  };

  const deleteEmployee = (employee: any) => {
    confirmDialog({
      message: 'Are you sure you want to delete this employee?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await adminAPI.deleteEmployee(employee.id);
          if (response.success) {
            loadEmployees();
            toast.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee deleted successfully'
            });
          }
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete employee'
          });
        }
      }
    });
  };

  const saveEmployee = async () => {
    setLoading(true);
    try {
      const employeeData = {
        ...selectedEmployee,
        dob: selectedEmployee.dob ? selectedEmployee.dob.toISOString().split('T')[0] : null
      };

      const response = selectedEmployee.id
        ? await adminAPI.updateEmployee(employeeData)
        : await adminAPI.addEmployee(employeeData);

      if (response.success) {
        loadEmployees();
        setEmployeeDialog(false);
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: response.message
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save employee'
      });
    } finally {
      setLoading(false);
    }
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success me-2"
          onClick={() => editEmployee(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => deleteEmployee(rowData)}
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <span className={`badge ${rowData.Status === 1 ? 'bg-success' : 'bg-danger'}`}>
        {rowData.Status === 1 ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const header = (
    <div className="d-flex justify-content-between align-items-center">
      <h4>Manage Employees</h4>
      <div>
        <span className="p-input-icon-left me-2">
          <i className="pi pi-search" />
          <InputText
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </span>
        <Button label="Add Employee" icon="pi pi-plus" onClick={openNew} />
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <DataTable
        value={employees}
        header={header}
        globalFilter={globalFilter}
        paginator
        rows={10}
        className="p-datatable-gridlines"
        emptyMessage="No employees found."
      >
        <Column field="EmpId" header="Employee ID" sortable />
        <Column field="FirstName" header="First Name" sortable />
        <Column field="LastName" header="Last Name" sortable />
        <Column field="EmailId" header="Email" sortable />
        <Column field="Department" header="Department" sortable />
        <Column field="Phonenumber" header="Phone" sortable />
        <Column body={statusBodyTemplate} header="Status" sortable />
        <Column body={actionBodyTemplate} header="Actions" />
      </DataTable>

      <Dialog
        visible={employeeDialog}
        style={{ width: '600px' }}
        header="Employee Details"
        modal
        onHide={() => setEmployeeDialog(false)}
      >
        {selectedEmployee && (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="empId" className="form-label">Employee ID</label>
              <InputText
                id="empId"
                value={selectedEmployee.empId || selectedEmployee.EmpId}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, empId: e.target.value })}
                className="w-100"
                disabled={!!selectedEmployee.id}
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <InputText
                id="firstName"
                value={selectedEmployee.firstName || selectedEmployee.FirstName}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, firstName: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <InputText
                id="lastName"
                value={selectedEmployee.lastName || selectedEmployee.LastName}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, lastName: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="emailId" className="form-label">Email</label>
              <InputText
                id="emailId"
                value={selectedEmployee.emailId || selectedEmployee.EmailId}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, emailId: e.target.value })}
                className="w-100"
                disabled={!!selectedEmployee.id}
              />
            </div>
            
            {!selectedEmployee.id && (
              <div className="col-md-6">
                <label htmlFor="password" className="form-label">Password</label>
                <InputText
                  id="password"
                  value={selectedEmployee.password}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, password: e.target.value })}
                  className="w-100"
                  type="password"
                />
              </div>
            )}
            
            <div className="col-md-6">
              <label htmlFor="gender" className="form-label">Gender</label>
              <Dropdown
                id="gender"
                value={selectedEmployee.gender || selectedEmployee.Gender}
                options={genderOptions}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, gender: e.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="dob" className="form-label">Date of Birth</label>
              <Calendar
                id="dob"
                value={selectedEmployee.dob}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, dob: e.value })}
                className="w-100"
                dateFormat="yy-mm-dd"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="department" className="form-label">Department</label>
              <Dropdown
                id="department"
                value={selectedEmployee.department || selectedEmployee.Department}
                options={departments}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department: e.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="phonenumber" className="form-label">Phone</label>
              <InputText
                id="phonenumber"
                value={selectedEmployee.phonenumber || selectedEmployee.Phonenumber}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phonenumber: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="country" className="form-label">Country</label>
              <InputText
                id="country"
                value={selectedEmployee.country || selectedEmployee.Country}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, country: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="city" className="form-label">City</label>
              <InputText
                id="city"
                value={selectedEmployee.city || selectedEmployee.City}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, city: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-12">
              <label htmlFor="address" className="form-label">Address</label>
              <InputText
                id="address"
                value={selectedEmployee.address || selectedEmployee.Address}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, address: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="status" className="form-label">Status</label>
              <Dropdown
                id="status"
                value={selectedEmployee.status || selectedEmployee.Status}
                options={statusOptions}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, status: e.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-12 d-flex justify-content-end">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setEmployeeDialog(false)}
                className="p-button-text me-2"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                onClick={saveEmployee}
                loading={loading}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
