import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Users,
  CheckCircle,
  FolderGit2,
  Sparkles
} from 'lucide-react';

export const ExecutiveTemplate = ({
  data,
  themeColor = '#1e3a8a',
  fontFamily,
  fontSize,
  visibleSections = {},
  t = (k) => k
}) => {
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
    fontFamily: `'${fontFamily}', 'Kantumruy Pro', 'Inter', sans-serif`
  };

  const primaryColor = themeColor || '#1e3a8a';

  return (
    <div
      className="w-full min-h-[297mm] bg-white text-slate-900 box-border flex flex-col justify-between shadow-sm relative overflow-hidden"
      style={fontStyle}
    >
      {/* Top Executive Header Band */}
      <header
        className="p-8 text-white relative flex items-center justify-between gap-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, #1e293b 60%, ${primaryColor} 100%)`
        }}
      >
        {/* Decorative Golden Accent Stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="flex-1 min-w-0 z-10">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full text-white/90 border border-white/20"
              style={{ backgroundColor: `${primaryColor}66` }}
            >
              Executive Portfolio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-none truncate">
            {personalInfo.fullName || 'Executive Candidate'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-sm font-semibold text-slate-200 mt-1 tracking-wide">
              {personalInfo.jobTitle}
            </p>
          )}

          {/* Quick Contact Bar */}
          {visibleSections.personalInfo !== false && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-slate-300 mt-3 pt-3 border-t border-slate-700/80">
              {personalInfo.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{personalInfo.email}</span>
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{personalInfo.phone}</span>
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{personalInfo.location}</span>
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar Photo */}
        {personalInfo.photo && (
          <div className="shrink-0 z-10">
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              style={{
                width: `${personalInfo.photoSize || 120}px`,
                height: `${personalInfo.photoSize || 120}px`,
                borderColor: primaryColor
              }}
              className={`object-cover border-4 shadow-xl bg-slate-900 transition-all duration-300 ${
                personalInfo.photoShape === 'circle'
                  ? 'rounded-full'
                  : personalInfo.photoShape === 'square'
                  ? 'rounded-xl'
                  : 'rounded-2xl'
              }`}
            />
          </div>
        )}
      </header>

      {/* Main 2-Column Body Content */}
      <div className="flex-1 p-7 grid grid-cols-[1fr_75mm] gap-6 items-start">
        {/* Left Column: Summary, Experience, Key Projects */}
        <div className="space-y-5">
          {/* Executive Summary */}
          {visibleSections.profile !== false && profile && (
            <div>
              <h2
                className="text-xs font-black uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b-2 mb-2"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('cvSummary')}</span>
              </h2>
              <p className="text-[12px] text-slate-700 leading-relaxed text-justify font-normal bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                {profile}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {visibleSections.experience !== false && experience.length > 0 && (
            <div>
              <h2
                className="text-xs font-black uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b-2 mb-3"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t('cvExperience')}</span>
              </h2>

              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-3.5 border-l-2 border-slate-200">
                    <div
                      className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {exp.position}
                      </h3>
                      <span className="text-[10.5px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {exp.startDate} – {exp.current ? (t('present') || 'Present') : exp.endDate}
                      </span>
                    </div>

                    <div className="text-[11.5px] font-medium text-slate-700 mt-0.5 flex items-center gap-2">
                      <span className="font-semibold" style={{ color: primaryColor }}>
                        {exp.company}
                      </span>
                      {exp.location && <span className="text-slate-400">• {exp.location}</span>}
                    </div>

                    {exp.description && (
                      <p className="text-[11.5px] text-slate-600 leading-relaxed mt-1.5 whitespace-pre-line text-justify">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Projects */}
          {visibleSections.projects !== false && projects && projects.length > 0 && (
            <div>
              <h2
                className="text-xs font-black uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b-2 mb-3"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>{t('cvProjects')}</span>
              </h2>

              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                      {proj.link && (
                        <span className="text-[10px] text-blue-600 font-medium truncate max-w-[140px]">
                          {proj.link}
                        </span>
                      )}
                    </div>
                    {proj.tech && (
                      <p className="text-[10.5px] text-slate-500 font-semibold mt-0.5">
                        Tech: {proj.tech}
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Skills, Education, Certs, Languages, References */}
        <aside className="space-y-4">
          {/* Core Competencies / Skills with Progress Meters */}
          {visibleSections.skills !== false && skills.length > 0 && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3
                className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-3"
                style={{ color: primaryColor }}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t('cvSkills')}</span>
              </h3>

              <div className="space-y-2">
                {skills.map((skill, idx) => {
                  const name = typeof skill === 'object' ? skill.name : skill;
                  const level = typeof skill === 'object' ? skill.level || 85 : 85;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-slate-800 mb-1">
                        <span>{name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{level}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${level}%`,
                            backgroundColor: primaryColor
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {visibleSections.education !== false && education.length > 0 && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3
                className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2.5"
                style={{ color: primaryColor }}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t('cvEducation')}</span>
              </h3>

              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[11.5px]">
                    <div className="font-bold text-slate-900 leading-tight">{edu.degree}</div>
                    <div className="font-semibold text-slate-600 text-[11px]">{edu.institution}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {edu.startDate} – {edu.endDate} {edu.grade && `• GPA: ${edu.grade}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {visibleSections.certificates !== false && certificates.length > 0 && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3
                className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2.5"
                style={{ color: primaryColor }}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{t('cvCertificates')}</span>
              </h3>

              <div className="space-y-2 text-[11px]">
                {certificates.map((cert) => (
                  <div key={cert.id}>
                    <div className="font-bold text-slate-900 leading-tight">{cert.name}</div>
                    <div className="text-slate-500 text-[10.5px]">
                      {cert.issuer} {cert.date && `(${cert.date})`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {visibleSections.languages !== false && languages.length > 0 && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3
                className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2"
                style={{ color: primaryColor }}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{t('cvLanguages')}</span>
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {languages.map((lang, idx) => {
                  const name = typeof lang === 'object' ? lang.name : lang;
                  const level = typeof lang === 'object' ? lang.level : '';
                  return (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 shadow-sm"
                    >
                      {name} {level && <span className="text-slate-400 font-normal">({level})</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* References */}
          {visibleSections.references !== false && references.length > 0 && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3
                className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2"
                style={{ color: primaryColor }}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t('cvReferences')}</span>
              </h3>

              <div className="space-y-2 text-[11px]">
                {references.map((ref) => (
                  <div key={ref.id}>
                    <div className="font-bold text-slate-900">{ref.name}</div>
                    <div className="text-slate-600 text-[10.5px]">
                      {ref.position} • {ref.company}
                    </div>
                    {ref.phone && <div className="text-slate-500 text-[10px]">{ref.phone}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Subtle Executive Footer Bar */}
      <footer className="h-2 w-full" style={{ backgroundColor: primaryColor }} />
    </div>
  );
};
