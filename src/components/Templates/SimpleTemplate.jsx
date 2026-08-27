import React from 'react';

export const SimpleTemplate = ({ data, themeColor, fontFamily, fontSize, visibleSections, t = (k) => k }) => {
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
    fontFamily: `'${fontFamily}', 'Roboto', 'Kantumruy Pro', sans-serif`
  };

  return (
    <div className="w-full min-h-[297mm] bg-white text-slate-900 p-8 box-border flex flex-col gap-4" style={fontStyle}>
      {/* Centered Header */}
      <div className="text-center pb-2 border-b border-slate-900">
        <h1 className="text-2xl font-bold tracking-tight uppercase text-black">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-[13px] font-medium text-slate-700 mt-0.5">
          {personalInfo.jobTitle || 'Professional Candidate'}
        </div>
        <div className="flex flex-wrap justify-center gap-x-2 text-[11.5px] text-slate-600 mt-1.5">
          {[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
            personalInfo.website,
            personalInfo.linkedin
          ].filter(Boolean).map((item, idx, arr) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < arr.length - 1 && <span>|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Summary */}
      {visibleSections.profile !== false && profile && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-400 pb-0.5 mb-1.5">
            {t('cvSummary')}
          </h2>
          <p className="text-[12px] text-slate-800 leading-relaxed text-justify">
            {profile}
          </p>
        </div>
      )}

      {/* Experience */}
      {visibleSections.experience !== false && experience.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-400 pb-0.5 mb-2">
            {t('cvWorkExperience')}
          </h2>
          <div className="space-y-3">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-[12.5px] font-bold text-black">
                  <span>{exp.position}, <span className="font-semibold text-slate-700">{exp.company}</span></span>
                  <span className="text-[11px] font-normal text-slate-600">
                    {exp.startDate} – {exp.current ? t('cvPresent') : exp.endDate}
                  </span>
                </div>
                {exp.location && <div className="text-[11px] text-slate-500 italic">{exp.location}</div>}
                {exp.description && (
                  <div className="text-[11.5px] text-slate-800 leading-relaxed mt-0.5 whitespace-pre-line">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-400 pb-0.5 mb-2">
            {t('cvEducation')}
          </h2>
          <div className="space-y-2">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between text-[12px]">
                <div>
                  <span className="font-bold text-black">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                  <span className="text-slate-700"> — {edu.school}</span>
                </div>
                <span className="text-[11px] text-slate-600">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {visibleSections.skills !== false && skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-400 pb-0.5 mb-1.5">
            {t('cvSkills')}
          </h2>
          <div className="text-[11.5px] text-slate-800 leading-relaxed">
            {skills.map(s => s.name).join(', ')}
          </div>
        </div>
      )}

      {/* Languages */}
      {visibleSections.languages !== false && languages.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-400 pb-0.5 mb-1">
            {t('cvLanguages')}
          </h2>
          <div className="text-[11.5px] text-slate-800">
            {languages.map(l => `${l.name} (${l.level})`).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};
