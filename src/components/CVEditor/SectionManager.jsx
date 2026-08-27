import React from 'react';
import { useCV } from '../../context/CVContext';
import { Eye, EyeOff, Sliders, Palette, Type, LayoutTemplate } from 'lucide-react';
import { THEME_COLORS, FONT_OPTIONS, TEMPLATES } from '../../data/initialCV';

export const SectionManager = () => {
  const { settings, updateSetting, toggleSection, t } = useCV();
  const { visibleSections = {}, template, themeColor, fontFamily, fontSize } = settings;

  const sectionsList = [
    { key: 'personalInfo', label: t('tabPersonal') },
    { key: 'profile', label: t('tabSummary') },
    { key: 'experience', label: t('tabExperience') },
    { key: 'education', label: t('tabEducation') },
    { key: 'skills', label: t('tabSkills') },
    { key: 'languages', label: t('tabLanguages') },
    { key: 'certificates', label: t('tabCertificates') },
    { key: 'projects', label: t('tabProjects') },
    { key: 'references', label: t('tabReferences') }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          {t('styleTitle')}
        </h3>
        <p className="text-xs text-slate-400">{t('styleDesc')}</p>
      </div>

      {/* Choose Template */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" /> {t('selectTemplate')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => updateSetting('template', tmpl.id)}
              className={`p-2.5 text-left rounded-xl border transition ${
                template === tmpl.id
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs capitalize">{tmpl.name}</div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tmpl.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Color Palette */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-blue-400" /> {t('accentColor')}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {THEME_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => updateSetting('themeColor', color.value)}
              className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                themeColor === color.value ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {themeColor === color.value && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
          ))}
          {/* Custom Hex Color Picker */}
          <div className="flex items-center gap-1.5 ml-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
            <input
              type="color"
              value={themeColor}
              onChange={(e) => updateSetting('themeColor', e.target.value)}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="text-[11px] text-slate-400 uppercase font-mono">{themeColor}</span>
          </div>
        </div>
      </div>

      {/* Font Family Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-blue-400" /> {t('fontTypography')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => updateSetting('fontFamily', f.value)}
              className={`p-2 text-left rounded-lg border text-xs transition ${
                fontFamily === f.value
                  ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              style={{ fontFamily: f.family }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size Scaling */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">{t('fontSizing')}</label>
        <div className="flex gap-2">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => updateSetting('fontSize', size)}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold uppercase transition ${
                fontSize === size
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t(size)}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Sections Visibility */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">
          {t('toggleSections')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sectionsList.map((sec) => {
            const isVisible = visibleSections[sec.key] !== false;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => toggleSection(sec.key)}
                className={`p-2.5 flex items-center justify-between rounded-lg border transition text-xs font-medium ${
                  isVisible
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-slate-950 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                <span>{sec.label}</span>
                {isVisible ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <Eye className="w-3.5 h-3.5" /> {t('visible')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                    <EyeOff className="w-3.5 h-3.5" /> {t('hidden')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
