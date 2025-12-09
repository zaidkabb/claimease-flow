import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/claims';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, User, ClipboardCheck, Settings } from 'lucide-react';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    
    // Navigate to appropriate dashboard based on role
    const dashboardPaths: Record<UserRole, string> = {
      customer: '/customer',
      adjuster: '/adjuster',
      admin: '/admin',
    };
    navigate(dashboardPaths[selectedRole]);
  };

  const roleOptions = [
    { value: 'customer' as UserRole, label: 'Customer', icon: User, description: 'Submit and track claims' },
    { value: 'adjuster' as UserRole, label: 'Adjuster', icon: ClipboardCheck, description: 'Review AI outputs' },
    { value: 'admin' as UserRole, label: 'Admin', icon: Settings, description: 'Manage system & analytics' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">Claims</span>
          </div>
          <p className="text-muted-foreground">Insurance Claims AI System</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Role</Label>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                  className="grid gap-3"
                >
                  {roleOptions.map((role) => (
                    <div key={role.value}>
                      <RadioGroupItem
                        value={role.value}
                        id={role.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={role.value}
                        className="flex items-center gap-3 rounded-lg border-2 border-input p-4 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <role.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{role.label}</p>
                          <p className="text-xs text-muted-foreground">{role.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">
                  Forgot Password?
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
