// SAHAYOG - Rural Employment Platform
// Main App Component

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { LanguageProvider } from '@/hooks/useLanguage';
import { Toaster } from '@/components/ui/sonner';
import { GlobalAIAssistant, AIFloatingButton } from '@/components/GlobalAIAssistant';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import OTPPage from '@/pages/auth/OTPPage';
import ProfileConfirmPage from '@/pages/auth/ProfileConfirmPage';
import LanguageSelectPage from '@/pages/auth/LanguageSelectPage';
import Dashboard from '@/pages/Dashboard';
import MGNREGAHome from '@/pages/mgnrega/MGNREGAHome';
import WorkList from '@/pages/mgnrega/WorkList';
import WorkDetail from '@/pages/mgnrega/WorkDetail';
import Attendance from '@/pages/mgnrega/Attendance';
import Payments from '@/pages/mgnrega/Payments';
import Grievance from '@/pages/mgnrega/Grievance';
import MyGrievances from '@/pages/mgnrega/MyGrievances';
import Profile from '@/pages/Profile';
import Schemes from '@/pages/schemes/Schemes';
import SchemeDetail from '@/pages/schemes/SchemeDetail';
import PMKISANPage from '@/pages/schemes/PMKISANPage';
import PMSYMPage from '@/pages/schemes/PMSYMPage';
import WidowPensionPage from '@/pages/schemes/WidowPensionPage';
import OldAgePensionPage from '@/pages/schemes/OldAgePensionPage';
import Notifications from '@/pages/Notifications';
import Help from '@/pages/Help';
import About from '@/pages/About';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import SkillsModule from '@/pages/skills/SkillsModule';
import MentalWellbeing from '@/pages/wellbeing/MentalWellbeing';
import LivingShelfDashboard from '@/pages/mgnrega/LivingShelfDashboard';

// Protected Route Component
import { useAuth } from '@/hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/verify" element={<OTPPage />} />
      <Route path="/auth/confirm-profile" element={<ProtectedRoute><ProfileConfirmPage /></ProtectedRoute>} />
      <Route path="/auth/language" element={<ProtectedRoute><LanguageSelectPage /></ProtectedRoute>} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* MGNREGA Routes */}
      <Route path="/mgnrega" element={<ProtectedRoute><MGNREGAHome /></ProtectedRoute>} />
      <Route path="/mgnrega/work" element={<ProtectedRoute><WorkList /></ProtectedRoute>} />
      <Route path="/mgnrega/work/:id" element={<ProtectedRoute><WorkDetail /></ProtectedRoute>} />
      <Route path="/mgnrega/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/mgnrega/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/mgnrega/grievance" element={<ProtectedRoute><Grievance /></ProtectedRoute>} />
      <Route path="/mgnrega/grievances" element={<ProtectedRoute><MyGrievances /></ProtectedRoute>} />
      <Route path="/mgnrega/living-shelf" element={<ProtectedRoute><LivingShelfDashboard /></ProtectedRoute>} />
      
      {/* Scheme Routes */}
      <Route path="/schemes" element={<ProtectedRoute><Schemes /></ProtectedRoute>} />
      <Route path="/schemes/:schemeId" element={<ProtectedRoute><SchemeDetail /></ProtectedRoute>} />
      <Route path="/schemes/pm-kisan" element={<ProtectedRoute><PMKISANPage /></ProtectedRoute>} />
      <Route path="/schemes/pm-sym" element={<ProtectedRoute><PMSYMPage /></ProtectedRoute>} />
      <Route path="/schemes/widow-pension" element={<ProtectedRoute><WidowPensionPage /></ProtectedRoute>} />
      <Route path="/schemes/old-age-pension" element={<ProtectedRoute><OldAgePensionPage /></ProtectedRoute>} />
      
      {/* Other Protected Routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/help" element={<Help />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      
      {/* Skills & Wellbeing Routes */}
      <Route path="/skills" element={<ProtectedRoute><SkillsModule /></ProtectedRoute>} />
      <Route path="/wellbeing" element={<ProtectedRoute><MentalWellbeing /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <AppRoutes />
            <Toaster position="top-center" richColors />
            
            {/* Global AI Assistant - Available on all pages */}
            <GlobalAIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
            <AIFloatingButton onClick={() => setIsAIOpen(true)} />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
