# Tool_CV — Modern Fullstack CV & Resume Builder Platform 🚀

**Tool_CV** គឺជាកម្មវិធី Web Application ទំនើបសម្រាប់បង្កើត, កែសម្រួល, និងទាញយកប្រវត្តិរូបសង្ខេប (CV / Resume) ដែលមានលក្ខណៈពិសេសកម្រិតខ្ពស់ និងរចនាឡើងជាមួយបច្ចេកវិទ្យាទំនើបចុងក្រោយ។

---

## 🌟 លក្ខណៈពិសេសសំខាន់ៗ (Key Features)

### 1. 👤 User Management & Cloud Sync
- **Register / Login / Logout:** ប្រព័ន្ធសុវត្ថិភាពជាមួយ JSON Web Tokens (JWT) & bcryptjs hashing
- **User Profile:** គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងរូបថតតំណាង (Avatar)
- **Cloud Saved CVs:** អាច Save CV ទុកក្នុង Cloud បានច្រើនទម្រង់ និងអាចបើក ឬកែសម្រួលបានគ្រប់ពេល

### 2. 📝 Full Multi-Section CV Builder
- **Personal Information:** ឈ្មោះ, តួនាទី, Email, លេខទូរស័ព្ទ, អាសយដ្ឋាន, Website, LinkedIn, GitHub និង Upload រូបថត
- **Profile / About Me:** សេចក្តីសង្ខេបពីខ្លួនឯង ជាមួយ Smart Prompt Suggestions (1-Click Fill)
- **Work Experience:** បន្ថែម/កែសម្រួលបទពិសោធន៍ការងារ, ក្រុមហ៊ុន, កាលបរិច្ឆេទ, និងចំណុចសមិទ្ធផល
- **Education:** បរិញ្ញាបត្រ/សញ្ញាបត្រ, សាកលវិទ្យាល័យ, ជំនាញ, ពិន្ទុ GPA
- **Skills & Competencies:** បញ្ជីជំនាញបច្ចេកទេស ជាមួយកម្រិតស្ទាត់ជំនាញ (Star / Rating Slider)
- **Languages:** ភាសាដែលចេះ និងកម្រិតស្ទាត់ជំនាញ (Native, Fluent, Intermediate)
- **Certificates:** វិញ្ញាបនបត្រ និង License
- **Projects:** គម្រោងសំខាន់ៗ (Tech Stack, Demo Link, Github)
- **References:** អ្នកធានា ឬអ្នកផ្តល់អនុសាសន៍ការងារ

### 3. 🎨 5 Premium CV Templates
1. **Modern:** ម៉ូត 2 ជួរឈរ (2-column layout) ជាមួយ Sidebar ពណ៌ស្រស់ស្អាត និង Timeline
2. **Professional:** ម៉ូតផ្លូវការបែប Corporate Executive ជាមួយបន្ទាត់ខណ្ឌច្បាស់លាស់
3. **Minimal:** ម៉ូតស្អាត សាមញ្ញ ផ្តោតលើ Whitespace និងភាពច្បាស់នៃអក្សរ
4. **Creative:** ម៉ូត Banner ពណ៌ Gradient ទំនើប ជាមួយទម្រង់ Skill Badges
5. **Simple:** ម៉ូតស្ដង់ដារ ATS Clean Layout ងាយស្រួលអានបំផុតសម្រាប់ HR

### 4. 🛠️ Interactive CV Customizer & Section Manager
- **Accent Theme Colors:** អាចរើសពណ៌ Preset (Royal Blue, Emerald, Indigo, Crimson, Amber, Slate) ឬជ្រើសរើស Hex Color ដោយខ្លួនឯង
- **Typography & Font Family:** គាំទ្រ Google Fonts ទំនើប (Inter, Outfit, Poppins, Roboto, Merriweather) រួមទាំង Font ខ្មែរ (**Kantumruy Pro, Battambang**)
- **Font Scaling:** អាចប្តូរទំហំអក្សរ (Small, Medium, Large)
- **Add / Remove Sections:** អាចបើក (Show) ឬបិទ (Hide) ផ្នែកណាមួយដែលមិនត្រូវការបានយ៉ាងងាយ

### 5. ⚡ Real-Time Live Synchronized A4 Preview
- រាល់ការវាយបញ្ចូលក្នុង Form នឹងបង្ហាញលទ្ធផលលើទំព័រ A4 ភ្លាមៗ (Instant Live Sync)
- **Zoom Controls:** ពង្រីក និងបង្រួមទំព័រ A4 បានពី 40% ដល់ 150%
- **Fullscreen Mode:** មើល CV ពេញអេក្រង់
- **Browser Print:** បោះពុម្ពភ្លាមៗ

### 6. 📄 Server-Side Puppeteer PDF Engine
- ដំណើរការ PDF Rendering តាមរយៈ Headless Chromium (Puppeteer) គុណភាព 100% Vector A4 Pixel-Perfect
- មានប្រព័ន្ធ Client-Side PDF Generator ជាជំនួយការបម្រុង (Fallback)

---

## 🏗️ រចនាសម្ព័ន្ធ Folder (Project Structure)

```text
Tool_CV/
├── server/                     # Backend API & Puppeteer Service (Node.js/Express)
│   ├── src/
│   │   ├── middleware/         # JWT Auth Middleware
│   │   ├── routes/             # Auth, CV CRUD, PDF Export Endpoints
│   │   ├── utils/              # Standalone HTML Template Generator
│   │   ├── db.js               # Persistent JSON/SQLite Data Store
│   │   └── server.js           # Server Entry Point (Port 5000)
│   └── package.json
│
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CVEditor/       # Form Fields & Section Editors
│   │   │   ├── CVPreview/      # Live A4 Canvas & Zoom Controls
│   │   │   ├── Templates/      # Modern, Professional, Minimal, Creative, Simple
│   │   │   ├── AuthModal.jsx   # Login & Register Modal
│   │   │   ├── ProfileModal.jsx# Account Settings & Cloud CV Manager
│   │   │   └── Navbar.jsx      # Top Navigation Bar
│   │   ├── context/            # Global CV Store & Auth Context
│   │   ├── data/               # Default Sample Data & Constants
│   │   ├── App.jsx             # Main Application Layout
│   │   └── main.jsx
│   └── package.json
│
└── package.json                # Root Concurrently Orchestrator
```

---

## 🚀 របៀបតម្លើង និងដំណើរការ (Getting Started)

### ១. ដំឡើង Dependencies
ដំណើរការ command ខាងក្រោមក្នុង Root Directory:
```bash
npm run install:all
```

### ២. ចាប់ផ្តើមដំណើរការទាំង Client និង Server (Development Mode)
```bash
npm run dev
```

* **Frontend (Client):** `http://localhost:3000`
* **Backend (API & PDF Engine):** `http://localhost:5000`
