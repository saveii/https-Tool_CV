import React from 'react';
import { useCV } from '../../context/CVContext';
import { UserCheck, Plus, Trash2, Mail, Phone } from 'lucide-react';

export const ReferencesForm = () => {
  const { cvData, addListItem, updateListItem, removeListItem, t, language } = useCV();
  const { references = [] } = cvData;

  const handleAdd = () => {
    addListItem('references', {
      name: '',
      position: '',
      company: '',
      phone: '',
      email: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            {t('refTitle')}
          </h3>
          <p className="text-xs text-slate-400">{t('refDesc')}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('addReference')}
        </button>
      </div>

      <div className="space-y-3.5">
        {references.map((ref, idx) => (
          <div
            key={ref.id}
            className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5"
          >
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800/80">
              <span className="text-xs font-bold text-blue-400">
                #{idx + 1} {ref.name ? `— ${ref.name}` : (language === 'km' ? 'ព័ត៌មានអ្នកធានា' : 'Reference Entry')}
              </span>
              <button
                type="button"
                onClick={() => removeListItem('references', ref.id)}
                className="text-slate-500 hover:text-red-400 transition p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('refName')}</label>
                <input
                  type="text"
                  value={ref.name || ''}
                  onChange={(e) => updateListItem('references', ref.id, 'name', e.target.value)}
                  placeholder={language === 'km' ? 'ឧ. លោកបណ្ឌិត ចាន់ សុភា' : 'e.g. Dr. Sophea Chan'}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('refPosition')}</label>
                <input
                  type="text"
                  value={ref.position || ''}
                  onChange={(e) => updateListItem('references', ref.id, 'position', e.target.value)}
                  placeholder="e.g. Chief Technology Officer"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('refCompany')}</label>
                <input
                  type="text"
                  value={ref.company || ''}
                  onChange={(e) => updateListItem('references', ref.id, 'company', e.target.value)}
                  placeholder="e.g. Nexus Technology Solutions"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {t('phone')}
                </label>
                <input
                  type="tel"
                  value={ref.phone || ''}
                  onChange={(e) => updateListItem('references', ref.id, 'phone', e.target.value)}
                  placeholder="e.g. +855 12 888 999"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {t('email')}
                </label>
                <input
                  type="email"
                  value={ref.email || ''}
                  onChange={(e) => updateListItem('references', ref.id, 'email', e.target.value)}
                  placeholder="e.g. reference@company.com"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
