import React, { useState, useRef } from 'react';
import { useCV } from '../context/CVContext';
import { SocialConnectCard } from './SocialConnectCard';
import {
  X,
  User,
  Mail,
  Trash2,
  FolderOpen,
  Save,
  Clock,
  Link2,
  Languages,
  Sparkles,
  Download,
  Upload,
  ShieldCheck,
  LogOut,
  LogIn,
  Check,
  Settings,
  Sun,
  Moon
} from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose, onOpenAdminModal }) => {
  const {
    user,
    logout,
    setIsAuthModalOpen,
    setAuthModalTab,
    updateProfileData,
    savedCVs,
    loadSavedCV,
    deleteSavedCV,
    currentCvId,
    saveCV,
    cvTitle,
    setCvTitle,
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    toggleDarkMode,
    resetToSample,
    clearAllData,
    exportJSON,
    importJSON,
    showToast,
    t
  } = useCV();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [location, setLocation] = useState(user?.location || '');
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'actions' | 'social' | 'settings'

  const fileImportRef = useRef(null);

  if (!isOpen) return null;

  const isAdmin = user && (user.role === 'admin' || user.email?.includes('admin') || user.email === 'admin@toolcv.com');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfileData({ name, headline, location });
    showToast(language === 'km' ? 'បានកែប្រែព័ត៌មានគណនីជោគជ័យ!' : 'Profile updated successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-4 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-800 shrink-0 pr-8">
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500 shadow-md shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 truncate">
                  <span className="truncate">{user.name}</span>
                  <span className="px-2 py-0.5 text-[9.5px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-semibold shrink-0">
                    {isAdmin ? 'Admin' : t('activeUser')}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                  <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{user.email || user.phone || 'Account'}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {language === 'km' ? 'គណនី & ការកំណត់' : 'Account & Settings'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {language === 'km' ? 'ចូលគណនីដើម្បីរក្សាទុក CV លើ Cloud' : 'Sign in to sync your CV to cloud'}
                </p>
              </div>
            </div>
          )}

          {/* Quick Login / Logout Button */}
          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-2.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
              title={t('logout')}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{language === 'km' ? 'ចាកចេញ' : 'Logout'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('loginRegister')}</span>
            </button>
          )}
        </div>

        {/* Language & Theme Controls Grid (Day/Night ☀️/🌙) */}
        <div className="pt-3 pb-1 shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Language Switcher */}
          <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 pl-2">
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'km' ? 'ភាសា:' : 'Language:'}</span>
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setLanguage('km')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${language === 'km'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
              >
                🇰🇭 ខ្មែរ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${language === 'en'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          {/* Day / Night Theme Switcher (របៀបថ្ងៃ ☀️ / របៀបយប់ 🌙) */}
          <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 pl-2">
              {darkMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{language === 'km' ? 'ពន្លឺ/ងងឹត:' : 'Theme:'}</span>
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setDarkMode(false)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${!darkMode
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
              >
                <Sun className="w-3 h-3 text-current" />
                <span>{language === 'km' ? 'ថ្ងៃ ☀️' : 'Light'}</span>
              </button>
              <button
                type="button"
                onClick={() => setDarkMode(true)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${darkMode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
              >
                <Moon className="w-3 h-3 text-current" />
                <span>{language === 'km' ? 'យប់ 🌙' : 'Dark'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 my-3 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{t('mySavedCVs')} ({savedCVs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${activeTab === 'actions'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'ឧបករណ៍ & គំរូ' : 'Tools & Samples'}</span>
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${activeTab === 'social'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'ភ្ជាប់គណនី' : 'Social Link'}</span>
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t('accountSettings')}</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scroll pr-1">
          {/* TAB 1: Saved CVs & Cloud Save */}
          {activeTab === 'saved' && (
            <div className="space-y-3.5">
              {/* Save Current CV Card */}
              <div className="p-3 sm:p-3.5 bg-blue-600/10 border border-blue-500/20 rounded-xl space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('saveCurrentCV')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cvTitle}
                    onChange={(e) => setCvTitle(e.target.value)}
                    placeholder="e.g. Senior Software Architect CV (2026)"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => saveCV(cvTitle)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{t('save')}</span>
                  </button>
                </div>
              </div>

              {/* Saved CV List */}
              {savedCVs.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                  <FolderOpen className="w-9 h-9 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">{t('noSavedCVs')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {savedCVs.map((cv) => {
                    const isCurrentlyOpen = currentCvId === cv.id;
                    return (
                      <div
                        key={cv.id}
                        className={`p-3 rounded-xl border transition relative flex flex-col justify-between ${isCurrentlyOpen
                            ? 'bg-blue-950/30 border-blue-500/50 shadow-lg'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white truncate max-w-[170px]">
                              {cv.title || 'Untitled CV'}
                            </span>
                            <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold bg-slate-800 text-blue-400 rounded">
                              {cv.template || 'Modern'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(cv.updatedAt || cv.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => {
                              loadSavedCV(cv);
                              onClose();
                            }}
                            className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                          >
                            <FolderOpen className="w-3 h-3" />
                            <span>{t('open')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSavedCV(cv.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition"
                            title="Delete CV"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Tools, Samples, JSON Backup & Admin DB */}
          {activeTab === 'actions' && (
            <div className="space-y-3">
              {/* Sample Data Presets */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'km' ? 'ទិន្នន័យ CV គំរូ (Sample Data)' : 'Sample CV Data'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetToSample('km');
                      showToast('បានបំពេញទិន្នន័យគំរូភាសាខ្មែរ!');
                      onClose();
                    }}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition"
                  >
                    <span>🇰🇭 គំរូភាសាខ្មែរ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetToSample('en');
                      showToast('English sample data loaded!');
                      onClose();
                    }}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition"
                  >
                    <span>🇬🇧 English Sample</span>
                  </button>
                </div>
              </div>

              {/* JSON Backup & Restore */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'km' ? 'បម្រុងទុកទិន្នន័យ (Backup & Restore)' : 'Backup & Restore'}</span>
                </div>
                <input
                  type="file"
                  ref={fileImportRef}
                  onChange={(e) => {
                    importJSON(e);
                    onClose();
                  }}
                  accept=".json"
                  className="hidden"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileImportRef.current?.click()}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t('importBackup')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      exportJSON();
                      onClose();
                    }}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t('exportBackup')}</span>
                  </button>
                </div>
              </div>

              {/* Clear / Reset All CV Data (ស៊ុបទិន្នន័យទាំងអស់) */}
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2">
                <div className="text-xs font-bold text-red-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>{language === 'km' ? 'សម្អាត / ស៊ុបទិន្នន័យទាំងអស់ (Clear All)' : 'Clear All CV Content'}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'km'
                    ? 'លុបទិន្នន័យដែលបានបំពេញទាំងអស់ក្នុង CV ដើម្បីចាប់ផ្តើមបំពេញពីទំព័រទទេឡើងវិញ'
                    : 'Clear all fields to reset your CV back to an empty blank document.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const confirmMsg = language === 'km'
                      ? 'តើអ្នកប្រាកដជាចង់លុប និងសម្អាតទិន្នន័យ CV ទាំងអស់មែនទេ? (ទិន្នន័យមិនទាន់ Save នឹងត្រូវបាត់បង់)'
                      : 'Are you sure you want to completely clear all CV data?';
                    if (window.confirm(confirmMsg)) {
                      clearAllData();
                      onClose();
                    }
                  }}
                  className="w-full py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? '🗑️ លុបទិន្នន័យទាំងអស់ចេញ (Clear Blank)' : 'Clear All CV Data'}</span>
                </button>
              </div>

              {/* Admin Database Access (Admin Only) */}
              {isAdmin && (
                <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>{language === 'km' ? 'ផ្ទាំងគ្រប់គ្រង Admin MySQL Database' : 'Admin MySQL Database'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdminModal && onOpenAdminModal();
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Open Admin DB Management</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Social Account Linking */}
          {activeTab === 'social' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <h3 className="text-xs font-bold text-white mb-1">
                  {language === 'km' ? 'ការគ្រប់គ្រងការភ្ជាប់គណនី (Social Linking)' : 'Social Account Connections'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {language === 'km'
                    ? 'ភ្ជាប់គណនី Facebook ឬ Google ដើម្បី Login ចូលដោយស្វ័យប្រវត្តតាមរយៈ OAuth 2.0'
                    : 'Link your Facebook or Google accounts to enable seamless 1-click passwordless login.'}
                </p>
              </div>

              {/* 4-State Social Connect Cards */}
              <SocialConnectCard provider="Facebook" />
              <SocialConnectCard provider="Google" />
            </div>
          )}

          {/* TAB 4: Profile Settings */}
          {activeTab === 'settings' && user && (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('fullName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('headline')}</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Software Engineer & AI Researcher"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('location')}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Phnom Penh, Cambodia"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition mt-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t('updateProfile')}</span>
              </button>
            </form>
          )}
        </div>
      </div>





    </div>
  );
};
