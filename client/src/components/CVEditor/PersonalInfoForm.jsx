import React, { useRef } from 'react';
import { useCV } from '../../context/CVContext';
import { User, Mail, Phone, MapPin, Globe, Link2, GitBranch, Upload, X } from 'lucide-react';

export const PersonalInfoForm = () => {
  const { cvData, updatePersonalInfo, showToast, t, language } = useCV();
  const { personalInfo = {} } = cvData;
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast(language === 'km' ? 'រូបថតត្រូវមានទំហំតូចជាង 2MB' : 'Photo must be less than 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updatePersonalInfo('photo', event.target.result);
      showToast(language === 'km' ? 'បានបញ្ចូលរូបថតជោគជ័យ!' : 'Profile photo updated!');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast(language === 'km' ? 'បានលុបរូបថត។' : 'Photo removed.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            {t('personalTitle')}
          </h3>
          <p className="text-xs text-slate-400">{t('personalDesc')}</p>
        </div>
      </div>

      {/* Photo Upload Box */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-center gap-4">
        <div className="relative group">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500">
              <User className="w-7 h-7" />
            </div>
          )}
          {personalInfo.photo && (
            <button
              onClick={removePhoto}
              className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition"
              title="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            {personalInfo.photo ? t('changePhoto') : t('uploadPhoto')}
          </button>
          <p className="text-[11px] text-slate-500 mt-1">{t('photoHint')}</p>
        </div>
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">{t('fullName')}</label>
          <input
            type="text"
            value={personalInfo.fullName || ''}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            placeholder={language === 'km' ? 'ឧ. សុខ វិរៈ' : 'e.g. John Doe'}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">{t('jobTitle')}</label>
          <input
            type="text"
            value={personalInfo.jobTitle || ''}
            onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
            placeholder={language === 'km' ? 'ឧ. វិស្វករកម្មវិធីជាន់ខ្ពស់' : 'e.g. Senior Software Engineer'}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" /> {t('email')}
          </label>
          <input
            type="email"
            value={personalInfo.email || ''}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="e.g. name@example.com"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" /> {t('phone')}
          </label>
          <input
            type="tel"
            value={personalInfo.phone || ''}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="e.g. +855 12 345 678"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" /> {t('location')}
          </label>
          <input
            type="text"
            value={personalInfo.location || ''}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder={language === 'km' ? 'រាជធានីភ្នំពេញ កម្ពុជា' : 'e.g. Phnom Penh, Cambodia'}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" /> {t('website')}
          </label>
          <input
            type="text"
            value={personalInfo.website || ''}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            placeholder="e.g. https://yourwebsite.dev"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <Link2 className="w-3 h-3 text-slate-400" /> {t('linkedin')}
          </label>
          <input
            type="text"
            value={personalInfo.linkedin || ''}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            placeholder="e.g. linkedin.com/in/username"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <GitBranch className="w-3 h-3 text-slate-400" /> {t('github')}
          </label>
          <input
            type="text"
            value={personalInfo.github || ''}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            placeholder="e.g. github.com/username"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
