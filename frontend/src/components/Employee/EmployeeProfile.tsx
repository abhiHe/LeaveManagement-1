
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../contexts/AuthContext';
import { employeeAPI } from '../../services/api';

const EmployeeProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const { user } = useAuth();

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await employeeAPI.getProfile(user?.id);
      if (response.success) {
        setProfile({
          ...response.data,
          dob: response.data.Dob ? new Date(response.data.Dob) : null
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load profile'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const profileData = {
        ...profile,
        dob: profile.dob ? profile.dob.toISOString().split('T')[0] : null
      };

      const response = await employeeAPI.updateProfile(profileData);
      if (response.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully'
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
        detail: 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Toast ref={toast} />
      
      <Card title="My Profile" className="shadow">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <InputText
                id="firstName"
                value={profile.FirstName || ''}
                onChange={(e) => setProfile({ ...profile, FirstName: e.target.value })}
                className="w-100"
                required
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <InputText
                id="lastName"
                value={profile.LastName || ''}
                onChange={(e) => setProfile({ ...profile, LastName: e.target.value })}
                className="w-100"
                required
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email</label>
              <InputText
                id="email"
                value={profile.EmailId || ''}
                className="w-100"
                disabled
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="empId" className="form-label">Employee ID</label>
              <InputText
                id="empId"
                value={profile.EmpId || ''}
                className="w-100"
                disabled
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="gender" className="form-label">Gender</label>
              <Dropdown
                id="gender"
                value={profile.Gender}
                options={genderOptions}
                onChange={(e) => setProfile({ ...profile, Gender: e.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="dob" className="form-label">Date of Birth</label>
              <Calendar
                id="dob"
                value={profile.dob}
                onChange={(e) => setProfile({ ...profile, dob: e.value })}
                className="w-100"
                dateFormat="yy-mm-dd"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Phone</label>
              <InputText
                id="phone"
                value={profile.Phonenumber || ''}
                onChange={(e) => setProfile({ ...profile, Phonenumber: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="department" className="form-label">Department</label>
              <InputText
                id="department"
                value={profile.Department || ''}
                className="w-100"
                disabled
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="country" className="form-label">Country</label>
              <InputText
                id="country"
                value={profile.Country || ''}
                onChange={(e) => setProfile({ ...profile, Country: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="city" className="form-label">City</label>
              <InputText
                id="city"
                value={profile.City || ''}
                onChange={(e) => setProfile({ ...profile, City: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-12">
              <label htmlFor="address" className="form-label">Address</label>
              <InputText
                id="address"
                value={profile.Address || ''}
                onChange={(e) => setProfile({ ...profile, Address: e.target.value })}
                className="w-100"
              />
            </div>
            
            <div className="col-12">
              <Button
                type="submit"
                label="Update Profile"
                icon="pi pi-check"
                loading={loading}
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EmployeeProfile;
