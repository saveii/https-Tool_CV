import React from 'react';
import { useCV } from '../../context/CVContext';
import { Languages as LangIcon, Plus, Trash2 } from 'lucide-react';

export const LanguagesForm = () => {
  const { cvData, addListItem, updateListItem, removeListItem, t } = useCV();
  const { languages = [] } = cvData;

  const handleAdd = () => {
    addListItem('languages', {
      name: '',
      level: 'Fluent / Professional'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <LangIcon className="w-4 h-4 text-blue-400" />
            {t('langTitle')}
          </h3>
          <p className="text-xs text-slate-400">{t('langDesc')}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('addLanguage')}
        </button>
      </div>

      <div className="space-y-2.5">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="flex items-center gap-3 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800"
          >
            <input
              type="text"
              value={lang.name || ''}
              onChange={(e) => updateListItem('languages', lang.id, 'name', e.target.value)}
              placeholder="e.g. English, Khmer, French"
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />

            <select
              value={lang.level || 'Fluent / Professional'}
              onChange={(e) => updateListItem('languages', lang.id, 'level', e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="Native">{t('native')}</option>
              <option value="Fluent / Professional">{t('fluent')}</option>
              <option value="Basic / Conversational">{t('conversational')}</option>
            </select>

            <button
              type="button"
              onClick={() => removeListItem('languages', lang.id)}
              className="text-slate-500 hover:text-red-400 transition p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
