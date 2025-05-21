import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // optional wrapper

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

const onSubmit = async (data: LoginFormData) => {
  try {
    setIsLoading(true);

    await login(data.email, data.password);
    toast.success('Login successful');
    localStorage.setItem('email', data.email)
  } catch (error: any) {
    console.error("Login error:", error);

    if (error.response) {
      // Backend responded with a status code outside 2xx
      const status = error.response.status;
      const msg = error.response.data?.message || 'An error occurred';

      if (status === 401) {
        toast.error('Invalid email or password');
      } else if (status === 400) {
        toast.error(`Validation failed: ${msg}`);
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(msg);
      }

    } else if (error.request) {
      // No response received
      toast.error('No response from server. Please check your connection.');
    } else {
      // Error setting up the request
      toast.error(error.message || 'Unexpected error occurred.');
    }

  } finally {
    setIsLoading(false);
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card shadow-custom"
    >
      <div className="text-center mb-6">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <LogIn size={24} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
        <p className="text-gray-600 mt-1">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={16} className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              className={`input-field pl-10 ${errors.email ? 'border-error focus:border-error' : ''}`}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label">Password</label>
            <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">Forgot password?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={16} className="text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              className={`input-field pl-10 ${errors.password ? 'border-error focus:border-error' : ''}`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
          </div>
          {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
            {...register('rememberMe')}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        {/* Submit */}
        <div>
  <button
    type="submit"
    className={`btn btn-primary w-full flex justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    disabled={isLoading}
    onClick={(e) => {
      if (isLoading) {
        e.preventDefault(); // prevent form submission if loading
      }
    }}
  >
    {isLoading ? (
      <>
        <span className="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        Signing in...
      </>
    ) : (
      'Sign in'
    )}
  </button>
</div>

      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
