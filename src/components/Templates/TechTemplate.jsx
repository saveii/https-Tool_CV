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
  Code2,
  Terminal,
  Cpu,
  GitBranch,
  ExternalLink,
  Layers
} from 'lucide-react';

export const TechTemplate = ({
  data,
  themeColor = '#0d9488',
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
    fontFamily: `'${fontFamily}', 'Inter', 'Kantumruy Pro', sans-serif`
  };

  const primaryColor = themeColor || '#0d9488';

  return (
    <div
      className="w-full min-h-[297mm] bg-slate-950 text-slate-100 box-border p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
      style={fontStyle}
    >
      {/* Background Tech Hex Grid Decorative Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header: Tech Specialist Identity */}
        <header className="flex items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider rounded-md border flex items-center gap-1.5"
                style={{
                  color: primaryColor,
                  borderColor: `${primaryColor}40`,
                  backgroundColor: `${primaryColor}15`
                }}
              >
                <Terminal className="w-3 h-3" />
                <span>TECH ARCHITECT & DEVELOPER</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 truncate">
              <span>{personalInfo.fullName || 'Tech Professional'}</span>
            </h1>

            {personalInfo.jobTitle && (
              <p className="text-sm font-semibold text-slate-300 mt-1 font-mono">
                &gt; {personalInfo.jobTitle}
              </p>
            )}

            {/* Tech Contact Metadata Badges */}
            {visibleSections.personalInfo !== false && (
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-3.5">
                {personalInfo.email && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg">
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>{personalInfo.email}</span>
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{personalInfo.phone}</span>
                  </span>
                )}
                {personalInfo.location && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{personalInfo.location}</span>
                  </span>
                )}
                {personalInfo.website && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg">
                    <Globe className="w-3 h-3 text-indigo-400" />
                    <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                  </span>
                )}
                {personalInfo.github && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg">
                    <GitBranch className="w-3 h-3 text-purple-400" />
                    <span>{personalInfo.github.replace(/^https?:\/\//, '')}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Avatar with Glow Ring */}
          {personalInfo.photo && (
            <div className="shrink-0 relative">
              <div
                className="absolute inset-0 rounded-2xl blur-md opacity-40"
                style={{ backgroundColor: primaryColor }}
              />
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                style={{
                  width: `${personalInfo.photoSize || 115}px`,
                  height: `${personalInfo.photoSize || 115}px`,
                  borderColor: primaryColor
                }}
                className={`relative object-cover border-2 shadow-2xl bg-slate-900 transition-all duration-300 ${
                  personalInfo.photoShape === 'circle'
                    ? 'rounded-full'
                    : personalInfo.photoShape === 'square'
                    ? 'rounded-lg'
                    : 'rounded-2xl'
                }`}
              />
            </div>
          )}
        </header>

        {/* 2-Column Body Layout */}
        <div className="grid grid-cols-[1fr_78mm] gap-6 mt-6 items-start">
          {/* Main Column: Summary, Experience, Engineering Projects */}
          <div className="space-y-6">
            {/* Tech Summary / Bio */}
            {visibleSections.profile !== false && profile && (
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
                <h2
                  className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 mb-2"
                  style={{ color: primaryColor }}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>// {t('cvSummary')}</span>
                </h2>
                <p className="text-[12px] text-slate-300 leading-relaxed text-justify">
                  {profile}
                </p>
              </div>
            )}

            {/* Experience / Roles */}
            {visibleSections.experience !== false && experience.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800 mb-3.5"
                  style={{ color: primaryColor }}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>// {t('cvExperience')}</span>
                </h2>

                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1.5"
                    >
                      <div className="flex justify-between items-baseline flex-wrap gap-1">
                        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{exp.position}</span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            @ {exp.company}
                          </span>
                        </h3>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded border"
                          style={{
                            color: primaryColor,
                            borderColor: `${primaryColor}40`,
                            backgroundColor: `${primaryColor}10`
                          }}
                        >
                          {exp.startDate} – {exp.current ? (t('present') || 'Present') : exp.endDate}
                        </span>
                      </div>

                      {exp.location && (
                        <div className="text-[10.5px] text-slate-500">{exp.location}</div>
                      )}

                      {exp.description && (
                        <p className="text-[11.5px] text-slate-300 leading-relaxed whitespace-pre-line text-justify pt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Projects / Codebases */}
            {visibleSections.projects !== false && projects && projects.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800 mb-3"
                  style={{ color: primaryColor }}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>// {t('cvProjects')}</span>
                </h2>

                <div className="grid grid-cols-1 gap-2.5">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl"
                    >
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{proj.title}</span>
                        </h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5 truncate max-w-[150px]"
                          >
                            <span>{proj.link.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      {proj.tech && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {proj.tech.split(',').map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 text-[9.5px] font-mono bg-slate-800 border border-slate-700 text-slate-300 rounded"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {proj.description && (
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Tech Stack Pills, Education, Certs, Languages */}
          <aside className="space-y-4">
            {/* Tech Stack & Skills (Pills/Chips) */}
            {visibleSections.skills !== false && skills.length > 0 && (
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
                <h3
                  className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 mb-2.5"
                  style={{ color: primaryColor }}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>// {t('cvSkills')}</span>
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => {
                    const name = typeof skill === 'object' ? skill.name : skill;
                    const level = typeof skill === 'object' ? skill.level : null;
                    return (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[11px] font-medium flex items-center gap-1 transition"
                      >
                        <span>{name}</span>
                        {level && (
                          <span
                            className="text-[9px] font-mono font-bold px-1 rounded"
                            style={{ color: primaryColor }}
                          >
                            {level}%
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Education */}
            {visibleSections.education !== false && education.length > 0 && (
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
                <h3
                  className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 mb-2.5"
                  style={{ color: primaryColor }}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>// {t('cvEducation')}</span>
                </h3>

                <div className="space-y-2.5">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-[11px]">
                      <div className="font-bold text-white leading-tight">{edu.degree}</div>
                      <div className="text-slate-400 font-medium text-[10.5px]">
                        {edu.institution}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {edu.startDate} – {edu.endDate} {edu.grade && `• GPA: ${edu.grade}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {visibleSections.certificates !== false && certificates.length > 0 && (
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
                <h3
                  className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 mb-2.5"
                  style={{ color: primaryColor }}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>// {t('cvCertificates')}</span>
                </h3>

                <div className="space-y-2 text-[11px]">
                  {certificates.map((cert) => (
                    <div key={cert.id}>
                      <div className="font-bold text-white leading-tight">{cert.name}</div>
                      <div className="text-slate-400 text-[10.5px]">
                        {cert.issuer} {cert.date && `(${cert.date})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {visibleSections.languages !== false && languages.length > 0 && (
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
                <h3
                  className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 mb-2"
                  style={{ color: primaryColor }}
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>// {t('cvLanguages')}</span>
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {languages.map((lang, idx) => {
                    const name = typeof lang === 'object' ? lang.name : lang;
                    const level = typeof lang === 'object' ? lang.level : '';
                    return (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10.5px] font-medium text-slate-300"
                      >
                        {name} {level && <span className="text-slate-500 font-normal">({level})</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* References */}
            {visibleSections.references !== false && references.length > 0 && (
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
                <h3
                  className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 mb-2"
                  style={{ color: primaryColor }}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>// {t('cvReferences')}</span>
                </h3>

                <div className="space-y-2 text-[11px]">
                  {references.map((ref) => (
                    <div key={ref.id}>
                      <div className="font-bold text-white">{ref.name}</div>
                      <div className="text-slate-400 text-[10px]">
                        {ref.position} • {ref.company}
                      </div>
                      {ref.phone && <div className="text-slate-500 text-[9.5px]">{ref.phone}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Terminal Status Bar at Bottom */}
      <footer className="mt-8 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PORTFOLIO COMPILED // READY FOR PRODUCTION</span>
        </span>
        <span>A4 STANDARD FORMAT</span>
      </footer>
    </div>
  );
};
