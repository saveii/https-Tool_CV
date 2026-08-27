import React from 'react';
import { useCV } from '../../context/CVContext';
import { Award, Plus, Trash2, Globe } from 'lucide-react';

export const CertificatesForm = () => {
  const { cvData, addListItem, updateListItem, removeListItem, t, language } = useCV();
  const { certificates = [] } = cvData;

  const handleAdd = () => {
    addListItem('certificates', {
      name: '',
      issuer: '',
      date: '',
      url: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            {t('certTitle')}
          </h3>
          <p className="text-xs text-slate-400">{t('certDesc')}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('addCertificate')}
        </button>
      </div>

      <div className="space-y-3">
        {certificates.map((cert, idx) => (
          <div
            key={cert.id}
            className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5"
          >
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800/80">
              <span className="text-xs font-bold text-blue-400">
                #{idx + 1} {cert.name ? `— ${cert.name}` : (language === 'km' ? 'ព័ត៌មានវិញ្ញាបនបត្រ' : 'Certificate Entry')}
              </span>
              <button
                type="button"
                onClick={() => removeListItem('certificates', cert.id)}
                className="text-slate-500 hover:text-red-400 transition p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('certName')}</label>
                <input
                  type="text"
                  value={cert.name || ''}
                  onChange={(e) => updateListItem('certificates', cert.id, 'name', e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('issuer')}</label>
                <input
                  type="text"
                  value={cert.issuer || ''}
                  onChange={(e) => updateListItem('certificates', cert.id, 'issuer', e.target.value)}
                  placeholder="e.g. Amazon Web Services, Meta"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('issueDate')}</label>
                <input
                  type="text"
                  value={cert.date || ''}
                  onChange={(e) => updateListItem('certificates', cert.id, 'date', e.target.value)}
                  placeholder="e.g. 2024-03"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {t('credentialUrl')}
                </label>
                <input
                  type="text"
                  value={cert.url || ''}
                  onChange={(e) => updateListItem('certificates', cert.id, 'url', e.target.value)}
                  placeholder="e.g. https://aws.amazon.com/verify..."
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
