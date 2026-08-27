import React from 'react';

export const MinimalTemplate = ({ data, themeColor, fontFamily, fontSize, visibleSections, t = (k) => k }) => {
  const {
    personalInfo = {},
    profile = '',
    experience = [],
    education = [],
    skills = [],
    languages = [],
    certificates = [],
    projects = []
  } = data;

  const fontStyle = {
    fontFamily: `'${fontFamily}', 'Kantumruy Pro', sans-serif`
  };

  return (
    <div className="w-full min-h-[297mm] bg-white text-slate-900 p-9 box-border flex flex-col gap-6" style={fontStyle}>
      {/* Centered Minimal Header */}
      <div className="text-center pb-2">
        <h1 className="text-2xl font-light tracking-widest uppercase text-slate-950">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div className="text-[13px] font-medium tracking-wide mt-1" style={{ color: themeColor }}>
          {personalInfo.jobTitle || 'PROFESSIONAL TITLE'}
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-[11.5px] text-slate-500 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* About */}
      {visibleSections.profile !== false && profile && (
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-900 border-b border-slate-900 pb-1 mb-2">
            {t('cvProfile')}
          </h2>
          <p className="text-[12.5px] text-slate-600 leading-relaxed">
            {profile}
          </p>
        </div>
      )}

      {/* Experience */}
      {visibleSections.experience !== false && experience.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-900 border-b border-slate-900 pb-1 mb-3">
            {t('cvExperience')}
          </h2>
          <div className="space-y-3.5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-[13px]">
                  <span className="font-semibold text-slate-900">
                    {exp.position} <span className="font-normal text-slate-500">at {exp.company}</span>
                  </span>
                  <span className="text-[11.5px] text-slate-400">
                    {exp.startDate} – {exp.current ? t('cvPresent') : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <div className="text-[12px] text-slate-600 leading-relaxed mt-1 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {visibleSections.education !== false && education.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-900 border-b border-slate-900 pb-1 mb-2.5">
            {t('cvEducation')}
          </h2>
          <div className="space-y-2">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between text-[12.5px]">
                <div>
                  <span className="font-semibold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-600"> — {edu.school} {edu.field && `(${edu.field})`}</span>
                </div>
                <span className="text-[11.5px] text-slate-400">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {visibleSections.skills !== false && skills.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-900 border-b border-slate-900 pb-1 mb-2">
            {t('cvSkills')}
          </h2>
          <div className="text-[12px] text-slate-600 leading-loose">
            {skills.map(s => s.name).join('  •  ')}
          </div>
        </div>
      )}

      {/* Languages */}
      {visibleSections.languages !== false && languages.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-900 border-b border-slate-900 pb-1 mb-2">
            {t('cvLanguages')}
          </h2>
          <div className="text-[12px] text-slate-600">
            {languages.map(l => `${l.name} (${l.level})`).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};
