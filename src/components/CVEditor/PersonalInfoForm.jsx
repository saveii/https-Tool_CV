import React, { useRef, useState } from 'react';
import { useCV } from '../../context/CVContext';
import { User, Mail, Phone, MapPin, Globe, Link2, GitBranch, Upload, X, Crop, Sliders, Briefcase, ZoomIn, ZoomOut } from 'lucide-react';
import { PhotoCropModal } from '../PhotoCropModal';

export const PersonalInfoForm = () => {
  const { cvData, updatePersonalInfo, updateSetting, showToast, t, language } = useCV();
  const { personalInfo = {} } = cvData;
  const fileInputRef = useRef(null);

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast(language === 'km' ? 'រូបថតត្រូវមានទំហំតូចជាង 5MB' : 'Photo must be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target.result);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const openCropEditor = () => {
    if (personalInfo.photo) {
      setCropImageSrc(personalInfo.photo);
      setIsCropModalOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast(language === 'km' ? 'បានលុបរូបថត។' : 'Photo removed.');
  };

  const currentShape = personalInfo.photoShape || 'circle';
  const currentSize = personalInfo.photoSize || 128;

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

      {/* Photo Upload & Resize Controls */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3.5">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={openCropEditor} title="ចុចដើម្បីកែទំហំ / Crop">
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt="Avatar"
                className={`w-16 h-16 object-cover border-2 border-blue-500 shadow-md hover:opacity-90 transition ${
                  currentShape === 'circle'
                    ? 'rounded-full'
                    : currentShape === 'rounded'
                    ? 'rounded-2xl'
                    : 'rounded-md'
                }`}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                <User className="w-7 h-7" />
              </div>
            )}
            {personalInfo.photo && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto();
                }}
                className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span>{personalInfo.photo ? (language === 'km' ? 'ប្តូររូបថត' : 'Change Photo') : (language === 'km' ? 'បញ្ចូលរូបថត' : 'Upload Photo')}</span>
              </button>

              {personalInfo.photo && (
                <button
                  type="button"
                  onClick={openCropEditor}
                  className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap"
                >
                  <Crop className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'km' ? 'កែតម្រូវទំហំ & កាត់រូប' : 'Crop & Resize'}</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'km' ? 'ទំហំរូបភាពណែនាំ: JPG/PNG, មិនលើស 5MB។ ចុចលើរូបដើម្បីកាត់ត ឬពង្រីក។' : 'Recommended: JPG/PNG under 5MB. Click on image to crop/resize.'}
            </p>
          </div>
        </div>

        {/* Quick Photo Dimension & Shape Toolbar */}
        {personalInfo.photo && (
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Shape Control */}
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {language === 'km' ? 'រាងរូបថតលើ CV' : 'CV Photo Shape'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'circle', label: language === 'km' ? 'មូល' : 'Circle' },
                    { id: 'rounded', label: language === 'km' ? 'ជ្រុងកោង' : 'Rounded' },
                    { id: 'square', label: language === 'km' ? 'ការ៉េ' : 'Square' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        updatePersonalInfo('photoShape', s.id);
                        updateSetting('photoShape', s.id);
                      }}
                      className={`py-1.5 px-1 text-[11px] font-medium rounded-lg border transition text-center truncate ${
                        currentShape === s.id
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                    {language === 'km' ? 'កម្រិតទំហំលឿន' : 'Quick Sizes'}
                  </label>
                  <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {currentSize}px
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { size: 85, label: language === 'km' ? 'តូច' : 'Small' },
                    { size: 115, label: language === 'km' ? 'មធ្យម' : 'Medium' },
                    { size: 145, label: language === 'km' ? 'ធំ' : 'Large' },
                    { size: 180, label: language === 'km' ? 'ធំខ្លាំង' : 'X-Large' }
                  ].map((sz) => (
                    <button
                      key={sz.size}
                      type="button"
                      onClick={() => {
                        updatePersonalInfo('photoSize', sz.size);
                        updateSetting('photoSize', sz.size);
                      }}
                      className={`py-1.5 px-0.5 text-[10.5px] font-medium rounded-lg border transition text-center truncate ${
                        Math.abs(currentSize - sz.size) <= 5
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Smooth Range Slider (ទាញរំកិលពង្រីក-បង្រួមទំហំរូបភាព) */}
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-[11px] flex items-center gap-1.5 text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'km' ? 'ទាញរំកិលទំហំរូបភាព (Drag to Resize / Zoom):' : 'Drag Slider to Resize:'}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const newSize = Math.max(60, currentSize - 5);
                      updatePersonalInfo('photoSize', newSize);
                      updateSetting('photoSize', newSize);
                    }}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                    title="Zoom Out (-5px)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-blue-400 w-12 text-center">
                    {currentSize}px
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newSize = Math.min(220, currentSize + 5);
                      updatePersonalInfo('photoSize', newSize);
                      updateSetting('photoSize', newSize);
                    }}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                    title="Zoom In (+5px)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-mono">60px</span>
                <input
                  type="range"
                  min="60"
                  max="220"
                  step="2"
                  value={currentSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    updatePersonalInfo('photoSize', newSize);
                    updateSetting('photoSize', newSize);
                  }}
                  className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                />
                <span className="text-[10px] text-slate-500 font-mono">220px</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Name & Job Title Stack */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('fullName')}</span>
          </label>
          <input
            type="text"
            value={personalInfo.fullName || ''}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            placeholder={language === 'km' ? 'ឧ. សុខ វិរៈ' : 'e.g. John Doe'}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-sm font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('jobTitle')}</span>
          </label>
          <input
            type="text"
            value={personalInfo.jobTitle || ''}
            onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
            placeholder={language === 'km' ? 'ឧ. វិស្វករកម្មវិធីជាន់ខ្ពស់' : 'e.g. Senior Software Engineer'}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Contact & Social Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">

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

      {/* Photo Crop & Resize Modal */}
      <PhotoCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={cropImageSrc}
      />
    </div>
  );
};
