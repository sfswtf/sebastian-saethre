import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useLocalAuthStore } from '../stores/localAuthStore';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const navigate = useNavigate();
  const login = useLocalAuthStore((state) => state.login);
  const isAdmin = useLocalAuthStore((state) => state.isAdmin);
  
  // Import getState for debugging
  const getAuthState = useLocalAuthStore.getState;

  // Redirect if already logged in
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  const copyToClipboard = async (text: string, type: 'email' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      } else {
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);

    try {
      console.log('Attempting login with:', { email, password: '***' });
      const success = login(email.trim(), password);
      console.log('Login result:', success);
      
      if (success) {
        // Verify state was set
        const currentState = getAuthState();
        console.log('Current auth state:', currentState);
        
        toast.success('Logged in successfully');
        
        // Use window.location for more reliable navigation
        setTimeout(() => {
          window.location.href = '/admin';
        }, 200);
      } else {
        toast.error('Invalid email or password');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 px-4">
      <div className="max-w-md w-full p-8 bg-neutral-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-neutral-700">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-neutral-200 mb-2 text-sm font-medium">
              Username
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pr-10 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => copyToClipboard(email, 'email')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {emailCopied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-neutral-200 mb-2 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-20 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(password, 'password')}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {passwordCopied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-teal-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
} 