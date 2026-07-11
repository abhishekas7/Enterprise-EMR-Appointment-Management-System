import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/button';

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle actual logout logic here
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white shadow-sm border-b px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-900">EMR Dashboard</h1>
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </header>
      
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Appointments</h3>
              <p className="text-3xl font-bold text-indigo-600">12</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Requests</h3>
              <p className="text-3xl font-bold text-amber-600">4</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Patients</h3>
              <p className="text-3xl font-bold text-emerald-600">1,248</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/appointments/book')}>Book Appointment</Button>
            <Button variant="secondary" onClick={() => navigate('/appointments')}>View Schedule</Button>
          </div>
        </section>
      </main>
    </div>
  );
};
