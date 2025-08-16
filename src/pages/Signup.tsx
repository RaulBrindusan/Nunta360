import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const Signup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: t('signup.error'),
        description: t('signup.passwordMismatch'),
        variant: 'destructive',
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: t('signup.error'),
        description: t('signup.agreeToTerms'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: t('signup.success'),
          description: t('signup.checkEmail'),
        });
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: t('signup.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-blush-50 to-sage-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">
              Nunta<span className="text-blush-400">360</span>
            </h1>
          </Link>
          <p className="text-charcoal/70">
            {t('signup.welcome')}
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blush-100">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-6 h-6 text-blush-400 mr-2" />
            <h2 className="text-2xl font-serif font-bold text-charcoal">
              {t('signup.title')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-charcoal font-medium">
                {t('signup.fullName')}
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                placeholder={t('signup.fullNamePlaceholder')}
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-charcoal font-medium">
                {t('signup.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                placeholder={t('signup.emailPlaceholder')}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-charcoal font-medium">
                {t('signup.password')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 pr-10"
                  placeholder={t('signup.passwordPlaceholder')}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-charcoal font-medium">
                {t('signup.confirmPassword')}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 pr-10"
                  placeholder={t('signup.confirmPasswordPlaceholder')}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal/60 hover:text-charcoal transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1"
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-sm text-charcoal/70">
                {t('signup.termsAgree')}{' '}
                <a href="#" className="text-blush-400 hover:text-blush-500">
                  {t('signup.terms')}
                </a>{' '}
                {t('signup.and')}{' '}
                <a href="#" className="text-blush-400 hover:text-blush-500">
                  {t('signup.privacy')}
                </a>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!agreedToTerms || isLoading}
              className="w-full bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold py-3 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('signup.creating') : t('signup.createAccount')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-charcoal/70">
              {t('signup.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-blush-400 hover:text-blush-500 font-medium transition-colors">
                {t('signup.signIn')}
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
            ← {t('signup.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup; 