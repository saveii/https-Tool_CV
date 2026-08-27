import React from 'react';
import { useCV } from '../../context/CVContext';
import { FileText, Sparkles, Wand2 } from 'lucide-react';

const SUMMARY_TEMPLATES = {
  en: [
    {
      title: 'Senior Software Engineer',
      text: 'Experienced Full Stack Engineer with 6+ years of expertise in building scalable cloud architectures, modern web applications, and high-performance microservices. Passionate about AI-driven workflows, clean code, and mentoring engineering teams.'
    },
    {
      title: 'Project & Product Manager',
      text: 'Results-driven Project Manager with a proven track record of orchestrating cross-functional agile teams and delivering multi-million dollar tech products on schedule and within budget.'
    },
    {
      title: 'UI/UX & Product Designer',
      text: 'Creative and detail-oriented UI/UX Designer specialized in creating intuitive, accessible, and delightful digital experiences using Figma, design systems, and user research.'
    },
    {
      title: 'Fresh Graduate / Entry Level',
      text: 'Motivated and fast-learning Computer Science graduate with strong foundational knowledge in modern JavaScript, algorithms, and web development. Eager to contribute to innovative software projects.'
    }
  ],
  km: [
    {
      title: 'វិស្វករកម្មវិធីជាន់ខ្ពស់ (Senior Engineer)',
      text: 'វិស្វករកម្មវិធីដែលមានបទពិសោធន៍ជាង ៦ ឆ្នាំ លើការបង្កើតប្រព័ន្ធ Cloud Architecture, Web Applications ទំនើប និងប្រព័ន្ធ AI ស្វ័យប្រវត្ត។ មានសមត្ថភាពខ្ពស់ក្នុងការដឹកនាំក្រុមអភិវឌ្ឍន៍កម្មវិធី ការរចនា UI/UX ប្រកបដោយប្រសិទ្ធភាព និងការបង្កើនល្បឿនដំណើរការប្រព័ន្ធ។'
    },
    {
      title: 'អ្នកគ្រប់គ្រងគម្រោង (Project Manager)',
      text: 'អ្នកគ្រប់គ្រងគម្រោងប្រកបដោយភាពជាអ្នកដឹកនាំ និងបទពិសោធន៍ក្នុងការរៀបចំក្រុមការងារតាមទម្រង់ Agile ដើម្បីសម្រេចគម្រោងបច្ចេកវិទ្យាប្រកបដោយគុណភាព និងទាន់ពេលវេលាកំណត់។'
    },
    {
      title: 'អ្នករចនា UI/UX (Product Designer)',
      text: 'អ្នករចនា UI/UX ប្រកបដោយភាពច្នៃប្រឌិត និងការយកចិត្តទុកដាក់ខ្ពស់លើបទពិសោធន៍អ្នកប្រើប្រាស់ ស្ទាត់ជំនាញលើ Figma, Design System និងការស្រាវជ្រាវតម្រូវការទីផ្សារ។'
    },
    {
      title: 'និស្សិតទើបបញ្ចប់ការសិក្សា (Fresh Graduate)',
      text: 'និស្សិតទើបបញ្ចប់ការសិក្សាលើជំនាញវិទ្យាសាស្ត្រកុំព្យូទ័រ មានចំណេះដឹងរឹងមាំលើភាសាសរសេរកូដ និងការអភិវឌ្ឍ Web App ទំនើប។ ត្រៀមខ្លួនរួចជាស្រេចក្នុងការរៀនសូត្រ និងចូលរួមចំណែកក្នុងគម្រោងថ្មីៗ។'
    }
  ]
};

export const ProfileForm = () => {
  const { cvData, updateProfile, showToast, t, language } = useCV();

  const applyTemplate = (text) => {
    updateProfile(text);
    showToast(language === 'km' ? 'បានបញ្ចូលគំរូសេចក្តីសង្ខេបជោគជ័យ!' : 'Summary prompt applied!');
  };

  const templatesList = SUMMARY_TEMPLATES[language] || SUMMARY_TEMPLATES.en;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            {t('summaryTitle')}
          </h3>
          <p className="text-xs text-slate-400">{t('summaryDesc')}</p>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {t('quickSmartTemplates')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {templatesList.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyTemplate(tmpl.text)}
              className="text-left p-2.5 bg-slate-900/70 hover:bg-blue-900/30 border border-slate-800 hover:border-blue-500/40 rounded-lg transition text-xs group"
            >
              <div className="font-semibold text-slate-200 group-hover:text-blue-400 flex items-center justify-between">
                <span>{tmpl.title}</span>
                <Wand2 className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{tmpl.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          {t('summaryTitle')}
        </label>
        <textarea
          rows={5}
          value={cvData.profile || ''}
          onChange={(e) => updateProfile(e.target.value)}
          placeholder={t('summaryPlaceholder')}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );
};
