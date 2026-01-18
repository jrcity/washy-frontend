import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { Button, Input, Checkbox } from '@/components/ui';
import { useLogin } from '@/hooks/useAuth';
import { useAuthContext } from '@/context/AuthContext';
import { cn } from '@/lib';

export const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { login: contextLogin } = useAuthContext();
  const loginMutation = useLogin();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!phone) newErrors.phone = 'Phone number is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    loginMutation.mutate(
      { phone, password },
      {
        onSuccess: (response) => {
          if (response.data) {
            contextLogin(response.data.user, response.data.accessToken);
            // Navigate based on role
            const role = response.data.user.role;
            if (role === 'admin' || role === 'super_admin') {
              navigate('/admin');
            } else if (role === 'rider') {
              navigate('/rider');
            } else if (role === 'staff' || role === 'branch_manager') {
              navigate('/branch');
            } else {
              navigate('/dashboard');
            }
          }
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">W</span>
          </div>
          <span className="font-bold text-2xl text-neutral-900">Washy</span>
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back</h1>
        <p className="text-neutral-600">Sign in to continue to your account</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 801 234 5678"
            error={errors.phone}
            leftIcon={<Phone className="w-5 h-5" />}
            className={cn("mr-10")}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            error={errors.password}
            leftIcon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-neutral-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />

          <div className="flex items-center justify-between">
            <Checkbox 
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link 
              to="/forgot-password" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-neutral-600">Don't have an account? </span>
          <Link 
            to="/register" 
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="mt-6 p-5 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
        <p className="text-xs font-semibold text-neutral-700 mb-2">Demo Credentials</p>
        <div className="space-y-1">
          <p className="text-sm text-neutral-600">
            <span className="font-medium">Phone:</span> +2348100000006
          </p>
          <p className="text-sm text-neutral-600">
            <span className="font-medium">Password:</span> Customer@123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
