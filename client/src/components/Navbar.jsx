import React, { useRef, useState } from 'react';
import { useCV } from '../context/CVContext';
import { TEMPLATES, THEME_COLORS } from '../data/initialCV';
import {
  FileCode,
  Download,
  Save,
  Upload,
  User,
  LogOut,
  Sparkles,
  Layers,
  Palette,
  Languages,
  ChevronDown,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';

export const Navbar = ({ onOpenProfileModal, onOpenAdminModal, onOpenAIImportModal }) => {
  const {
    settings,
    updateSetting,
    resetToSample,
    clearAllData,
    exportPDF,
    exportJSON,
    importJSON,
    saveCV,
    user,
    logout,
    setIsAuthModalOpen,
    setAuthModalTab,
    isExporting,
    language,
    setLanguage,
    t
  } = useCV();

  const fileImportRef = useRef(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <header className="h-14 sm:h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-2.5 sm:px-4 lg:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
          <FileCode className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              {t('brandTitle')}
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              {t('proBuilder')}
            </span>
          </div>
        </div>
      </div>

      {/* Center Quick Template & Color Switcher (Desktop only) */}
      <div className="hidden xl:flex items-center gap-3">
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 px-2.5 flex items-center gap-1.5 whitespace-nowrap">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('template')}:</span>
          </span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => updateSetting('template', tmpl.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                settings.template === tmpl.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 px-1.5 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" />
          </span>
          {THEME_COLORS.slice(0, 5).map((color) => (
            <button
              key={color.value}
              onClick={() => updateSetting('themeColor', color.value)}
              className={`w-5 h-5 rounded-full transition ${
                settings.themeColor === color.value ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsLangOpen(!isLangOpen);
              setIsSampleOpen(false);
              setIsMoreOpen(false);
            }}
            className="px-2 sm:px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition"
            title="Switch Language / ប្តូរភាសា"
          >
            <Languages className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">{language === 'km' ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-50 animate-fadeIn">
              <button
                onClick={() => {
                  setLanguage('km');
                  setIsLangOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                  language === 'km' ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🇰🇭 ភាសាខ្មែរ</span>
                {language === 'km' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  setIsLangOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                  language === 'en' ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🇬🇧 English</span>
                {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Sample Data Dropdown (Desktop & Tablet) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setIsSampleOpen(!isSampleOpen);
              setIsLangOpen(false);
              setIsMoreOpen(false);
            }}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            title="Pre-fill with sample CV data"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('sampleData')}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isSampleOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-50 animate-fadeIn">
              <button
                onClick={() => {
                  resetToSample('km');
                  setIsSampleOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
              >
                <span>🇰🇭</span>
                <span>{t('sampleKhmer')}</span>
              </button>
              <button
                onClick={() => {
                  resetToSample('en');
                  setIsSampleOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
              >
                <span>🇬🇧</span>
                <span>{t('sampleEnglish')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Admin MySQL DB Viewer Button (Desktop - Strictly Admin Only) */}
        {user && (user.role === 'admin' || user.email?.includes('admin') || user.email === 'admin@toolcv.com') && (
          <button
            onClick={onOpenAdminModal}
            className="hidden lg:flex px-2.5 py-1.5 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold items-center gap-1.5 transition shadow-sm"
            title="Open Admin MySQL Database Management"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin DB</span>
          </button>
        )}

        {/* JSON Backup & Restore (Desktop) */}
        <input
          type="file"
          ref={fileImportRef}
          onChange={importJSON}
          accept=".json"
          className="hidden"
        />
        <div className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => fileImportRef.current?.click()}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
            title={t('importBackup')}
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={exportJSON}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
            title={t('exportBackup')}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cloud Save Button */}
        <button
          onClick={() => saveCV()}
          className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          title="Save CV to Cloud"
        >
          <Save className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">{t('saveCloud')}</span>
        </button>

        {/* More Actions Dropdown on Mobile (< 1024px) */}
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => {
              setIsMoreOpen(!isMoreOpen);
              setIsLangOpen(false);
              setIsSampleOpen(false);
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMoreOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn space-y-1">
              <button
                type="button"
                onClick={() => {
                  resetToSample('km');
                  setIsMoreOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
              >
                <span>🇰🇭 គំរូភាសាខ្មែរ</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToSample('en');
                  setIsMoreOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
              >
                <span>🇬🇧 English Sample</span>
              </button>
              <div className="border-t border-slate-800 my-1" />
              {user && (user.role === 'admin' || user.email?.includes('admin') || user.email === 'admin@toolcv.com') && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAdminModal && onOpenAdminModal();
                    setIsMoreOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-purple-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin DB</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  exportJSON();
                  setIsMoreOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup (JSON)</span>
              </button>
            </div>
          )}
        </div>

        {/* User Account / Auth Trigger */}
        {user ? (
          <div className="flex items-center gap-1.5 pl-1 sm:pl-2 border-l border-slate-800">
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 p-1 sm:pl-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition"
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-slate-200 hidden md:inline max-w-[100px] truncate">
                {user.name}
              </span>
            </button>
            <button
              onClick={logout}
              className="p-1 text-slate-400 hover:text-red-400 transition"
              title={t('logout')}
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setAuthModalTab('login');
              setIsAuthModalOpen(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t('loginRegister')}</span>
          </button>
        )}
      </div>
    </header>
  );
};
