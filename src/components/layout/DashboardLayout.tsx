import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Upload, 
  FileSearch, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  ClipboardCheck,
  BarChart3,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const customerNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/customer' },
    { icon: Upload, label: 'Upload Claim', path: '/customer/upload' },
    { icon: FileText, label: 'My Claims', path: '/customer/claims' },
  ];

  const adjusterNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/adjuster' },
    { icon: ClipboardCheck, label: 'HITL Review', path: '/adjuster/hitl' },
    { icon: FileSearch, label: 'CAG Corrections', path: '/adjuster/cag' },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
  ];

  const navItems = user?.role === 'customer' 
    ? customerNavItems 
    : user?.role === 'adjuster' 
      ? adjusterNavItems 
      : adminNavItems;

  const roleLabels = {
    customer: 'Customer',
    adjuster: 'Adjuster',
    admin: 'Admin',
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
          <Shield className="h-7 w-7 text-primary" />
          <span className="font-semibold text-lg text-foreground">Claims</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'sidebar-item w-full',
                location.pathname === item.path 
                  ? 'sidebar-item-active' 
                  : 'sidebar-item-inactive'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {roleLabels[user?.role || 'customer']}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
