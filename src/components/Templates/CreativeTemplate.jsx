import React from 'react';
import { Sparkles } from 'lucide-react';

export const CreativeTemplate = ({ data, themeColor, fontFamily, fontSize, visibleSections, t = (k) => k }) => {
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
    fontFamily: `'${fontFamily}', 'Outfit', 'Kantumruy Pro', sans-serif`
  };

  return (
    <div className="w-full min-h-[297mm] bg-white text-slate-800 box-border" style={fontStyle}>
      {/* Banner Header */}
      <div
        className="p-8 text-white flex items-center gap-6"
        style={{
          background: `linear-gradient(135deg, ${themeColor} 0%, #0f172a 100%)`
        }}
      >
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Profile"
            style={{
              width: `${personalInfo.photoSize || 96}px`,
              height: `${personalInfo.photoSize || 96}px`
            }}
            className={`object-cover border-4 border-white/80 shadow-lg transition-all duration-300 ${
              personalInfo.photoShape === 'circle'
                ? 'rounded-full'
                : personalInfo.photoShape === 'square'
                ? 'rounded-lg'
                : 'rounded-2xl'
            }`}
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight leading-none text-white">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="text-lg font-medium opacity-90 mt-1 text-slate-100">
            {personalInfo.jobTitle || 'Creative Specialist'}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] opacity-80 mt-2">
            {personalInfo.email && <span className="flex items-center gap-1">✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1">📞 {personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1">📍 {personalInfo.location}</span>}
            {personalInfo.website && <span className="flex items-center gap-1">🌐 {personalInfo.website}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-7 space-y-5">
        {/* Profile */}
        {visibleSections.profile !== false && profile && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: themeColor }}>
              <Sparkles className="w-3.5 h-3.5" />
              {t('cvAboutMe')}
            </div>
            <p className="text-[12.5px] text-slate-600 leading-relaxed text-justify">
              {profile}
            </p>
          </div>
        )}

        {/* Experience with Creative Timeline */}
        {visibleSections.experience !== false && experience.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
              {t('cvWorkExperience')}
            </h3>
            <div className="space-y-3.5 pl-3 border-l-2 border-dashed border-slate-200">
              {experience.map(exp => (
                <div key={exp.id} className="relative">
                  <div
                    className="absolute -left-[19px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: themeColor }}
                  />
                  <div className="flex justify-between items-baseline">
                    <span className="text-[13.5px] font-bold text-slate-900">{exp.position}</span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {exp.startDate} – {exp.current ? t('cvPresent') : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[12px] font-medium" style={{ color: themeColor }}>
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && (
                    <div className="text-[12px] text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
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
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
              {t('cvEducation')}
            </h3>
            <div className="space-y-2">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline text-[12.5px]">
                  <div>
                    <span className="font-bold text-slate-800">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <span className="text-slate-500"> • {edu.school}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Pills */}
        {visibleSections.skills !== false && skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
              {t('cvSkillsTools')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span
                  key={skill.id}
                  className="text-[11.5px] font-semibold px-3 py-1 rounded-full shadow-sm"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: themeColor
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {visibleSections.projects !== false && projects.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
              {t('cvProjects')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {projects.map(proj => (
                <div key={proj.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="font-bold text-[12px] text-slate-900">{proj.title}</div>
                  {proj.tech && <div className="text-[10.5px] text-slate-400 mb-1">{proj.tech}</div>}
                  {proj.description && <div className="text-[11.5px] text-slate-600 line-clamp-2">{proj.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
