import React from 'react';
import { useCV } from '../../context/CVContext';
import { BookOpen, Plus, Trash2, GraduationCap } from 'lucide-react';

export const EducationForm = () => {
  const { cvData, addListItem, updateListItem, removeListItem, t, language } = useCV();
  const { education = [] } = cvData;

  const handleAdd = () => {
    addListItem('education', {
      degree: '',
      field: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      grade: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            {t('eduTitle')}
          </h3>
          <p className="text-xs text-slate-400">{t('eduDesc')}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('addDegree')}
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
          <GraduationCap className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">{t('noEdu')}</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            {t('addFirstEdu')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, idx) => (
            <div
              key={edu.id}
              className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-xs font-bold text-blue-400">
                  #{idx + 1} {edu.degree ? `— ${edu.degree}` : (language === 'km' ? 'ព័ត៌មានការអប់រំ' : 'Education Entry')}
                </span>
                <button
                  type="button"
                  onClick={() => removeListItem('education', edu.id)}
                  className="text-slate-500 hover:text-red-400 transition p-1"
                  title="Delete Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('degree')}</label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => updateListItem('education', edu.id, 'degree', e.target.value)}
                    placeholder={language === 'km' ? 'ឧ. បរិញ្ញាបត្រ' : 'e.g. Bachelor of Science'}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('fieldOfStudy')}</label>
                  <input
                    type="text"
                    value={edu.field || ''}
                    onChange={(e) => updateListItem('education', edu.id, 'field', e.target.value)}
                    placeholder={language === 'km' ? 'ឧ. វិទ្យាសាស្ត្រកុំព្យូទ័រ' : 'e.g. Computer Science'}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('school')}</label>
                  <input
                    type="text"
                    value={edu.school || ''}
                    onChange={(e) => updateListItem('education', edu.id, 'school', e.target.value)}
                    placeholder={language === 'km' ? 'ឧ. សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ' : 'e.g. Royal University of Phnom Penh'}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('location')}</label>
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => updateListItem('education', edu.id, 'location', e.target.value)}
                    placeholder={language === 'km' ? 'ឧ. រាជធានីភ្នំពេញ' : 'e.g. Phnom Penh, Cambodia'}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('startYear')}</label>
                    <input
                      type="text"
                      value={edu.startDate || ''}
                      onChange={(e) => updateListItem('education', edu.id, 'startDate', e.target.value)}
                      placeholder="e.g. 2018"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('endYear')}</label>
                    <input
                      type="text"
                      value={edu.endDate || ''}
                      onChange={(e) => updateListItem('education', edu.id, 'endDate', e.target.value)}
                      placeholder="e.g. 2022"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('gradeHonors')}</label>
                  <input
                    type="text"
                    value={edu.grade || ''}
                    onChange={(e) => updateListItem('education', edu.id, 'grade', e.target.value)}
                    placeholder="e.g. GPA 3.8/4.0 (Honors)"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
