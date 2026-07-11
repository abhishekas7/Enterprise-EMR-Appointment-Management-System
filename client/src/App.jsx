
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './app/features/auth/pages/Login';
import { Dashboard } from './app/features/dashboard/pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login to make it the first page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Catch all to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
