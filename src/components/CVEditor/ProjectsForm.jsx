import React from 'react';
import { useCV } from '../../context/CVContext';
import { FolderGit2, Plus, Trash2, Globe } from 'lucide-react';

export const ProjectsForm = () => {
  const { cvData, addListItem, updateListItem, removeListItem, t, language } = useCV();
  const { projects = [] } = cvData;

  const handleAdd = () => {
    addListItem('projects', {
      title: '',
      tech: '',
      link: '',
      description: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-blue-400" />
            {t('projTitle')}
          </h3>
          <p className="text-xs text-slate-400">{t('projDesc')}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('addProject')}
        </button>
      </div>

      <div className="space-y-3.5">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5"
          >
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800/80">
              <span className="text-xs font-bold text-blue-400">
                #{idx + 1} {proj.title ? `— ${proj.title}` : (language === 'km' ? 'ព័ត៌មានគម្រោង' : 'Project Entry')}
              </span>
              <button
                type="button"
                onClick={() => removeListItem('projects', proj.id)}
                className="text-slate-500 hover:text-red-400 transition p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('projectName')}</label>
                <input
                  type="text"
                  value={proj.title || ''}
                  onChange={(e) => updateListItem('projects', proj.id, 'title', e.target.value)}
                  placeholder="e.g. AI-Powered Smart CV Builder"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {t('demoLink')}
                </label>
                <input
                  type="text"
                  value={proj.link || ''}
                  onChange={(e) => updateListItem('projects', proj.id, 'link', e.target.value)}
                  placeholder="e.g. https://github.com/username/project"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('techStack')}</label>
              <input
                type="text"
                value={proj.tech || ''}
                onChange={(e) => updateListItem('projects', proj.id, 'tech', e.target.value)}
                placeholder="e.g. React, Node.js, Express, Puppeteer, Tailwind CSS"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('projectDesc')}</label>
              <textarea
                rows={2}
                value={proj.description || ''}
                onChange={(e) => updateListItem('projects', proj.id, 'description', e.target.value)}
                placeholder={language === 'km' ? 'ពិពណ៌នាពីមុខងារសំខាន់ៗ និងផលជះនៃគម្រោង...' : 'Describe key functionality, scale, impact, and features of the project...'}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
