export const SKILL_CATEGORIES = [
  { id: 'all', labelEn: 'All Skills', labelKm: 'ទាំងអស់', icon: '🌟' },
  { id: 'tech', labelEn: '💻 Technical & IT', labelKm: '💻 បច្ចេកវិទ្យា & IT', icon: '💻' },
  { id: 'soft', labelEn: '🧠 Soft Skills', labelKm: '🧠 ជំនាញទន់ (Soft Skills)', icon: '🧠' },
  { id: 'business', labelEn: '💼 Professional & Business', labelKm: '💼 អាជីវកម្ម & វិជ្ជាជីវៈ', icon: '💼' },
  { id: 'practical', labelEn: '🛠️ Practical & Vocational', labelKm: '🛠️ ជំនាញបច្ចេកទេសជាក់ស្តែង', icon: '🛠️' },
  { id: 'creative', labelEn: '🎨 Creative & Media', labelKm: '🎨 ភាពច្នៃប្រឌិត & មេឌា', icon: '🎨' },
  { id: 'languages', labelEn: '🌐 Languages', labelKm: '🌐 ភាសាបរទេស', icon: '🌐' }
];

export const PRESET_SKILLS = [
  // 💻 Technical & IT
  { nameEn: 'JavaScript / TypeScript', nameKm: 'JavaScript / TypeScript', category: 'tech', defaultRating: 5 },
  { nameEn: 'React / Next.js', nameKm: 'React / Next.js', category: 'tech', defaultRating: 5 },
  { nameEn: 'Node.js & Express', nameKm: 'Node.js & Express', category: 'tech', defaultRating: 4 },
  { nameEn: 'Python Programming', nameKm: 'Python Programming', category: 'tech', defaultRating: 4 },
  { nameEn: 'Microsoft Office (Word, Excel, PPT)', nameKm: 'Microsoft Office (Word, Excel, PowerPoint)', category: 'tech', defaultRating: 5 },
  { nameEn: 'Advanced Excel & Data Analysis', nameKm: 'Excel កម្រិតខ្ពស់ & វិភាគទិន្នន័យ', category: 'tech', defaultRating: 4 },
  { nameEn: 'Computer Repair & IT Support', nameKm: 'ជួសជុលកុំព្យូទ័រ & IT Support', category: 'tech', defaultRating: 4 },
  { nameEn: 'Network & System Administration', nameKm: 'គ្រប់គ្រងបណ្តាញ Network & System', category: 'tech', defaultRating: 4 },
  { nameEn: 'Cybersecurity Basics', nameKm: 'សុវត្ថិភាពប្រព័ន្ធ Cyber Security', category: 'tech', defaultRating: 3 },
  { nameEn: 'SQL & Database Management', nameKm: 'គ្រប់គ្រងទិន្នន័យ SQL & Database', category: 'tech', defaultRating: 4 },
  { nameEn: 'Cloud Computing (AWS / Google Cloud)', nameKm: 'Cloud Computing (AWS / GCP)', category: 'tech', defaultRating: 4 },
  { nameEn: 'Mobile App Development (Flutter/React Native)', nameKm: 'បង្កើត App ទូរស័ព្ទ (Flutter/RN)', category: 'tech', defaultRating: 4 },

  // 🧠 Soft Skills
  { nameEn: 'Communication & Presentation', nameKm: 'ទំនាក់ទំនង & ការធ្វើបទបង្ហាញ', category: 'soft', defaultRating: 5 },
  { nameEn: 'Teamwork & Collaboration', nameKm: 'ការធ្វើការងារជាក្រុម (Teamwork)', category: 'soft', defaultRating: 5 },
  { nameEn: 'Leadership & Team Management', nameKm: 'ភាពជាអ្នកដឹកនាំ (Leadership)', category: 'soft', defaultRating: 4 },
  { nameEn: 'Problem Solving & Critical Thinking', nameKm: 'ការដោះស្រាយបញ្ហា (Problem Solving)', category: 'soft', defaultRating: 5 },
  { nameEn: 'Time Management & Organization', nameKm: 'ការគ្រប់គ្រងពេលវេលា (Time Management)', category: 'soft', defaultRating: 5 },
  { nameEn: 'Adaptability & Fast Learning', nameKm: 'ភាពបត់បែន & រៀនសូត្ររហ័ស', category: 'soft', defaultRating: 5 },
  { nameEn: 'Negotiation & Persuasion', nameKm: 'ការចរចា & ការបញ្ចុះបញ្ចូល', category: 'soft', defaultRating: 4 },
  { nameEn: 'Work Under Pressure', nameKm: 'ភាពអត់ធ្មត់ក្រោមសម្ពាធការងារ', category: 'soft', defaultRating: 4 },
  { nameEn: 'Conflict Resolution', nameKm: 'ការដោះស្រាយជម្លោះការងារ', category: 'soft', defaultRating: 4 },

  // 💼 Professional & Business
  { nameEn: 'Sales & Business Development', nameKm: 'ផ្នែកលក់ & ពង្រីកទីផ្សារ (Sales)', category: 'business', defaultRating: 5 },
  { nameEn: 'Digital Marketing & Social Media', nameKm: 'Digital Marketing & គ្រប់គ្រងផេក', category: 'business', defaultRating: 5 },
  { nameEn: 'Accounting & Bookkeeping', nameKm: 'គណនេយ្យ & កត់ត្រាហិរញ្ញវត្ថុ', category: 'business', defaultRating: 4 },
  { nameEn: 'Customer Service & Relations', nameKm: 'សេវាកម្មអតិថិជន (Customer Service)', category: 'business', defaultRating: 5 },
  { nameEn: 'Human Resources (HR) Management', nameKm: 'គ្រប់គ្រងធនធានមនុស្ស (HR)', category: 'business', defaultRating: 4 },
  { nameEn: 'Financial Planning & Tax Filing', nameKm: 'រៀបចំផែនការហិរញ្ញវត្ថុ & ពន្ធដារ', category: 'business', defaultRating: 4 },
  { nameEn: 'Project Management & Agile/Scrum', nameKm: 'គ្រប់គ្រងគម្រោង (Project Management)', category: 'business', defaultRating: 4 },
  { nameEn: 'Supply Chain & Inventory Management', nameKm: 'គ្រប់គ្រងស្តុក & Supply Chain', category: 'business', defaultRating: 4 },
  { nameEn: 'Market Research & Analysis', nameKm: 'ការស្រាវជ្រាវទីផ្សារ', category: 'business', defaultRating: 4 },

  // 🛠️ Practical & Vocational
  { nameEn: 'Driving (Car / Truck / Motorcycle)', nameKm: 'បើកបររថយន្ត / ម៉ូតូ (មានប័ណ្ណបើកបរ)', category: 'practical', defaultRating: 5 },
  { nameEn: 'Electrical Wiring & Installation', nameKm: 'តបណ្តាញអគ្គិសនី & ជួសជុលភ្លើង', category: 'practical', defaultRating: 4 },
  { nameEn: 'Auto / Vehicle Repair & Maintenance', nameKm: 'ជួសជុល និងថែទាំយានយន្ត', category: 'practical', defaultRating: 4 },
  { nameEn: 'Culinary & Professional Cooking', nameKm: 'ធ្វើម្ហូប & សិល្បៈចម្អិនអាហារ (Chef)', category: 'practical', defaultRating: 5 },
  { nameEn: 'Air Conditioning Repair & HVAC', nameKm: 'ជួសជុល និងតម្លើងម៉ាស៊ីនត្រជាក់', category: 'practical', defaultRating: 4 },
  { nameEn: 'Plumbing & Pipe Fitting', nameKm: 'តបណ្តាញទឹក & ជួសជុលទុយោ', category: 'practical', defaultRating: 4 },
  { nameEn: 'Construction & Site Supervision', nameKm: 'ការងារសំណង់ & មើលការខុសត្រូវការដ្ឋាន', category: 'practical', defaultRating: 4 },
  { nameEn: 'Welding & Metal Fabrication', nameKm: 'ផ្សារដែក & កែច្នៃលោហៈ', category: 'practical', defaultRating: 4 },
  { nameEn: 'Barista & Coffee Brewing', nameKm: 'ឆុងកាហ្វេ & Barista ជំនាញ', category: 'practical', defaultRating: 4 },
  { nameEn: 'First Aid & CPR Certified', nameKm: 'សង្គ្រោះបឋម (First Aid / CPR)', category: 'practical', defaultRating: 4 },

  // 🎨 Creative & Media
  { nameEn: 'Graphic Design (Photoshop, Illustrator)', nameKm: 'រចនាក្រាហ្វិក (Photoshop, AI)', category: 'creative', defaultRating: 5 },
  { nameEn: 'Video Editing (Premiere, CapCut, DaVinci)', nameKm: 'កាត់តវីដេអូ (Premiere, CapCut)', category: 'creative', defaultRating: 5 },
  { nameEn: 'Photography & Photo Retouching', nameKm: 'ថតរូប & កែច្នៃរូបភាពអាជីព', category: 'creative', defaultRating: 4 },
  { nameEn: 'UI/UX Design & Figma', nameKm: 'រចនា UI/UX & Figma', category: 'creative', defaultRating: 5 },
  { nameEn: 'Content Creation & Copywriting', nameKm: 'សរសេរមាតិកា (Content Creation)', category: 'creative', defaultRating: 5 },
  { nameEn: 'Motion Graphics & Animation', nameKm: 'Motion Graphics & គំនូរជីវចល', category: 'creative', defaultRating: 4 },
  { nameEn: 'Canva Pro Design', nameKm: 'រចនាជាមួយ Canva Pro', category: 'creative', defaultRating: 5 },
  { nameEn: 'Voiceover & Audio Production', nameKm: 'បញ្ចូលសំឡេង & ផលិត Audio', category: 'creative', defaultRating: 4 },

  // 🌐 Languages
  { nameEn: 'Khmer (Native / Fluent)', nameKm: 'ភាសាខ្មែរ (ស្ទាត់ជំនាញ)', category: 'languages', defaultRating: 5 },
  { nameEn: 'English (Professional / Business)', nameKm: 'ភាសាអង់គ្លេស (ទំនាក់ទំនងការងារ)', category: 'languages', defaultRating: 5 },
  { nameEn: 'Chinese (Mandarin / Speaking)', nameKm: 'ភាសាចិន (កុកងឺ / សន្ទនា)', category: 'languages', defaultRating: 4 },
  { nameEn: 'Thai Language', nameKm: 'ភាសៃថៃ (សន្ទនា & ការងារ)', category: 'languages', defaultRating: 4 },
  { nameEn: 'Vietnamese Language', nameKm: 'ភាសាវៀតណាម', category: 'languages', defaultRating: 3 },
  { nameEn: 'French Language', nameKm: 'ភាសាបារាំង', category: 'languages', defaultRating: 3 },
  { nameEn: 'Japanese Language', nameKm: 'ភាសាជប៉ុន (N3/N2)', category: 'languages', defaultRating: 3 },
  { nameEn: 'Korean Language', nameKm: 'ភាសាកូរ៉េ (TOPIK)', category: 'languages', defaultRating: 3 }
];
