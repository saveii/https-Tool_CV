import React from 'react';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, User, Award, CheckCircle } from 'lucide-react';

export const InfographicTemplate = ({ data, themeColor = '#2563eb', fontFamily, fontSize, visibleSections = {}, t = (k) => k }) => {
  const {
    personalInfo = {},
    profile = '',
    experience = [],
    education = [],
    skills = [],
    languages = [],
    certificates = [],
    references = []
  } = data;

  const fontStyle = {
    fontFamily: `'${fontFamily}', 'Kantumruy Pro', 'Inter', sans-serif`
  };

  const primaryColor = themeColor || '#2563eb';

  return (
    <div
      className="w-full min-h-[297mm] bg-white text-slate-800 grid grid-cols-[74mm_1fr] box-border p-5 gap-5 items-stretch"
      style={fontStyle}
    >
      {/* Left Column: Equal Height Blue Arch Sidebar */}
      <aside
        className="rounded-[28px] p-5 flex flex-col justify-between text-white shadow-md relative overflow-hidden h-full"
        style={{ backgroundColor: primaryColor }}
      >
        <div>
          {/* Profile Photo */}
          <div className="mt-2 mb-4 flex justify-center">
            <div className="relative">
              <img
                src={personalInfo.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(personalInfo.fullName || 'User')}&backgroundColor=ffffff`}
                alt={personalInfo.fullName}
                style={{
                  width: `${personalInfo.photoSize || 128}px`,
                  height: `${personalInfo.photoSize || 128}px`
                }}
                className={`object-cover border-4 border-white shadow-xl bg-white transition-all duration-300 ${
                  personalInfo.photoShape === 'rounded'
                    ? 'rounded-3xl'
                    : personalInfo.photoShape === 'square'
                    ? 'rounded-2xl'
                    : 'rounded-full'
                }`}
              />
            </div>
          </div>

          {/* Full Name & Headline in Sidebar */}
          <div className="text-center mb-6 w-full px-2">
            <h1 className="text-lg font-black uppercase tracking-wider leading-tight text-white drop-shadow-sm">
              {personalInfo.fullName || 'Full Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-[11.5px] font-semibold text-blue-100 uppercase tracking-widest mt-1.5 opacity-95">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>

          {/* KONTAK / CONTACT Box */}
          {visibleSections.personalInfo !== false && (
            <div className="w-full mb-6">
              <div className="bg-white rounded-lg py-1.5 px-3 text-center shadow-sm mb-3">
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                  ទំនាក់ទំនង / CONTACT
                </span>
              </div>

              <div className="space-y-2.5 text-[11.5px] text-blue-50 px-1 font-medium">
                {personalInfo.phone && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Phone className="w-3 h-3 text-white" />
                    </div>
                    <span className="break-all">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.email && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Mail className="w-3 h-3 text-white" />
                    </div>
                    <span className="break-all text-[11px]">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Globe className="w-3 h-3 text-white" />
                    </div>
                    <span className="break-all text-[11px]">{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                    <span className="break-all">{personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* KEAHLIAN / SKILLS Box */}
          {visibleSections.skills !== false && skills.length > 0 && (
            <div className="w-full mb-6">
              <div className="bg-white rounded-lg py-1.5 px-3 text-center shadow-sm mb-3">
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                  ជំនាញ / SKILLS
                </span>
              </div>

              <ol className="space-y-2 text-[11.5px] text-blue-50 px-1 font-medium">
                {skills.map((skill, idx) => (
                  <li key={skill.id} className="flex items-start gap-1.5 leading-snug">
                    <span className="font-bold shrink-0">{idx + 1}.</span>
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* BAHASA / LANGUAGES Box */}
          {visibleSections.languages !== false && languages.length > 0 && (
            <div className="w-full">
              <div className="bg-white rounded-lg py-1.5 px-3 text-center shadow-sm mb-3">
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                  ភាសា / LANGUAGES
                </span>
              </div>
              <div className="space-y-1.5 text-[11.5px] text-blue-50 px-1 font-medium">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center">
                    <span>{l.name}</span>
                    <span className="opacity-90 text-[10.5px] bg-white/15 px-2 py-0.5 rounded-full">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Right Column: Equal Height Structured Content */}
      <main className="flex flex-col justify-start gap-5 relative py-1">
        {/* Section 1: DATA PRIBADI / PERSONAL PROFILE */}
        {visibleSections.profile !== false && (
          <div className="relative">
            <div className="flex items-center rounded-r-lg rounded-l-full shadow-sm mb-3 overflow-hidden" style={{ backgroundColor: primaryColor }}>
              <div className="w-7 h-7 rounded-full bg-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm m-0.5" style={{ color: primaryColor }}>
                1
              </div>
              <div className="flex-1 px-3 py-1.5 text-white font-black text-xs uppercase tracking-wider">
                ព័ត៌មានផ្ទាល់ខ្លួន / PERSONAL PROFILE
              </div>
            </div>

            <div className="pl-8 text-xs text-slate-700 space-y-2 leading-relaxed">
              {profile ? (
                <p className="text-[12px] text-slate-600 mb-2 leading-relaxed">{profile}</p>
              ) : null}
              <div className="grid grid-cols-[36mm_1fr] gap-1.5 text-[12px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">ឈ្មោះ / Full Name:</span>
                <span className="font-bold text-slate-900">{personalInfo.fullName || 'Full Name'}</span>

                <span className="font-semibold text-slate-500">មុខតំណែង / Title:</span>
                <span className="text-slate-800 font-medium">{personalInfo.jobTitle || 'Professional'}</span>

                <span className="font-semibold text-slate-500">អាសយដ្ឋាន / Address:</span>
                <span className="text-slate-800 font-medium">{personalInfo.location || 'Phnom Penh, Cambodia'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: RIWAYAT PENDIDIKAN / EDUCATION */}
        {visibleSections.education !== false && education.length > 0 && (
          <div className="relative">
            <div className="flex items-center rounded-r-lg rounded-l-full shadow-sm mb-3 overflow-hidden" style={{ backgroundColor: primaryColor }}>
              <div className="w-7 h-7 rounded-full bg-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm m-0.5" style={{ color: primaryColor }}>
                2
              </div>
              <div className="flex-1 px-3 py-1.5 text-white font-black text-xs uppercase tracking-wider">
                ប្រវត្តិការសិក្សា / EDUCATION
              </div>
            </div>

            <div className="pl-8 space-y-3.5 relative border-l-2 border-slate-200 ml-4 my-1">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-3.5">
                  <div
                    className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="text-[11px] font-bold text-slate-500 font-mono">
                    {edu.startDate} – {edu.endDate}
                  </div>
                  <div className="text-xs font-black uppercase text-slate-900 tracking-tight mt-0.5">
                    {edu.school}
                  </div>
                  <div className="text-[11.5px] text-slate-600 font-medium mt-0.5">
                    {edu.degree} {edu.field ? `(${edu.field})` : ''} {edu.grade ? `• ${edu.grade}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: PENGALAMAN KERJA / WORK EXPERIENCE */}
        {visibleSections.experience !== false && experience.length > 0 && (
          <div className="relative">
            <div className="flex items-center rounded-r-lg rounded-l-full shadow-sm mb-3 overflow-hidden" style={{ backgroundColor: primaryColor }}>
              <div className="w-7 h-7 rounded-full bg-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm m-0.5" style={{ color: primaryColor }}>
                3
              </div>
              <div className="flex-1 px-3 py-1.5 text-white font-black text-xs uppercase tracking-wider">
                បទពិសោធន៍ការងារ / WORK EXPERIENCE
              </div>
            </div>

            <div className="pl-8 space-y-4 relative border-l-2 border-slate-200 ml-4 my-1">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-3.5">
                  <div
                    className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="text-[11px] font-bold text-slate-500 font-mono">
                    {exp.startDate} – {exp.current ? t('cvPresent') : exp.endDate}
                  </div>
                  <div className="text-xs font-black uppercase text-slate-900 tracking-tight mt-0.5">
                    {exp.company}
                  </div>
                  <div className="text-[11.5px] font-bold mt-0.5" style={{ color: primaryColor }}>
                    ({exp.position})
                  </div>
                  {exp.description && (
                    <div className="text-[11.5px] text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: SERTIFIKAT / CERTIFICATIONS */}
        {visibleSections.certificates !== false && certificates.length > 0 && (
          <div className="relative">
            <div className="flex items-center rounded-r-lg rounded-l-full shadow-sm mb-3 overflow-hidden" style={{ backgroundColor: primaryColor }}>
              <div className="w-7 h-7 rounded-full bg-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm m-0.5" style={{ color: primaryColor }}>
                4
              </div>
              <div className="flex-1 px-3 py-1.5 text-white font-black text-xs uppercase tracking-wider">
                វិញ្ញាបនបត្រ / CERTIFICATIONS
              </div>
            </div>

            <div className="pl-8 space-y-2 text-xs">
              {certificates.map((c) => (
                <div key={c.id} className="text-slate-800 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primaryColor }}></span>
                  <span>
                    <strong className="text-slate-900">{c.name}</strong>
                    {c.issuer ? ` (${c.issuer})` : ''}
                    {c.date ? ` – ${c.date}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
