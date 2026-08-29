import React from 'react';
import { useCV } from '../context/CVContext';
import {
  FileEdit,
  Eye,
  Sparkles,
  Palette,
  User,
  ShieldCheck
} from 'lucide-react';

export const MobileBottomNav = ({
  mobileView,
  setMobileView,
  onOpenAIImport,
  onOpenProfile,
  onOpenAdmin
}) => {
  const { user, language, activeTab, setActiveTab } = useCV();

  const isAdmin = user && (user.role === 'admin' || user.email?.includes('admin') || user.email === 'admin@toolcv.com');

  const handleFormTab = () => {
    if (activeTab === 'customize') {
      setActiveTab('personalInfo');
    }
    setMobileView('form');
  };

  const handleStyleTab = () => {
    setActiveTab('customize');
    setMobileView('form');
  };

  const isFormActive = mobileView === 'form' && activeTab !== 'customize';
  const isStyleActive = mobileView === 'style' || (mobileView === 'form' && activeTab === 'customize');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around lg:hidden shadow-2xl select-none">
      {/* 1. Editor Form Tab */}
      <button
        type="button"
        onClick={handleFormTab}
        aria-label={language === 'km' ? 'កែទម្រង់' : 'Form'}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition active:scale-95 ${
          isFormActive
            ? 'text-blue-400 font-bold bg-blue-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FileEdit className="w-4 h-4" />
        <span className="text-[10px]">{language === 'km' ? 'កែទម្រង់' : 'Form'}</span>
      </button>

      {/* 2. Live Preview Tab */}
      <button
        type="button"
        onClick={() => setMobileView('preview')}
        aria-label={language === 'km' ? 'មើល CV' : 'Preview'}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition active:scale-95 ${
          mobileView === 'preview'
            ? 'text-blue-400 font-bold bg-blue-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Eye className="w-4 h-4" />
        <span className="text-[10px]">{language === 'km' ? 'មើល CV' : 'Preview'}</span>
      </button>

      {/* 3. AI Smart Fill Action */}
      <button
        type="button"
        onClick={onOpenAIImport}
        aria-label="AI Scan & Import"
        className="flex flex-col items-center gap-1 py-1 px-2.5 text-indigo-400 hover:text-indigo-300 transition group active:scale-95"
      >
        <div className="w-8 h-8 -mt-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-active:scale-90 transition-transform">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-[9.5px] font-bold">{language === 'km' ? 'AI Scan' : 'AI Scan'}</span>
      </button>

      {/* 4. Style & Templates */}
      <button
        type="button"
        onClick={handleStyleTab}
        aria-label={language === 'km' ? 'ម៉ូដ & ពណ៌' : 'Styles'}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition active:scale-95 ${
          isStyleActive
            ? 'text-blue-400 font-bold bg-blue-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Palette className="w-4 h-4" />
        <span className="text-[10px]">{language === 'km' ? 'ម៉ូដ & ពណ៌' : 'Styles'}</span>
      </button>

      {/* 5. Account / Settings (Icon រូបមនុស្ស + Admin badge) */}
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label={user ? user.name : (language === 'km' ? 'គណនី' : 'Account')}
        className="flex flex-col items-center gap-1 py-1 px-2.5 text-slate-400 hover:text-slate-200 transition active:scale-95 relative"
      >
        <div className="relative flex items-center justify-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-4 h-4 rounded-full object-cover border border-blue-400"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          {isAdmin && (
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full border border-slate-900 flex items-center justify-center"
              title="Admin"
            >
              <ShieldCheck className="w-2 h-2 text-white" />
            </span>
          )}
        </div>
        <span className="text-[10px] truncate max-w-[60px]">
          {user ? user.name.split(' ')[0] : (language === 'km' ? 'គណនី' : 'Account')}
        </span>
      </button>
    </nav>
  );
};
