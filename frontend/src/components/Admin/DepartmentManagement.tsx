
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { adminAPI } from '../../services/api';

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [departmentDialog, setDepartmentDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await adminAPI.getDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load departments'
      });
    }
  };

  const openNew = () => {
    setSelectedDepartment({
      departmentName: '',
      departmentShortName: '',
      departmentCode: ''
    });
    setDepartmentDialog(true);
  };

  const editDepartment = (department: any) => {
    setSelectedDepartment({
      ...department,
      departmentName: department.DepartmentName,
      departmentShortName: department.DepartmentShortName,
      departmentCode: department.DepartmentCode
    });
    setDepartmentDialog(true);
  };

  const deleteDepartment = (department: any) => {
    confirmDialog({
      message: 'Are you sure you want to delete this department?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await adminAPI.deleteDepartment(department.id);
          if (response.success) {
            loadDepartments();
            toast.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Department deleted successfully'
            });
          }
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete department'
          });
        }
      }
    });
  };

  const saveDepartment = async () => {
    setLoading(true);
    try {
      const response = selectedDepartment.id
        ? await adminAPI.updateDepartment(selectedDepartment)
        : await adminAPI.addDepartment(selectedDepartment);

      if (response.success) {
        loadDepartments();
        setDepartmentDialog(false);
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
        detail: 'Failed to save department'
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
          onClick={() => editDepartment(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => deleteDepartment(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="d-flex justify-content-between align-items-center">
      <h4>Manage Departments</h4>
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
        <Button label="Add Department" icon="pi pi-plus" onClick={openNew} />
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <DataTable
        value={departments}
        header={header}
        globalFilter={globalFilter}
        paginator
        rows={10}
        className="p-datatable-gridlines"
        emptyMessage="No departments found."
      >
        <Column field="DepartmentName" header="Department Name" sortable />
        <Column field="DepartmentShortName" header="Short Name" sortable />
        <Column field="DepartmentCode" header="Department Code" sortable />
        <Column body={actionBodyTemplate} header="Actions" />
      </DataTable>

      <Dialog
        visible={departmentDialog}
        style={{ width: '450px' }}
        header="Department Details"
        modal
        onHide={() => setDepartmentDialog(false)}
      >
        {selectedDepartment && (
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="departmentName" className="form-label">Department Name</label>
              <InputText
                id="departmentName"
                value={selectedDepartment.departmentName}
                onChange={(e) => setSelectedDepartment({ ...selectedDepartment, departmentName: e.target.value })}
                className="w-100"
                required
              />
            </div>
            
            <div className="col-12">
              <label htmlFor="departmentShortName" className="form-label">Short Name</label>
              <InputText
                id="departmentShortName"
                value={selectedDepartment.departmentShortName}
                onChange={(e) => setSelectedDepartment({ ...selectedDepartment, departmentShortName: e.target.value })}
                className="w-100"
                required
              />
            </div>
            
            <div className="col-12">
              <label htmlFor="departmentCode" className="form-label">Department Code</label>
              <InputText
                id="departmentCode"
                value={selectedDepartment.departmentCode}
                onChange={(e) => setSelectedDepartment({ ...selectedDepartment, departmentCode: e.target.value })}
                className="w-100"
                required
              />
            </div>
            
            <div className="col-12 d-flex justify-content-end">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setDepartmentDialog(false)}
                className="p-button-text me-2"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                onClick={saveDepartment}
                loading={loading}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default DepartmentManagement;
