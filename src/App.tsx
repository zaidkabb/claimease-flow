import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Pages
import Login from "@/pages/Login";
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import UploadClaim from "@/pages/customer/UploadClaim";
import ClaimProcessing from "@/pages/ClaimProcessing";
import AdjusterDashboard from "@/pages/adjuster/AdjusterDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPaths = {
      customer: '/customer',
      adjuster: '/adjuster',
      admin: '/admin',
    };
    return <Navigate to={dashboardPaths[user.role]} replace />;
  }
  
  return <>{children}</>;
}

// Auth Redirect Component
function AuthRedirect() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const dashboardPaths = {
    customer: '/customer',
    adjuster: '/adjuster',
    admin: '/admin',
  };
  
  return <Navigate to={dashboardPaths[user!.role]} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Root Redirect */}
      <Route path="/" element={<AuthRedirect />} />
      
      {/* Customer Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/upload"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <UploadClaim />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/claims"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Adjuster Routes */}
      <Route
        path="/adjuster"
        element={
          <ProtectedRoute allowedRoles={['adjuster']}>
            <AdjusterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjuster/hitl"
        element={
          <ProtectedRoute allowedRoles={['adjuster']}>
            <AdjusterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjuster/cag"
        element={
          <ProtectedRoute allowedRoles={['adjuster']}>
            <AdjusterDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Claim Processing - Accessible by all authenticated users */}
      <Route
        path="/claim/:id"
        element={
          <ProtectedRoute>
            <ClaimProcessing />
          </ProtectedRoute>
        }
      />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
