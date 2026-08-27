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
  const { user, t, language } = useCV();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around xl:hidden shadow-2xl">
      {/* 1. Editor Form Tab */}
      <button
        onClick={() => setMobileView('form')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
          mobileView === 'form'
            ? 'text-blue-400 font-bold bg-blue-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FileEdit className="w-4 h-4" />
        <span className="text-[10px]">{language === 'km' ? 'កែទម្រង់' : 'Form'}</span>
      </button>

      {/* 2. Live Preview Tab */}
      <button
        onClick={() => setMobileView('preview')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
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
        onClick={onOpenAIImport}
        className="flex flex-col items-center gap-1 py-1 px-2.5 text-indigo-400 hover:text-indigo-300 transition"
      >
        <div className="w-8 h-8 -mt-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-[9.5px] font-bold">{language === 'km' ? 'AI Scan' : 'AI Scan'}</span>
      </button>

      {/* 4. Style & Templates */}
      <button
        onClick={() => setMobileView('style')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
          mobileView === 'style'
            ? 'text-blue-400 font-bold bg-blue-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Palette className="w-4 h-4" />
        <span className="text-[10px]">{language === 'km' ? 'ម៉ូដ & ពណ៌' : 'Styles'}</span>
      </button>

      {/* 5. Account / Admin */}
      <button
        onClick={user ? onOpenProfile : onOpenAdmin}
        className="flex flex-col items-center gap-1 py-1 px-2.5 text-slate-400 hover:text-slate-200 transition"
      >
        <User className="w-4 h-4" />
        <span className="text-[10px]">{user ? user.name.split(' ')[0] : 'Account'}</span>
      </button>
    </nav>
  );
};
