// Server-side HTML template generator for Puppeteer PDF rendering

const labels = {
  km: {
    contact: "ទំនាក់ទំនង",
    summary: "សេចក្តីសង្ខេប",
    aboutMe: "អំពីខ្ញុំ",
    experience: "បទពិសោធន៍ការងារ",
    education: "ការអប់រំ & កម្រិតវប្បធម៌",
    skills: "ជំនាញ & សមត្ថភាព",
    languages: "ភាសាបរទេស",
    certifications: "វិញ្ញាបនបត្រ",
    projects: "គម្រោងសំខាន់ៗ",
    references: "អ្នកធានាការងារ",
    present: "បច្ចុប្បន្ន",
    link: "តំណភ្ជាប់"
  },
  en: {
    contact: "Contact",
    summary: "Professional Summary",
    aboutMe: "About Me",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills & Competencies",
    languages: "Languages",
    certifications: "Certifications",
    projects: "Key Projects",
    references: "References",
    present: "Present",
    link: "Link"
  }
};

export const generateCVHtml = ({ data = {}, template = 'infographic', themeColor = '#3e7bbd', fontFamily = 'Inter', fontSize = 'medium', language = 'km' }) => {
  const {
    personalInfo = {},
    profile = '',
    education = [],
    experience = [],
    skills = [],
    languages: cvLanguages = [],
    certificates = [],
    projects = [],
    references = []
  } = data;

  const t = labels[language] || labels.km;

  const fontSizes = {
    small: { base: '13px', title: '18px', heading: '24px', sub: '12px' },
    medium: { base: '14px', title: '20px', heading: '28px', sub: '13px' },
    large: { base: '15px', title: '22px', heading: '32px', sub: '14px' }
  };

  const currentSize = fontSizes[fontSize] || fontSizes.medium;
  const primaryColor = themeColor || '#3e7bbd';

  // Base CSS styles
  const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Kantumruy+Pro:wght@300;400;500;600;700&family=Battambang:wght@400;700&display=swap');

    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: '${fontFamily}', 'Kantumruy Pro', sans-serif;
      font-size: ${currentSize.base};
      color: #1f2937;
      background-color: #ffffff;
      line-height: 1.5;
    }

    .cv-container {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      position: relative;
    }

    a {
      color: inherit;
      text-decoration: none;
    }
  `;

  let contentHtml = '';

  // 0. INFOGRAPHIC ARCH TEMPLATE (Exact match to Pinterest blue arch design)
  if (template === 'infographic') {
    contentHtml = `
      <style>
        ${baseStyles}
        .infographic-layout {
          display: grid;
          grid-template-columns: 74mm 136mm;
          min-height: 297mm;
          padding: 16px;
          gap: 16px;
        }
        .info-sidebar {
          background-color: ${primaryColor};
          border-radius: 36px 36px 16px 16px;
          padding: 24px 16px;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .info-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          margin-bottom: 16px;
        }
        .info-name {
          font-size: 18px;
          font-weight: 900;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.2;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }
        .pill-header {
          background: #ffffff;
          color: ${primaryColor};
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          text-align: center;
          padding: 5px 12px;
          border-radius: 6px;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }
        .pill-box {
          width: 100%;
          margin-bottom: 22px;
        }
        .contact-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11.5px;
          margin-bottom: 8px;
          color: #f0f9ff;
          word-break: break-all;
        }
        .icon-circle {
          width: 22px;
          height: 22px;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
        }
        .numbered-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .num-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: ${primaryColor};
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .num-bar {
          background: ${primaryColor};
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 0 6px 6px 0;
          flex-grow: 1;
          letter-spacing: 0.5px;
        }
        .timeline-section {
          position: relative;
          border-left: 2px solid #e2e8f0;
          margin-left: 12px;
          padding-left: 18px;
          margin-bottom: 18px;
        }
        .timeline-dot {
          position: absolute;
          left: -6px;
          top: 6px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${primaryColor};
          border: 2px solid #ffffff;
        }
        .timeline-item {
          margin-bottom: 14px;
        }
      </style>

      <div class="cv-container infographic-layout">
        <!-- Left Blue Arch Sidebar -->
        <div class="info-sidebar">
          ${personalInfo.photo ? `
            <img src="${personalInfo.photo}" class="info-photo" alt="Photo" />
          ` : `
            <img src="https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(personalInfo.fullName || 'User')}&backgroundColor=ffffff" class="info-photo" alt="Photo" />
          `}

          <div class="info-name">${personalInfo.fullName || 'PASKAL RIAN DUHA'}</div>

          <!-- KONTAK -->
          <div class="pill-box">
            <div class="pill-header">KONTAK / CONTACT</div>
            ${personalInfo.phone ? `
              <div class="contact-row">
                <div class="icon-circle">📞</div>
                <span>${personalInfo.phone}</span>
              </div>
            ` : ''}
            ${personalInfo.email ? `
              <div class="contact-row">
                <div class="icon-circle">✉</div>
                <span>${personalInfo.email}</span>
              </div>
            ` : ''}
            ${personalInfo.website ? `
              <div class="contact-row">
                <div class="icon-circle">📷</div>
                <span>${personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </div>
            ` : ''}
            ${personalInfo.location ? `
              <div class="contact-row">
                <div class="icon-circle">📍</div>
                <span>${personalInfo.location}</span>
              </div>
            ` : ''}
          </div>

          <!-- KEAHLIAN / SKILLS -->
          ${skills && skills.length > 0 ? `
            <div class="pill-box">
              <div class="pill-header">KEAHLIAN / SKILLS</div>
              <ol style="padding-left: 4px; font-size: 11.5px; line-height: 1.6; color: #f0f9ff; list-style: none;">
                ${skills.map((s, idx) => `
                  <li style="margin-bottom: 6px;">
                    <strong>${idx + 1}.</strong> ${s.name || ''}
                  </li>
                `).join('')}
              </ol>
            </div>
          ` : ''}
        </div>

        <!-- Right Column (Numbered Sections) -->
        <div style="padding: 10px 8px;">
          <!-- 1. DATA PRIBADI -->
          <div style="margin-bottom: 20px;">
            <div class="numbered-header">
              <div class="num-circle">1</div>
              <div class="num-bar">DATA PRIBADI / ABOUT ME</div>
            </div>
            <div style="padding-left: 36px; font-size: 12.5px; color: #334155;">
              ${profile ? `<p style="margin-bottom: 8px; line-height: 1.5;">${profile}</p>` : ''}
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr><td style="width: 100px; font-weight: 600; color: #64748b; padding: 2px 0;">Nama:</td><td style="font-weight: 700; color: #0f172a;">${personalInfo.fullName || 'Paskal Rian Duha'}</td></tr>
                <tr><td style="font-weight: 600; color: #64748b; padding: 2px 0;">Alamat:</td><td>${personalInfo.location || 'Phnom Penh, Cambodia'}</td></tr>
                ${personalInfo.jobTitle ? `<tr><td style="font-weight: 600; color: #64748b; padding: 2px 0;">Profesi:</td><td>${personalInfo.jobTitle}</td></tr>` : ''}
              </table>
            </div>
          </div>

          <!-- 2. RIWAYAT PENDIDIKAN -->
          ${education && education.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <div class="numbered-header">
                <div class="num-circle">2</div>
                <div class="num-bar">RIWAYAT PENDIDIKAN / EDUCATION</div>
              </div>
              <div class="timeline-section">
                ${education.map(ed => `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; font-family: monospace;">${ed.startDate || ''} – ${ed.endDate || ''}</div>
                    <div style="font-size: 12.5px; font-weight: 900; text-transform: uppercase; color: #0f172a;">${ed.school || ''}</div>
                    <div style="font-size: 12px; color: #475569;">${ed.degree || ''} ${ed.field ? '(' + ed.field + ')' : ''} ${ed.grade ? '• ' + ed.grade : ''}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 3. PENGALAMAN KERJA -->
          ${experience && experience.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <div class="numbered-header">
                <div class="num-circle">3</div>
                <div class="num-bar">PENGALAMAN KERJA / WORK EXPERIENCE</div>
              </div>
              <div class="timeline-section">
                ${experience.map(exp => `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; font-family: monospace;">${exp.startDate || ''} – ${exp.current ? t.present : (exp.endDate || '')}</div>
                    <div style="font-size: 12.5px; font-weight: 900; text-transform: uppercase; color: #0f172a;">${exp.company || ''}</div>
                    <div style="font-size: 12px; font-weight: 700; color: ${primaryColor};">(${exp.position || ''})</div>
                    ${exp.description ? `<div style="font-size: 11.5px; color: #475569; margin-top: 3px; line-height: 1.4;">${exp.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  // 1. MODERN TEMPLATE
  else if (template === 'modern') {
    contentHtml = `
      <style>
        ${baseStyles}
        .modern-layout {
          display: grid;
          grid-template-columns: 72mm 138mm;
          min-height: 297mm;
        }
        .sidebar {
          background-color: #f8fafc;
          border-right: 2px solid #e2e8f0;
          padding: 24px 18px;
        }
        .main-content {
          padding: 24px 22px;
        }
        .photo-container {
          text-align: center;
          margin-bottom: 18px;
        }
        .profile-photo {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid ${themeColor};
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .contact-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          margin-bottom: 8px;
          color: #4b5563;
          word-break: break-all;
        }
        .sidebar-section {
          margin-bottom: 22px;
        }
        .sidebar-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          border-bottom: 2px solid ${themeColor};
          padding-bottom: 4px;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .header-title {
          font-size: ${currentSize.heading};
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
        }
        .header-subtitle {
          font-size: ${currentSize.title};
          color: ${themeColor};
          font-weight: 600;
          margin-top: 4px;
          margin-bottom: 14px;
        }
        .exp-item, .edu-item, .proj-item {
          margin-bottom: 16px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 13.5px;
          color: #111827;
        }
        .item-sub {
          font-size: 12.5px;
          color: ${themeColor};
          font-weight: 500;
          margin-bottom: 4px;
        }
        .item-date {
          font-size: 11.5px;
          color: #6b7280;
          font-weight: 500;
        }
        .item-desc {
          font-size: 12.5px;
          color: #4b5563;
          white-space: pre-line;
        }
      </style>

      <div class="cv-container modern-layout">
        <!-- Sidebar -->
        <div class="sidebar">
          ${personalInfo.photo ? `
            <div class="photo-container">
              <img src="${personalInfo.photo}" class="profile-photo" alt="Photo" />
            </div>
          ` : ''}

          <div class="sidebar-section">
            <div class="sidebar-title">${t.contact}</div>
            ${personalInfo.email ? `<div class="contact-item">✉ ${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div class="contact-item">📞 ${personalInfo.phone}</div>` : ''}
            ${personalInfo.location ? `<div class="contact-item">📍 ${personalInfo.location}</div>` : ''}
            ${personalInfo.website ? `<div class="contact-item">🌐 ${personalInfo.website}</div>` : ''}
            ${personalInfo.linkedin ? `<div class="contact-item">🔗 ${personalInfo.linkedin}</div>` : ''}
          </div>

          ${skills && skills.length > 0 ? `
            <div class="sidebar-section">
              <div class="sidebar-title">${t.skills}</div>
              ${skills.map(s => `
                <div style="margin-bottom: 8px;">
                  <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 500;">
                    <span>${s.name || ''}</span>
                    <span style="color: #6b7280;">${s.level || ''}</span>
                  </div>
                  <div style="height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; margin-top: 4px;">
                    <div style="height: 100%; background: ${themeColor}; width: ${s.rating ? s.rating * 20 : 80}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
            <div class="header-title">${personalInfo.fullName || 'Your Name'}</div>
            <div class="header-subtitle">${personalInfo.jobTitle || 'Professional Title'}</div>
            ${profile ? `<p style="font-size: 12.5px; color: #4b5563; line-height: 1.6;">${profile}</p>` : ''}
          </div>

          ${experience && experience.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <div class="section-title">${t.experience}</div>
              ${experience.map(e => `
                <div class="exp-item">
                  <div class="item-header">
                    <span>${e.position || ''}</span>
                    <span class="item-date">${e.startDate || ''} - ${e.current ? t.present : (e.endDate || '')}</span>
                  </div>
                  <div class="item-sub">${e.company || ''}</div>
                  ${e.description ? `<div class="item-desc">${e.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${education && education.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <div class="section-title">${t.education}</div>
              ${education.map(ed => `
                <div class="edu-item">
                  <div class="item-header">
                    <span>${ed.degree || ''} ${ed.field ? 'in ' + ed.field : ''}</span>
                    <span class="item-date">${ed.startDate || ''} - ${ed.endDate || ''}</span>
                  </div>
                  <div class="item-sub">${ed.school || ''}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  // 2. PROFESSIONAL TEMPLATE
  else if (template === 'professional') {
    contentHtml = `
      <style>
        ${baseStyles}
        .prof-container { padding: 30px 32px; }
      </style>
      <div class="cv-container prof-container">
        <div style="border-bottom: 3px solid ${themeColor}; padding-bottom: 14px; margin-bottom: 20px;">
          <div style="font-size: 26px; font-weight: 800; color: #0f172a;">${personalInfo.fullName || 'Your Name'}</div>
          <div style="font-size: 16px; color: ${themeColor}; font-weight: 600; margin-top: 4px;">${personalInfo.jobTitle || 'Executive'}</div>
        </div>
        ${profile ? `<p style="font-size: 12.5px; color: #334155; margin-bottom: 16px;">${profile}</p>` : ''}
      </div>
    `;
  }
  // 3. MINIMAL & OTHERS
  else {
    contentHtml = `
      <style>
        ${baseStyles}
        .simple-container { padding: 30px; }
      </style>
      <div class="cv-container simple-container">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 24px; font-weight: 800;">${personalInfo.fullName || 'Your Name'}</div>
          <div style="font-size: 14px; color: ${themeColor};">${personalInfo.jobTitle || 'Professional'}</div>
        </div>
        ${profile ? `<p style="font-size: 12.5px; color: #475569;">${profile}</p>` : ''}
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="${language === 'km' ? 'km' : 'en'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${personalInfo.fullName ? personalInfo.fullName + ' - CV' : 'Curriculum Vitae'}</title>
    </head>
    <body>
      ${contentHtml}
    </body>
    </html>
  `;
};
