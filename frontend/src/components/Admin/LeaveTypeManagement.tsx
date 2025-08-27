
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { adminAPI } from '../../services/api';

const LeaveTypeManagement: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState<any>(null);
  const [leaveTypeDialog, setLeaveTypeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      const response = await adminAPI.getLeaveTypes();
      if (response.success) {
        setLeaveTypes(response.data);
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load leave types'
      });
    }
  };

  const openNew = () => {
    setSelectedLeaveType({
      leaveType: '',
      description: ''
    });
    setLeaveTypeDialog(true);
  };

  const editLeaveType = (leaveType: any) => {
    setSelectedLeaveType({
      ...leaveType,
      leaveType: leaveType.LeaveType,
      description: leaveType.Description
    });
    setLeaveTypeDialog(true);
  };

  const deleteLeaveType = (leaveType: any) => {
    confirmDialog({
      message: 'Are you sure you want to delete this leave type?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await adminAPI.deleteLeaveType(leaveType.id);
          if (response.success) {
            loadLeaveTypes();
            toast.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Leave type deleted successfully'
            });
          }
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete leave type'
          });
        }
      }
    });
  };

  const saveLeaveType = async () => {
    setLoading(true);
    try {
      const response = selectedLeaveType.id
        ? await adminAPI.updateLeaveType(selectedLeaveType)
        : await adminAPI.addLeaveType(selectedLeaveType);

      if (response.success) {
        loadLeaveTypes();
        setLeaveTypeDialog(false);
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
        detail: 'Failed to save leave type'
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
          onClick={() => editLeaveType(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => deleteLeaveType(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="d-flex justify-content-between align-items-center">
      <h4>Manage Leave Types</h4>
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
        <Button label="Add Leave Type" icon="pi pi-plus" onClick={openNew} />
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <DataTable
        value={leaveTypes}
        header={header}
        globalFilter={globalFilter}
        paginator
        rows={10}
        className="p-datatable-gridlines"
        emptyMessage="No leave types found."
      >
        <Column field="LeaveType" header="Leave Type" sortable />
        <Column field="Description" header="Description" sortable />
        <Column body={actionBodyTemplate} header="Actions" />
      </DataTable>

      <Dialog
        visible={leaveTypeDialog}
        style={{ width: '450px' }}
        header="Leave Type Details"
        modal
        onHide={() => setLeaveTypeDialog(false)}
      >
        {selectedLeaveType && (
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="leaveType" className="form-label">Leave Type</label>
              <InputText
                id="leaveType"
                value={selectedLeaveType.leaveType}
                onChange={(e) => setSelectedLeaveType({ ...selectedLeaveType, leaveType: e.target.value })}
                className="w-100"
                required
              />
            </div>
            
            <div className="col-12">
              <label htmlFor="description" className="form-label">Description</label>
              <InputTextarea
                id="description"
                value={selectedLeaveType.description}
                onChange={(e) => setSelectedLeaveType({ ...selectedLeaveType, description: e.target.value })}
                className="w-100"
                rows={3}
              />
            </div>
            
            <div className="col-12 d-flex justify-content-end">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setLeaveTypeDialog(false)}
                className="p-button-text me-2"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                onClick={saveLeaveType}
                loading={loading}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default LeaveTypeManagement;
