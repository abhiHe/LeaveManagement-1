
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { useAuth } from '../../contexts/AuthContext';
import { employeeAPI } from '../../services/api';

const LeaveHistory: React.FC = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      const response = await employeeAPI.getLeaves(user?.id);
      if (response.success) {
        setLeaves(response.data);
      }
    } catch (error) {
      console.error('Error loading leaves:', error);
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

  const dateBodyTemplate = (rowData: any, field: string) => {
    const date = new Date(rowData[field]);
    return date.toLocaleDateString();
  };

  return (
    <Card title="My Leave History" className="shadow">
      <DataTable
        value={leaves}
        loading={loading}
        paginator
        rows={10}
        className="p-datatable-gridlines"
        emptyMessage="No leave applications found."
      >
        <Column field="LeaveType" header="Leave Type" sortable />
        <Column field="FromDate" header="From Date" sortable 
          body={(rowData) => dateBodyTemplate(rowData, 'FromDate')} />
        <Column field="ToDate" header="To Date" sortable 
          body={(rowData) => dateBodyTemplate(rowData, 'ToDate')} />
        <Column field="Description" header="Description" />
        <Column field="PostingDate" header="Applied Date" sortable 
          body={(rowData) => dateBodyTemplate(rowData, 'PostingDate')} />
        <Column body={statusBodyTemplate} header="Status" sortable />
        <Column field="AdminRemark" header="Admin Remark" />
      </DataTable>
    </Card>
  );
};

export default LeaveHistory;
