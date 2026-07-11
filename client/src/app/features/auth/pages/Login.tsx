import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { authService } from '../../../shared/services/auth.service';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await authService.login(email, password);
      // Assuming successful login returns data with accessToken
      if (response.success && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/dashboard');
      } else {
        setErrorMessage(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">
      {/* Left Column (Hidden on mobile) */}
      <div className="hidden md:flex w-1/2 flex-col">

        
        {/* Bottom Blue Section */}
        <div className="h-[100vh] w-full bg-[#3653d9] text-white p-12 flex flex-col justify-center">
          <div className="flex items-center mb-8">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 mr-3 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="text-2xl font-bold tracking-tight">Invision</span>
          </div>
          
          <div className="flex border-l-2 border-white/50 pl-6">
            <div>
              <h2 className="text-3xl font-light leading-tight mb-2">
                Welcome to <span className="font-bold">Invision</span>
              </h2>
              <h2 className="text-3xl font-bold leading-tight mb-4">
                Hospital Management System
              </h2>
              <p className="text-blue-100 text-sm max-w-md leading-relaxed">
                Cloud Based Streamline Hospital Management system with centralized user friendly platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo (Visible mainly on mobile, or as per design) */}
          <div className="flex items-center mb-12 text-[#3653d9]">
             <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 mr-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-gray-900">Invision</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-500">Enter your credentials to login to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="example.nazarbecks@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-3"
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-3 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm font-medium text-[#3653d9] hover:text-[#2940b3]">
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#3653d9] hover:bg-[#2940b3] text-white py-3 rounded-lg font-medium text-base transition-colors"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="#" className="font-semibold text-[#3653d9] hover:text-[#2940b3]">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
