import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Alerts } from './pages/Alerts';
import { AuditLogs } from './pages/AuditLogs';
import { Billing } from './pages/Billing';
import { Dashboard } from './pages/Dashboard';
import { Devices } from './pages/Devices';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Organization } from './pages/Organization';
import { Settings } from './pages/Settings';

export const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="devices" element={<Devices />} />
        <Route path="billing" element={<Billing />} />
        
        <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']} />}>
          <Route path="alerts" element={<Alerts />} />
          <Route path="organization" element={<Organization />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
