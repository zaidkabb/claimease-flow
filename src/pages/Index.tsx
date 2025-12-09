import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
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
};

export default Index;
