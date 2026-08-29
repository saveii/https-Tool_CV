import React, { useState } from 'react';
import { useCV } from '../context/CVContext';
import { SocialConnectCard } from './SocialConnectCard';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    user,
    t,
    language
  } = useCV();

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone for Login
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  // Handle Standard Login / Register Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (authModalTab === 'login') {
      const res = await login(identifier, password);
      if (!res.success) setError(res.error || 'Invalid credentials');
    } else {
      if (!name.trim()) {
        setError(language === 'km' ? 'សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក' : 'Please enter your full name');
        setLoading(false);
        return;
      }
      if (!phone.trim()) {
        setError(language === 'km' ? 'សូមបញ្ចូលលេខទូរស័ព្ទ (1 លេខទូរស័ព្ទ = 1 គណនី)' : 'Please enter phone number (1 Account per Phone)');
        setLoading(false);
        return;
      }
      const res = await register(name, email, phone, password);
      if (!res.success) setError(res.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Glow ambient highlight */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button only if user is already logged in */}
        {user && (
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {authModalTab === 'login' ? t('signInTitle') : t('registerTitle')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'km'
              ? 'សូមភ្ជាប់គណនី ឬចុះឈ្មោះដើម្បីរក្សាទុក និងបង្កើត CV របស់អ្នក'
              : 'Connect your account to save and manage your professional CVs'}
          </p>
        </div>

        {/* 1-Click Social Connect Cards (4 States: Not Connected, Loading, Connected, Error) */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <SocialConnectCard provider="Google" isCompact={true} />
          <SocialConnectCard provider="Facebook" isCompact={true} />
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-semibold">
            {language === 'km' ? 'ឬ បង្កើតតាមលេខទូរស័ព្ទ / អ៊ីមែល' : 'or Phone / Email'}
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 my-3">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              authModalTab === 'login'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('signInBtn')}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('register');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              authModalTab === 'register'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('createAccountBtn')}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-3.5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {authModalTab === 'register' ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" /> {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Phone Number (1 Account per Phone Number) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {t('phone')} *
                  </label>
                  <span className="text-[10px] text-amber-400/90 font-medium">
                    {language === 'km' ? '⚡ 1 លេខទូរស័ព្ទ = 1 គណនី' : '⚡ 1 Account per Phone'}
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> {t('email')} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </>
          ) : (
            /* Login Identifier (Email or Phone Number) */
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>{language === 'km' ? 'លេខទូរស័ព្ទ ឬ អ៊ីមែល (Phone / Email)' : 'Phone Number or Email'}</span>
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Password with Show/Hide Toggle Button */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" /> {t('password')} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition focus:outline-none p-0.5"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition disabled:opacity-50 mt-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{authModalTab === 'login' ? t('signInBtn') : t('createAccountBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Security & Admin MySQL note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {language === 'km'
              ? 'ទិន្នន័យត្រូវបានការពារ និងរក្សាទុកក្នុង MySQL Database'
              : 'Securely saved to MySQL / Admin Database'}
          </span>
        </div>
      </div>
    </div>
  );
};
