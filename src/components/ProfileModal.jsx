import React, { useState } from 'react';
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
  Link2
} from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose }) => {
  const {
    user,
    updateProfileData,
    savedCVs,
    loadSavedCV,
    deleteSavedCV,
    currentCvId,
    saveCV,
    cvTitle,
    setCvTitle,
    t,
    language
  } = useCV();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [location, setLocation] = useState(user?.location || '');
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'settings' | 'social'

  if (!isOpen || !user) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfileData({ name, headline, location });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Summary Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
          />
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {user.name}
              <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-semibold">
                {t('activeUser')}
              </span>
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3 h-3 text-slate-500" /> {user.email}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 my-4">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            {t('mySavedCVs')} ({savedCVs.length})
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'social'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            {language === 'km' ? 'ភ្ជាប់គណនី (Social Link)' : 'Linked Accounts'}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            {t('accountSettings')}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scroll pr-1">
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {/* Quick Save Current CV Box */}
              <div className="p-3.5 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs font-bold text-white mb-1">{t('saveCurrentCV')}</div>
                  <input
                    type="text"
                    value={cvTitle}
                    onChange={(e) => setCvTitle(e.target.value)}
                    placeholder="e.g. Senior Software Architect CV (2026)"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => saveCV(cvTitle)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition mt-4"
                >
                  <Save className="w-3.5 h-3.5" />
                  {t('save')}
                </button>
              </div>

              {/* Saved CV List */}
              {savedCVs.length === 0 ? (
                <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                  <FolderOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">{t('noSavedCVs')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedCVs.map((cv) => {
                    const isCurrentlyOpen = currentCvId === cv.id;
                    return (
                      <div
                        key={cv.id}
                        className={`p-3.5 rounded-xl border transition relative flex flex-col justify-between ${
                          isCurrentlyOpen
                            ? 'bg-blue-950/30 border-blue-500/50 shadow-lg'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white truncate max-w-[170px]">
                              {cv.title || 'Untitled CV'}
                            </span>
                            <span className="px-1.5 py-0.5 text-[9.5px] uppercase font-bold bg-slate-800 text-blue-400 rounded">
                              {cv.template || 'Modern'}
                            </span>
                          </div>
                          <div className="text-[10.5px] text-slate-500 flex items-center gap-1 mt-1">
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
                            {t('open')}
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

          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <h3 className="text-xs font-bold text-white mb-1">
                  {language === 'km' ? 'ការគ្រប់គ្រងការភ្ជាប់គណនី (Social Linking)' : 'Social Account Connections'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {language === 'km'
                    ? 'ភ្ជាប់គណនី Facebook ឬ Google ដើម្បី Login ចូលដោយស្វ័យប្រវត្តតាមរយៈ OAuth 2.0 ដោយមិនចាំបាច់វាយពាក្យសម្ងាត់'
                    : 'Link your Facebook or Google accounts to enable seamless 1-click passwordless login across all devices.'}
                </p>
              </div>

              {/* 4-State Social Connect Cards */}
              <SocialConnectCard provider="Facebook" />
              <SocialConnectCard provider="Google" />
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
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
                {t('updateProfile')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
