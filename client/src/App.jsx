import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Login } from './app/features/auth/pages/Login';
import { Dashboard } from './app/features/dashboard/pages/Dashboard';
import { tokenStore, axiosInstance } from './app/shared/utils/axiosInstance';

const ProtectedRoute = () => {
  // null = checking | true = authenticated | false = not authenticated
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Fast path — token already in memory
      if (tokenStore.get()) {
        setAuthStatus(true);
        return;
      }

      // Slow path — try silent refresh via HttpOnly cookie
      try {
        const response = await axiosInstance.post('/api/v1/auth/refresh');
        const newToken = response.data?.data?.accessToken;
        if (newToken) {
          tokenStore.set(newToken);
          setAuthStatus(true);
        } else {
          setAuthStatus(false);
        }
      } catch {
        // Cookie missing, expired, or revoked — force login
        setAuthStatus(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state while auth check runs
  if (authStatus === null) {
    return (
      <div
        role="status"
        aria-label="Checking authentication"
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <svg
          className="animate-spin h-8 w-8 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  // Not authenticated → redirect, replace keeps /dashboard out of history
  if (!authStatus) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated → render the matched child route via Outlet
  return <Outlet />;
};

// ---------------------------------------------------------------------------
// App / Route tree
// ---------------------------------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes — all children require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Catch-all → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
