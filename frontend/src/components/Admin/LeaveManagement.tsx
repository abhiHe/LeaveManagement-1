
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { adminAPI } from '../../services/api';

const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [leaveDialog, setLeaveDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useRef<Toast>(null);

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: '0' },
    { label: 'Approved', value: '1' },
    { label: 'Rejected', value: '2' }
  ];

  const actionOptions = [
    { label: 'Approve', value: 1 },
    { label: 'Reject', value: 2 }
  ];

  useEffect(() => {
    loadLeaves();
  }, [statusFilter]);

  const loadLeaves = async () => {
    try {
      const response = await adminAPI.getLeaves(statusFilter);
      if (response.success) {
        setLeaves(response.data);
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load leaves'
      });
    }
  };

  const viewLeave = (leave: any) => {
    setSelectedLeave({
      ...leave,
      action: leave.Status,
      adminRemark: leave.AdminRemark || ''
    });
    setLeaveDialog(true);
  };

  const updateLeaveStatus = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.updateLeaveStatus({
        id: selectedLeave.id,
        status: selectedLeave.action,
        adminRemark: selectedLeave.adminRemark
      });

      if (response.success) {
        loadLeaves();
        setLeaveDialog(false);
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave status updated successfully'
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
        detail: 'Failed to update leave status'
      });
    } finally {
      setLoading(false);
    }
  };

  const statusBodyTemplate = (rowData: any) => {
    let className = '';
    let label = '';
    
    switch (rowData.Status) {
      case '0':
        className = 'bg-warning';
        label = 'Pending';
        break;
      case '1':
        className = 'bg-success';
        label = 'Approved';
        break;
      case '2':
        className = 'bg-danger';
        label = 'Rejected';
        break;
      default:
        className = 'bg-secondary';
        label = 'Unknown';
    }
    
    return <span className={`badge ${className}`}>{label}</span>;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        label="View Details"
        icon="pi pi-eye"
        className="p-button-info"
        onClick={() => viewLeave(rowData)}
      />
    );
  };

  const dateBodyTemplate = (rowData: any, field: string) => {
    const date = new Date(rowData[field]);
    return date.toLocaleDateString();
  };

  const header = (
    <div className="d-flex justify-content-between align-items-center">
      <h4>Manage Leave Applications</h4>
      <div>
        <Dropdown
          value={statusFilter}
          options={statusOptions}
          onChange={(e) => setStatusFilter(e.value)}
          className="me-2"
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <input
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="form-control"
          />
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      
      <DataTable
        value={leaves}
        header={header}
        globalFilter={globalFilter}
        paginator
        rows={10}
        className="p-datatable-gridlines"
        emptyMessage="No leave applications found."
      >
        <Column field="EmpId" header="Employee ID" sortable />
        <Column field="FirstName" header="Employee Name" sortable 
          body={(rowData) => `${rowData.FirstName} ${rowData.LastName}`} />
        <Column field="LeaveType" header="Leave Type" sortable />
        <Column field="FromDate" header="From Date" sortable 
          body={(rowData) => dateBodyTemplate(rowData, 'FromDate')} />
        <Column field="ToDate" header="To Date" sortable 
          body={(rowData) => dateBodyTemplate(rowData, 'ToDate')} />
        <Column body={statusBodyTemplate} header="Status" sortable />
        <Column body={actionBodyTemplate} header="Actions" />
      </DataTable>

      <Dialog
        visible={leaveDialog}
        style={{ width: '600px' }}
        header="Leave Application Details"
        modal
        onHide={() => setLeaveDialog(false)}
      >
        {selectedLeave && (
          <div className="row g-3">
            <div className="col-md-6">
              <strong>Employee:</strong> {selectedLeave.FirstName} {selectedLeave.LastName}
            </div>
            <div className="col-md-6">
              <strong>Employee ID:</strong> {selectedLeave.EmpId}
            </div>
            <div className="col-md-6">
              <strong>Leave Type:</strong> {selectedLeave.LeaveType}
            </div>
            <div className="col-md-6">
              <strong>Applied Date:</strong> {new Date(selectedLeave.PostingDate).toLocaleDateString()}
            </div>
            <div className="col-md-6">
              <strong>From Date:</strong> {new Date(selectedLeave.FromDate).toLocaleDateString()}
            </div>
            <div className="col-md-6">
              <strong>To Date:</strong> {new Date(selectedLeave.ToDate).toLocaleDateString()}
            </div>
            <div className="col-12">
              <strong>Description:</strong>
              <p className="mt-2">{selectedLeave.Description}</p>
            </div>
            
            {selectedLeave.Status === '0' && (
              <>
                <div className="col-12">
                  <label htmlFor="action" className="form-label">Action</label>
                  <Dropdown
                    id="action"
                    value={selectedLeave.action}
                    options={actionOptions}
                    onChange={(e) => setSelectedLeave({ ...selectedLeave, action: e.value })}
                    className="w-100"
                  />
                </div>
                
                <div className="col-12">
                  <label htmlFor="adminRemark" className="form-label">Admin Remark</label>
                  <InputTextarea
                    id="adminRemark"
                    value={selectedLeave.adminRemark}
                    onChange={(e) => setSelectedLeave({ ...selectedLeave, adminRemark: e.target.value })}
                    className="w-100"
                    rows={3}
                  />
                </div>
              </>
            )}
            
            {selectedLeave.AdminRemark && (
              <div className="col-12">
                <strong>Admin Remark:</strong>
                <p className="mt-2">{selectedLeave.AdminRemark}</p>
              </div>
            )}
            
            <div className="col-12 d-flex justify-content-end">
              <Button
                label="Close"
                icon="pi pi-times"
                onClick={() => setLeaveDialog(false)}
                className="p-button-text me-2"
              />
              {selectedLeave.Status === '0' && (
                <Button
                  label="Update Status"
                  icon="pi pi-check"
                  onClick={updateLeaveStatus}
                  loading={loading}
                />
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default LeaveManagement;
