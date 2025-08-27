
import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../contexts/AuthContext';
import { employeeAPI } from '../../services/api';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'New passwords do not match'
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Password must be at least 6 characters long'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await employeeAPI.changePassword({
        empId: user?.id,
        currentPassword,
        newPassword
      });

      if (response.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Password changed successfully'
        });
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
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
        detail: 'Failed to change password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card title="Change Password" className="shadow">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <Password
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-100"
                    feedback={false}
                    toggleMask
                    required
                  />
                </div>
                
                <div className="col-12">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <Password
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-100"
                    toggleMask
                    required
                  />
                </div>
                
                <div className="col-12">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <Password
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-100"
                    feedback={false}
                    toggleMask
                    required
                  />
                </div>
                
                <div className="col-12">
                  <Button
                    type="submit"
                    label="Change Password"
                    icon="pi pi-check"
                    loading={loading}
                    className="w-100"
                  />
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
