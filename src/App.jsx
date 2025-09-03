import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import ProfessionalProfile from '@/pages/ProfessionalProfile';
import UserProfile from '@/pages/UserProfile';
import ProfessionalDashboard from '@/pages/ProfessionalDashboard';
import MessagesPage from '@/pages/MessagesPage';
import SearchResults from '@/pages/SearchResults';
import BookingPage from '@/pages/BookingPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/professional/:id" element={
        <ProtectedRoute>
          <ProfessionalProfile />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <ProfessionalDashboard />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <MessagesPage />
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <SearchResults />
        </ProtectedRoute>
      } />
      <Route path="/book/:id" element={
        <ProtectedRoute>
          <BookingPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen">
            <Helmet>
              <title>Nework - Encuentra Profesionales de Confianza</title>
              <meta name="description" content="Plataforma marketplace para conectar clientes con profesionales de servicios. Encuentra plomeros, electricistas, chefs, y más profesionales verificados." />
              <meta property="og:title" content="Nework - Encuentra Profesionales de Confianza" />
              <meta property="og:description" content="Conecta con profesionales verificados para todos tus servicios. Agenda citas, chatea directamente y califica tu experiencia." />
            </Helmet>
            <AppRoutes />
            <Toaster />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;