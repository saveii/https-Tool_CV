import React from 'react';
import { useCV } from '../../context/CVContext';
import { Briefcase, Plus, Trash2, MapPin, Building } from 'lucide-react';

export const ExperienceForm = () => {
  const { cvData, addListItem, updateListItem, removeListItem, t, language } = useCV();
  const { experience = [] } = cvData;

  const handleAdd = () => {
    addListItem('experience', {
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            {t('expTitle')}
          </h3>
          <p className="text-xs text-slate-400">{t('expDesc')}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('addJob')}
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
          <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">{t('noExp')}</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            {t('addFirstExp')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, idx) => (
            <div
              key={exp.id}
              className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3 relative group"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-xs font-bold text-blue-400">
                  #{idx + 1} {exp.position ? `— ${exp.position}` : (language === 'km' ? 'ព័ត៌មានការងារ' : 'Experience Entry')}
                </span>
                <button
                  type="button"
                  onClick={() => removeListItem('experience', exp.id)}
                  className="text-slate-500 hover:text-red-400 transition p-1"
                  title="Delete Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('jobTitlePosition')}</label>
                  <input
                    type="text"
                    value={exp.position || ''}
                    onChange={(e) => updateListItem('experience', exp.id, 'position', e.target.value)}
                    placeholder={language === 'km' ? 'ឧ. វិស្វករ Frontend' : 'e.g. Senior Frontend Developer'}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                    <Building className="w-3 h-3" /> {t('company')}
                  </label>
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => updateListItem('experience', exp.id, 'company', e.target.value)}
                    placeholder="e.g. Google / Nexus Labs"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {t('location')}
                  </label>
                  <input
                    type="text"
                    value={exp.location || ''}
                    onChange={(e) => updateListItem('experience', exp.id, 'location', e.target.value)}
                    placeholder={language === 'km' ? 'ឧ. រាជធានីភ្នំពេញ (ឬពីចម្ងាយ Remote)' : 'e.g. Phnom Penh, Cambodia (or Remote)'}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('startDate')}</label>
                    <input
                      type="text"
                      value={exp.startDate || ''}
                      onChange={(e) => updateListItem('experience', exp.id, 'startDate', e.target.value)}
                      placeholder="e.g. 2022-01"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('endDate')}</label>
                    <input
                      type="text"
                      disabled={exp.current}
                      value={exp.current ? t('present') : (exp.endDate || '')}
                      onChange={(e) => updateListItem('experience', exp.id, 'endDate', e.target.value)}
                      placeholder="e.g. 2024-05"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`curr_${exp.id}`}
                  checked={exp.current || false}
                  onChange={(e) => updateListItem('experience', exp.id, 'current', e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <label htmlFor={`curr_${exp.id}`} className="text-xs text-slate-300 select-none">
                  {t('currentWork')}
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  {t('responsibilities')}
                </label>
                <textarea
                  rows={3}
                  value={exp.description || ''}
                  onChange={(e) => updateListItem('experience', exp.id, 'description', e.target.value)}
                  placeholder={language === 'km' ? '• ដឹកនាំការបង្កើតប្រព័ន្ធ React និង Node.js...\n• បង្កើនល្បឿនដំណើរការប្រព័ន្ធបាន ៤៥%' : '• Spearheaded architecture migration to React and Node.js microservices...\n• Reduced latency by 45%.'}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
