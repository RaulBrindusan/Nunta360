import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: t('login.success'),
          description: t('login.welcomeBack'),
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: t('login.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
            {t('login.welcome')}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blush-100">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-6 h-6 text-blush-400 mr-2" />
            <h2 className="text-2xl font-serif font-bold text-charcoal">
              {t('login.title')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={isLoading}
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
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal/60 hover:text-charcoal transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

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

            <Button
              type="submit"
              className="w-full bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold py-3 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? t('login.signingIn') : t('login.signIn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-charcoal/70">
              {t('login.noAccount')}{' '}
              <Link to="/signup" className="text-blush-400 hover:text-blush-500 font-medium transition-colors">
                {t('login.signUp')}
              </Link>
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

export default Login;
