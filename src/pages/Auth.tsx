
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart, UserPlus, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { t } = useLanguage();
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success!",
            description: "Account created successfully. Please check your email to verify your account.",
          });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-blush-50 to-sage-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">
              Nunta<span className="text-blush-400">360</span>
            </h1>
          </Link>
          <p className="text-charcoal/70">
            {isSignUp ? 'Create your wedding planning account' : t('login.welcome')}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blush-100">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-6 h-6 text-blush-400 mr-2" />
            <h2 className="text-2xl font-serif font-bold text-charcoal">
              {isSignUp ? 'Create Account' : t('login.title')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-charcoal font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                    placeholder="Your first name"
                    required={isSignUp}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-charcoal font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                    placeholder="Your last name"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-charcoal font-medium">
                {t('login.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                placeholder={t('login.emailPlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-charcoal font-medium">
                {t('login.password')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 pr-10"
                  placeholder={t('login.passwordPlaceholder')}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blush-400 bg-white border-blush-300 rounded focus:ring-blush-400 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-charcoal/70">
                    {t('login.rememberMe')}
                  </span>
                </label>
                <a href="#" className="text-sm text-blush-400 hover:text-blush-500 transition-colors">
                  {t('login.forgotPassword')}
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold py-3 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-charcoal mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isSignUp ? <UserPlus className="w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
                  {isSignUp ? 'Create Account' : t('login.signIn')}
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-charcoal/70">
              {isSignUp ? 'Already have an account?' : t('login.noAccount')}{' '}
              <button
                onClick={toggleMode}
                className="text-blush-400 hover:text-blush-500 font-medium transition-colors"
              >
                {isSignUp ? 'Sign In' : t('login.signUp')}
              </button>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-charcoal/70 hover:text-charcoal transition-colors text-sm"
          >
            ← {t('login.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
