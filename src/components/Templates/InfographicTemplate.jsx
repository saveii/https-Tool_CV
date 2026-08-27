import React from 'react';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, User, Award, CheckCircle } from 'lucide-react';

export const InfographicTemplate = ({ data, themeColor = '#3e7bbd', fontFamily, fontSize, visibleSections = {}, t = (k) => k }) => {
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

  const primaryColor = themeColor || '#3e7bbd';

  return (
    <div className="w-full min-h-[297mm] bg-white text-slate-800 grid grid-cols-[74mm_136mm] box-border p-4 gap-4" style={fontStyle}>
      {/* Left Column: Rounded Blue Arch Sidebar */}
      <aside
        className="rounded-t-[36px] rounded-b-2xl p-5 flex flex-col items-center text-white shadow-md relative overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Profile Photo */}
        <div className="mt-2 mb-4 flex justify-center">
          <img
            src={personalInfo.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(personalInfo.fullName || 'Paskal')}&backgroundColor=ffffff`}
            alt={personalInfo.fullName}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>

        {/* Full Name & Headline in Sidebar */}
        <div className="text-center mb-6 w-full px-2">
          <h1 className="text-lg font-black uppercase tracking-wider leading-tight text-white drop-shadow-sm">
            {personalInfo.fullName || 'PASKAL RIAN DUHA'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-[11.5px] font-medium text-blue-100 uppercase tracking-widest mt-1 opacity-90">
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {/* KONTAK Container Box */}
        {visibleSections.personalInfo !== false && (
          <div className="w-full mb-6">
            {/* White Pill Badge Header */}
            <div className="bg-white rounded-md py-1 px-3 text-center shadow-sm mb-3">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                KONTAK / CONTACT
              </span>
            </div>

            {/* Contact Items */}
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

        {/* KEAHLIAN / SKILLS Container Box */}
        {visibleSections.skills !== false && skills.length > 0 && (
          <div className="w-full mb-6">
            <div className="bg-white rounded-md py-1 px-3 text-center shadow-sm mb-3">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                KEAHLIAN / SKILLS
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

        {/* Languages in Sidebar */}
        {visibleSections.languages !== false && languages.length > 0 && (
          <div className="w-full">
            <div className="bg-white rounded-md py-1 px-3 text-center shadow-sm mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                BAHASA / LANGUAGES
              </span>
            </div>
            <div className="space-y-1 text-[11.5px] text-blue-50 px-1 text-center font-medium">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="opacity-80 text-[10.5px]">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Column: Numbered Banner Sections */}
      <main className="py-2 pr-2 flex flex-col gap-6 relative">
        {/* Section 1: DATA PRIBADI / ABOUT ME */}
        {visibleSections.profile !== false && (
          <div className="relative">
            {/* Numbered Pill Header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow"
                style={{ backgroundColor: primaryColor }}
              >
                1
              </div>
              <div
                className="flex-1 py-1 px-3.5 rounded-r-md text-white font-black text-xs uppercase tracking-wider"
                style={{ backgroundColor: primaryColor }}
              >
                DATA PRIBADI / PERSONAL PROFILE
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="pl-9 text-xs text-slate-700 space-y-1.5 leading-relaxed">
              {profile ? (
                <p className="text-[12px] text-slate-600 mb-2 leading-relaxed">{profile}</p>
              ) : null}
              <div className="grid grid-cols-[32mm_1fr] gap-1 text-[12px]">
                <span className="font-semibold text-slate-500">Nama / Name:</span>
                <span className="font-bold text-slate-900">{personalInfo.fullName || 'Paskal Rian Duha'}</span>

                <span className="font-semibold text-slate-500">Profesi / Title:</span>
                <span className="text-slate-800">{personalInfo.jobTitle || 'Professional'}</span>

                <span className="font-semibold text-slate-500">Alamat / Address:</span>
                <span className="text-slate-800">{personalInfo.location || 'Phnom Penh, Cambodia'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: RIWAYAT PENDIDIKAN / EDUCATION */}
        {visibleSections.education !== false && education.length > 0 && (
          <div className="relative">
            {/* Numbered Pill Header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow"
                style={{ backgroundColor: primaryColor }}
              >
                2
              </div>
              <div
                className="flex-1 py-1 px-3.5 rounded-r-md text-white font-black text-xs uppercase tracking-wider"
                style={{ backgroundColor: primaryColor }}
              >
                RIWAYAT PENDIDIKAN / EDUCATION
              </div>
            </div>

            {/* Education Timeline */}
            <div className="pl-9 space-y-3 relative border-l-2 border-slate-200 ml-3.5 my-1">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-3">
                  <div
                    className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="text-[11px] font-bold text-slate-500 font-mono">
                    {edu.startDate} – {edu.endDate}
                  </div>
                  <div className="text-xs font-black uppercase text-slate-900 tracking-tight">
                    {edu.school}
                  </div>
                  <div className="text-[11.5px] text-slate-600 font-medium">
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
            {/* Numbered Pill Header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow"
                style={{ backgroundColor: primaryColor }}
              >
                3
              </div>
              <div
                className="flex-1 py-1 px-3.5 rounded-r-md text-white font-black text-xs uppercase tracking-wider"
                style={{ backgroundColor: primaryColor }}
              >
                PENGALAMAN KERJA / WORK EXPERIENCE
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="pl-9 space-y-4 relative border-l-2 border-slate-200 ml-3.5 my-1">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-3">
                  <div
                    className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="text-[11px] font-bold text-slate-500 font-mono">
                    {exp.startDate} – {exp.current ? t('cvPresent') : exp.endDate}
                  </div>
                  <div className="text-xs font-black uppercase text-slate-900 tracking-tight">
                    {exp.company}
                  </div>
                  <div className="text-[11.5px] font-bold" style={{ color: primaryColor }}>
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

        {/* Certifications or References if present */}
        {visibleSections.certificates !== false && certificates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow"
                style={{ backgroundColor: primaryColor }}
              >
                4
              </div>
              <div
                className="flex-1 py-1 px-3.5 rounded-r-md text-white font-black text-xs uppercase tracking-wider"
                style={{ backgroundColor: primaryColor }}
              >
                SERTIFIKAT / CERTIFICATIONS
              </div>
            </div>
            <div className="pl-9 space-y-1.5 text-xs">
              {certificates.map((c) => (
                <div key={c.id} className="text-slate-800 font-medium">
                  • <span className="font-bold">{c.name}</span> {c.issuer ? `(${c.issuer})` : ''} {c.date ? `– ${c.date}` : ''}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
