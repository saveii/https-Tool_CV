import React from 'react';

export const ProfessionalTemplate = ({ data, themeColor, fontFamily, fontSize, visibleSections, t = (k) => k }) => {
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
    fontFamily: `'${fontFamily}', 'Kantumruy Pro', serif`
  };

  return (
    <div className="w-full min-h-[297mm] bg-white text-slate-900 p-8 box-border flex flex-col gap-5" style={fontStyle}>
      {/* Header */}
      <div className="border-b-4 pb-4 flex justify-between items-center" style={{ borderColor: themeColor }}>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase text-slate-950">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <h2 className="text-lg font-semibold tracking-wide mt-0.5" style={{ color: themeColor }}>
            {personalInfo.jobTitle || 'Executive Professional'}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-600 mt-2">
            {personalInfo.email && (
              <span className="flex items-center gap-1">✉ {personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">📞 {personalInfo.phone}</span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">📍 {personalInfo.location}</span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">🔗 {personalInfo.linkedin}</span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">🌐 {personalInfo.website}</span>
            )}
          </div>
        </div>

        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Profile"
            style={{
              width: `${personalInfo.photoSize || 96}px`,
              height: `${personalInfo.photoSize || 96}px`,
              borderColor: themeColor
            }}
            className={`object-cover shadow border-2 transition-all duration-300 ${
              personalInfo.photoShape === 'circle'
                ? 'rounded-full'
                : personalInfo.photoShape === 'square'
                ? 'rounded-lg'
                : 'rounded-2xl'
            }`}
          />
        )}
      </div>

      {/* Summary */}
      {visibleSections.profile !== false && profile && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            {t('cvExecutiveSummary')}
          </h3>
          <p className="text-[12.5px] text-slate-700 leading-relaxed text-justify">
            {profile}
          </p>
        </div>
      )}

      {/* Experience */}
      {visibleSections.experience !== false && experience.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            {t('cvProfessionalExperience')}
          </h3>
          <div className="space-y-3.5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div className="text-[13.5px] font-bold text-slate-900">
                    {exp.position} — <span style={{ color: themeColor }}>{exp.company}</span>
                  </div>
                  <span className="text-[11.5px] font-semibold text-slate-500">
                    {exp.startDate} – {exp.current ? t('cvPresent') : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <div className="text-[11.5px] text-slate-500 mb-1">{exp.location}</div>
                )}
                {exp.description && (
                  <div className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-line">
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            {t('cvEducation')}
          </h3>
          <div className="space-y-2.5">
            {education.map(edu => (
              <div key={edu.id} className="text-[12.5px]">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{edu.degree} {edu.field && `in ${edu.field}`}</span>
                  <span className="text-[11.5px] font-normal text-slate-500">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="text-slate-600 font-medium">
                  {edu.school} {edu.location && `| ${edu.location}`}
                </div>
                {edu.grade && <div className="text-[11.5px] text-slate-500">{edu.grade}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Languages Dual Columns */}
      <div className="grid grid-cols-2 gap-6">
        {visibleSections.skills !== false && skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              {t('cvKeyCompetencies')}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(skill => (
                <span
                  key={skill.id}
                  className="text-[11.5px] font-medium bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {visibleSections.languages !== false && languages.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              {t('cvLanguages')}
            </h3>
            <div className="text-[12px] space-y-1">
              {languages.map(l => (
                <div key={l.id} className="flex justify-between text-slate-700">
                  <span className="font-semibold">{l.name}</span>
                  <span className="text-slate-500 text-[11px]">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Projects */}
      {visibleSections.projects !== false && projects.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            {t('cvNotableProjects')}
          </h3>
          <div className="space-y-2">
            {projects.map(proj => (
              <div key={proj.id} className="text-[12px]">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.link && (
                    <a href={proj.link} className="text-[11px] font-normal underline" style={{ color: themeColor }}>
                      {t('cvLink')} ↗
                    </a>
                  )}
                </div>
                {proj.description && <p className="text-slate-600 leading-snug">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
