import React from 'react';
import { Mail, Phone, MapPin, Globe, Link2, GitBranch, Award, BookOpen, Briefcase, UserCheck, Code } from 'lucide-react';

export const ModernTemplate = ({ data, themeColor, fontFamily, fontSize, visibleSections, t = (k) => k }) => {
  const {
    personalInfo = {},
    profile = '',
    experience = [],
    education = [],
    skills = [],
    languages = [],
    certificates = [],
    projects = [],
    references = []
  } = data;

  const fontStyle = {
    fontFamily: `'${fontFamily}', 'Kantumruy Pro', sans-serif`
  };

  return (
    <div className="w-full min-h-[297mm] bg-white text-slate-800 grid grid-cols-[72mm_138mm] box-border" style={fontStyle}>
      {/* Left Sidebar */}
      <aside className="bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-5">
        {/* Photo */}
        {personalInfo.photo && (
          <div className="flex justify-center mb-1">
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              style={{
                width: `${personalInfo.photoSize || 112}px`,
                height: `${personalInfo.photoSize || 112}px`,
                borderColor: themeColor
              }}
              className={`object-cover shadow-md border-2 transition-all duration-300 ${
                personalInfo.photoShape === 'rounded'
                  ? 'rounded-2xl'
                  : personalInfo.photoShape === 'square'
                  ? 'rounded-lg'
                  : 'rounded-full'
              }`}
            />
          </div>
        )}

        {/* Contact Info */}
        {visibleSections.personalInfo !== false && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-1 mb-2.5" style={{ borderColor: themeColor }}>
              {t('cvContact')}
            </h3>
            <div className="space-y-2 text-[12px] text-slate-600">
              {personalInfo.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2 break-all">
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
                  <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2 break-all">
                  <Link2 className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
                  <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-2 break-all">
                  <GitBranch className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
                  <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {visibleSections.skills !== false && skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-1 mb-2.5 flex items-center gap-1.5" style={{ borderColor: themeColor }}>
              <Code className="w-3.5 h-3.5" style={{ color: themeColor }} />
              {t('cvSkills')}
            </h3>
            <div className="space-y-2">
              {skills.map(skill => (
                <div key={skill.id} className="text-[12px]">
                  <div className="flex justify-between font-medium text-slate-700 mb-0.5">
                    <span>{skill.name}</span>
                    <span className="text-[10.5px] text-slate-400 font-normal">{skill.level}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: themeColor,
                        width: `${skill.rating ? skill.rating * 20 : 80}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {visibleSections.languages !== false && languages.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-1 mb-2.5" style={{ borderColor: themeColor }}>
              {t('cvLanguages')}
            </h3>
            <div className="space-y-1.5 text-[12px]">
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-[11px] text-slate-500">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {visibleSections.certificates !== false && certificates.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-1 mb-2.5 flex items-center gap-1.5" style={{ borderColor: themeColor }}>
              <Award className="w-3.5 h-3.5" style={{ color: themeColor }} />
              {t('cvCertifications')}
            </h3>
            <div className="space-y-2.5 text-[11.5px]">
              {certificates.map(cert => (
                <div key={cert.id}>
                  <div className="font-semibold text-slate-800 leading-snug">{cert.name}</div>
                  <div className="text-slate-500 text-[10.5px]">
                    {cert.issuer} {cert.date && `• ${cert.date}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Right Content */}
      <main className="p-7 flex flex-col gap-5">
        {/* Header Name & Title */}
        <div className="border-b border-slate-200 pb-3">
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight leading-none">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-base font-semibold mt-1" style={{ color: themeColor }}>
            {personalInfo.jobTitle || 'Professional Title'}
          </p>
          {visibleSections.profile !== false && profile && (
            <p className="text-[12.5px] text-slate-600 mt-2.5 leading-relaxed text-justify">
              {profile}
            </p>
          )}
        </div>

        {/* Experience Section */}
        {visibleSections.experience !== false && experience.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: themeColor }}>
              <Briefcase className="w-4 h-4" />
              {t('cvWorkExperience')}
            </h2>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-3.5 border-l-2 border-slate-200">
                  <div
                    className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[13.5px] font-bold text-slate-900">{exp.position}</h4>
                    <span className="text-[11.5px] font-medium text-slate-500">
                      {exp.startDate} – {exp.current ? t('cvPresent') : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[12.5px] font-semibold mb-1" style={{ color: themeColor }}>
                    {exp.company} {exp.location && <span className="text-slate-400 font-normal">| {exp.location}</span>}
                  </div>
                  {exp.description && (
                    <div className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {visibleSections.education !== false && education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: themeColor }}>
              <BookOpen className="w-4 h-4" />
              {t('cvEducation')}
            </h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="text-[12.5px]">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium">
                    {edu.school} {edu.location && <span className="text-slate-400">| {edu.location}</span>}
                  </div>
                  {edu.grade && (
                    <div className="text-[11.5px] text-slate-500 mt-0.5">
                      {edu.grade}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {visibleSections.projects !== false && projects.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: themeColor }}>
              <Code className="w-4 h-4" />
              {t('cvProjects')}
            </h2>
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id} className="text-[12px] bg-slate-50 p-2.5 rounded border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] hover:underline" style={{ color: themeColor }}>
                        {t('cvLink')} ↗
                      </a>
                    )}
                  </div>
                  {proj.tech && (
                    <div className="text-[11px] font-medium text-slate-500 mb-1">
                      {t('cvTech')}: {proj.tech}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-slate-600 leading-snug">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {visibleSections.references !== false && references.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: themeColor }}>
              <UserCheck className="w-4 h-4" />
              {t('cvReferences')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {references.map(ref => (
                <div key={ref.id} className="text-[11.5px] bg-slate-50 p-2 rounded border border-slate-100">
                  <div className="font-bold text-slate-800">{ref.name}</div>
                  <div className="text-slate-500 text-[10.5px]">{ref.position}, {ref.company}</div>
                  {ref.phone && <div className="text-slate-600 text-[10.5px] mt-0.5">📞 {ref.phone}</div>}
                  {ref.email && <div className="text-slate-600 text-[10.5px]">✉ {ref.email}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
