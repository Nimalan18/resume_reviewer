import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
          {/* Header Navbar */}
          <Navbar />
          
          {/* Page Routing */}
          <main className="flex-grow">
            <Routes>
              {/* Public Authentications Route */}
              <Route path="/login" element={<LoginRegister />} />
              
              {/* Secure Private Dashboards Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/upload" 
                element={
                  <PrivateRoute>
                    <UploadResume />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/result/:id" 
                element={
                  <PrivateRoute>
                    <ResultPage />
                  </PrivateRoute>
                } 
              />
              
              {/* Wildcard Fallback redirects */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
