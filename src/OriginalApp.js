import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import ListingWizard from './pages/ListingWizard';
import VirtualStaging from './pages/VirtualStaging';
import SocialContent from './pages/SocialContent';
import Leads from './pages/Leads';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="listings" element={<Listings />} />
        <Route path="listings/new" element={<ListingWizard />} />
        <Route path="staging" element={<VirtualStaging />} />
        <Route path="social" element={<SocialContent />} />
        <Route path="leads" element={<Leads />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>
    </Routes>
  );
}

export default App;