
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toastRef = React.useRef<Toast>(null);

  const roles = [
    { label: 'Employee', value: 'employee' },
    { label: 'Admin', value: 'admin' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        navigate(role === 'admin' ? '/admin' : '/employee');
      } else {
        toastRef.current?.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid credentials'
        });
      }
    } catch (error) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <Toast ref={toastRef} />
      <div className="row w-100">
        <div className="col-md-4 mx-auto">
          <Card title="ELMS - Login" className="shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Login As</label>
                <Dropdown
                  id="role"
                  value={role}
                  options={roles}
                  onChange={(e) => setRole(e.value)}
                  className="w-100"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <InputText
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-100"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-100"
                  feedback={false}
                  toggleMask
                  required
                />
              </div>
              
              <Button
                type="submit"
                label="Login"
                loading={loading}
                className="w-100 p-3"
              />
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
