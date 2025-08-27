
import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { useAuth } from '../../contexts/AuthContext';
import { employeeAPI, adminAPI } from '../../services/api';

const ApplyLeave: React.FC = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [leaveType, setLeaveType] = useState('');
  const [description, setDescription] = useState('');
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      const response = await adminAPI.getLeaveTypes();
      if (response.success) {
        setLeaveTypes(response.data.map((type: any) => ({
          label: type.LeaveType,
          value: type.LeaveType
        })));
      }
    } catch (error) {
      console.error('Error loading leave types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromDate || !toDate || !leaveType || !description) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all fields'
      });
      return;
    }

    if (fromDate > toDate) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'To Date should be greater than From Date'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await employeeAPI.applyLeave({
        empId: user?.id,
        leaveType,
        fromDate: fromDate.toISOString().split('T')[0],
        toDate: toDate.toISOString().split('T')[0],
        description
      });

      if (response.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave applied successfully'
        });
        // Reset form
        setFromDate(null);
        setToDate(null);
        setLeaveType('');
        setDescription('');
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
        detail: 'Failed to apply for leave'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <Card title="Apply for Leave" className="shadow">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="fromDate" className="form-label">From Date</label>
              <Calendar
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.value as Date)}
                className="w-100"
                dateFormat="yy-mm-dd"
                minDate={new Date()}
                required
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="toDate" className="form-label">To Date</label>
              <Calendar
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.value as Date)}
                className="w-100"
                dateFormat="yy-mm-dd"
                minDate={fromDate || new Date()}
                required
              />
            </div>
            
            <div className="col-12">
              <label htmlFor="leaveType" className="form-label">Leave Type</label>
              <Dropdown
                id="leaveType"
                value={leaveType}
                options={leaveTypes}
                onChange={(e) => setLeaveType(e.value)}
                className="w-100"
                placeholder="Select leave type"
                required
              />
            </div>
            
            <div className="col-12">
              <label htmlFor="description" className="form-label">Description</label>
              <InputTextarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-100"
                rows={4}
                placeholder="Enter reason for leave"
                required
              />
            </div>
            
            <div className="col-12">
              <Button
                type="submit"
                label="Apply for Leave"
                icon="pi pi-check"
                loading={loading}
                className="w-100"
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ApplyLeave;
