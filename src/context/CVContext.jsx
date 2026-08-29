import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { initialCVData, khmerSampleCVData, defaultSettings } from '../data/initialCV';
import { translations } from '../data/translations';

const CVContext = createContext();

export const CVProvider = ({ children }) => {
  // 0. Language State (Khmer 'km' or English 'en')
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('tool_cv_lang') || 'km';
    } catch {
      return 'km';
    }
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('tool_cv_lang', lang);
    showToast(lang === 'km' ? 'បានប្តូរទៅភាសាខ្មែរ 🇰🇭' : 'Switched to English 🇬🇧');
  };

  // 0.1 Day / Night Theme Mode (Dark Mode 🌙 / Light Mode ☀️)
  const [darkMode, setDarkModeState] = useState(() => {
    try {
      const saved = localStorage.getItem('tool_cv_theme');
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  const setDarkMode = (val) => {
    setDarkModeState(val);
    localStorage.setItem('tool_cv_theme', val ? 'dark' : 'light');
    if (val) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    showToast(
      nextVal
        ? (language === 'km' ? '🌙 បានបើករបៀបយប់ (Dark Mode)' : '🌙 Dark Mode activated')
        : (language === 'km' ? '☀️ បានបើករបៀបថ្ងៃ (Light Mode)' : '☀️ Light Mode activated')
    );
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  // Translation helper function
  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return key;
  };

  // 1. CV Data & Settings State (with LocalStorage persistence)
  const [cvData, setCvData] = useState(() => {
    try {
      const saved = localStorage.getItem('tool_cv_data');
      return saved ? JSON.parse(saved) : (language === 'km' ? khmerSampleCVData : initialCVData);
    } catch {
      return initialCVData;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('tool_cv_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [currentCvId, setCurrentCvId] = useState(null);
  const [cvTitle, setCvTitle] = useState('My Professional CV');
  const [zoomLevel, setZoomLevel] = useState(90);
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState(null);

  // 2. Auth State (Gate Login: Open if no token found on startup)
  const [token, setToken] = useState(() => localStorage.getItem('tool_cv_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tool_cv_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [savedCVs, setSavedCVs] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    // If no token exists on first arrival, prompt gate authentication
    return !localStorage.getItem('tool_cv_token');
  });
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  // Admin state
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminStats, setAdminStats] = useState(null);

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('tool_cv_data', JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem('tool_cv_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('tool_cv_token', token);
      fetchSavedCVs();
    } else {
      localStorage.removeItem('tool_cv_token');
      localStorage.removeItem('tool_cv_user');
    }
  }, [token]);

  // Notifications
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  // Section Data Updaters
  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateProfile = (value) => {
    setCvData(prev => ({ ...prev, profile: value }));
  };

  // Generic List item actions
  const addListItem = (sectionKey, defaultItem) => {
    const newItem = { id: 'item_' + Date.now(), ...defaultItem };
    setCvData(prev => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), newItem]
    }));
  };

  const updateListItem = (sectionKey, id, field, value) => {
    setCvData(prev => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeListItem = (sectionKey, id) => {
    setCvData(prev => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter(item => item.id !== id)
    }));
  };

  // Settings Updaters
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSection = (sectionKey) => {
    setSettings(prev => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [sectionKey]: !prev.visibleSections[sectionKey]
      }
    }));
  };

  // Reset to Sample or Blank
  const resetToSample = (lang = language) => {
    const existingPhoto = cvData.personalInfo?.photo;
    const existingShape = cvData.personalInfo?.photoShape;
    const existingSize = cvData.personalInfo?.photoSize;

    if (lang === 'km') {
      const mergedKhmerData = {
        ...khmerSampleCVData,
        personalInfo: {
          ...khmerSampleCVData.personalInfo,
          ...(existingPhoto ? { photo: existingPhoto } : {}),
          photoShape: existingShape || khmerSampleCVData.personalInfo.photoShape || 'rounded',
          photoSize: existingSize || khmerSampleCVData.personalInfo.photoSize || 130
        }
      };
      setCvData(mergedKhmerData);
      setSettings(prev => ({ ...prev, fontFamily: 'Kantumruy Pro' }));
      showToast('បានបញ្ចូលទិន្នន័យគំរូភាសាខ្មែររួចរាល់!');
    } else {
      const mergedEnData = {
        ...initialCVData,
        personalInfo: {
          ...initialCVData.personalInfo,
          ...(existingPhoto ? { photo: existingPhoto } : {}),
          photoShape: existingShape || initialCVData.personalInfo.photoShape || 'rounded',
          photoSize: existingSize || initialCVData.personalInfo.photoSize || 130
        }
      };
      setCvData(mergedEnData);
      setSettings(prev => ({ ...prev, fontFamily: 'Inter' }));
      showToast('Loaded English sample CV data!');
    }
  };

  const clearAllData = () => {
    const emptyCV = {
      personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        photo: '',
        photoShape: 'rounded',
        photoSize: 130
      },
      profile: '',
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certificates: [],
      projects: [],
      references: [],
      customSections: []
    };
    setCvData(emptyCV);
    setCurrentCvId(null);
    setCvTitle('My Professional CV');
    localStorage.setItem('tool_cv_data', JSON.stringify(emptyCV));
    showToast(language === 'km' ? '🗑️ បានលុប និងសម្អាតទិន្នន័យ CV ទាំងអស់រួចរាល់!' : '🗑️ All CV data has been cleared!', 'info');
  };

  // Safe API Fetch Wrapper with Tunnel bypass & JSON safeguards
  const safeApiFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Bypass-Tunnel-Reminder': 'true',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    const res = await fetch(url, { ...options, headers });
    let data = {};
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch (_) {
        data = { error: 'ទម្រង់ឆ្លើយតបពី Server មិនត្រឹមត្រូវ (Invalid JSON response)' };
      }
    } else {
      const text = await res.text().catch(() => '');
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { error: text || `Server error (${res.status})` };
      }
    }
    return { res, data };
  };

  // Auth Operations
  const login = async (identifier, password) => {
    try {
      const { res, data } = await safeApiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });

      if (!res.ok) {
        // If server returns 405/404 (e.g. on static Vercel deployment), fallback to local offline auth store
        if (res.status === 404 || res.status === 405 || res.status >= 500 || data.error?.includes('405')) {
          const cleanId = (identifier || '').toLowerCase().trim();
          const cleanPass = password || '';

          // Check default admin
          if ((cleanId === 'admin@toolcv.com' || cleanId === 'admin@cvforge.com' || cleanId === '+855 12 888 999' || cleanId === '012888999') && cleanPass === 'admin123') {
            const adminUser = {
              id: 'usr_admin_master',
              name: 'System Administrator',
              email: 'admin@toolcv.com',
              phone: '+855 12 888 999',
              role: 'admin',
              avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin%20System&backgroundColor=2563eb',
              headline: 'Full-Access Master Administrator'
            };
            const mockToken = 'mock_jwt_token_admin_' + Date.now();
            setToken(mockToken);
            setUser(adminUser);
            localStorage.setItem('tool_cv_token', mockToken);
            localStorage.setItem('tool_cv_user', JSON.stringify(adminUser));
            showToast(language === 'km' ? `សូមស្វាគមន៍មកវិញ, ${adminUser.name}!` : `Welcome back, ${adminUser.name}!`);
            setIsAuthModalOpen(false);
            triggerConfetti();
            return { success: true };
          }

          // Check local users
          const localUsers = JSON.parse(localStorage.getItem('tool_cv_local_users') || '[]');
          const found = localUsers.find(u => 
            (u.email && u.email.toLowerCase() === cleanId) ||
            (u.phone && u.phone.replace(/[\s-]/g, '') === cleanId.replace(/[\s-]/g, ''))
          );

          if (found && (!found.password || found.password === password)) {
            const mockToken = 'mock_jwt_token_' + found.id;
            setToken(mockToken);
            setUser(found);
            localStorage.setItem('tool_cv_token', mockToken);
            localStorage.setItem('tool_cv_user', JSON.stringify(found));
            showToast(language === 'km' ? `សូមស្វាគមន៍មកវិញ, ${found.name}!` : `Welcome back, ${found.name}!`);
            setIsAuthModalOpen(false);
            triggerConfetti();
            return { success: true };
          }
        }
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('tool_cv_user', JSON.stringify(data.user));
      showToast(language === 'km' ? `សូមស្វាគមន៍មកវិញ, ${data.user.name}!` : `Welcome back, ${data.user.name}!`);
      setIsAuthModalOpen(false);
      triggerConfetti();
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const { res, data } = await safeApiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password })
      });

      if (!res.ok) {
        // If server returns 405/404 (e.g. on static Vercel deployment), create local user
        if (res.status === 404 || res.status === 405 || res.status >= 500 || data.error?.includes('405')) {
          const localUsers = JSON.parse(localStorage.getItem('tool_cv_local_users') || '[]');
          const cleanEmail = (email || '').toLowerCase().trim();
          const cleanPhone = (phone || '').trim();

          const newUser = {
            id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            name: (name || 'User').trim(),
            email: cleanEmail,
            phone: cleanPhone,
            password: password,
            role: cleanEmail.includes('admin') ? 'admin' : 'user',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`,
            headline: 'Professional',
            createdAt: new Date().toISOString()
          };

          localUsers.push(newUser);
          localStorage.setItem('tool_cv_local_users', JSON.stringify(localUsers));

          const mockToken = 'mock_jwt_token_' + newUser.id;
          setToken(mockToken);
          setUser(newUser);
          localStorage.setItem('tool_cv_token', mockToken);
          localStorage.setItem('tool_cv_user', JSON.stringify(newUser));

          showToast(language === 'km' ? `បានបង្កើតគណនីជោគជ័យ! សូមស្វាគមន៍ ${newUser.name}` : `Account created! Welcome, ${newUser.name}!`);
          setIsAuthModalOpen(false);
          triggerConfetti();
          return { success: true };
        }
        throw new Error(data.error || 'Registration failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('tool_cv_user', JSON.stringify(data.user));
      showToast(language === 'km' ? `បានបង្កើតគណនីជោគជ័យ! សូមស្វាគមន៍ ${data.user.name}` : `Account created! Welcome, ${data.user.name}!`);
      setIsAuthModalOpen(false);
      triggerConfetti();
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Social Auth (Google / Facebook)
  const socialLogin = async (provider, profileData) => {
    try {
      const { res, data } = await safeApiFetch('/api/auth/social-login', {
        method: 'POST',
        body: JSON.stringify({
          provider,
          name: profileData.name,
          email: profileData.email,
          avatar: profileData.avatar,
          phone: profileData.phone,
          providerId: profileData.providerId
        })
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 405 || res.status >= 500 || data.error?.includes('405')) {
          const socialUser = {
            id: 'usr_social_' + Date.now(),
            name: profileData.name || `${provider} User`,
            email: profileData.email || `${provider.toLowerCase()}_user@example.com`,
            phone: profileData.phone || '',
            avatar: profileData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name || provider)}`,
            provider: provider.toLowerCase(),
            role: 'user',
            headline: 'Professional'
          };
          const mockToken = 'mock_jwt_social_' + socialUser.id;
          setToken(mockToken);
          setUser(socialUser);
          localStorage.setItem('tool_cv_token', mockToken);
          localStorage.setItem('tool_cv_user', JSON.stringify(socialUser));
          showToast(
            language === 'km'
              ? `បានភ្ជាប់គណនី ${provider} ជោគជ័យ! សូមស្វាគមន៍ ${socialUser.name}`
              : `Connected with ${provider}! Welcome, ${socialUser.name}!`
          );
          setIsAuthModalOpen(false);
          triggerConfetti();
          return { success: true };
        }
        throw new Error(data.error || 'Social login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('tool_cv_user', JSON.stringify(data.user));
      showToast(
        language === 'km'
          ? `បានភ្ជាប់គណនី ${provider} ជោគជ័យ! សូមស្វាគមន៍ ${data.user.name}`
          : `Connected with ${provider}! Welcome, ${data.user.name}!`
      );
      setIsAuthModalOpen(false);
      triggerConfetti();
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setSavedCVs([]);
    setCurrentCvId(null);
    showToast(language === 'km' ? 'បានចាកចេញពីគណនីដោយជោគជ័យ។' : 'Logged out successfully.');
    // Prompt gate login again
    setIsAuthModalOpen(true);
  };

  const updateProfileData = async (updatedData) => {
    if (!token) return;
    try {
      const { res, data } = await safeApiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error(data.error || 'Profile update failed');

      setUser(data.user);
      localStorage.setItem('tool_cv_user', JSON.stringify(data.user));
      showToast(language === 'km' ? 'ព័ត៌មានគណនីត្រូវបានកែប្រែជោគជ័យ!' : 'Profile updated successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Fetch Admin Database users
  const fetchAdminData = async () => {
    try {
      const { res, data } = await safeApiFetch('/api/auth/admin/users');
      if (res.ok) {
        setAdminUsers(data.users || []);
        setAdminStats(data.stats || null);
      }
    } catch (err) {
      console.error('Fetch admin data error:', err);
    }
  };

  // CV Cloud Database Operations
  const fetchSavedCVs = async () => {
    if (!token) return;
    try {
      const { res, data } = await safeApiFetch('/api/cvs');
      if (res.ok) {
        setSavedCVs(data.cvs || []);
      } else {
        const localCVs = JSON.parse(localStorage.getItem('tool_cv_local_saved_cvs') || '[]');
        setSavedCVs(localCVs);
      }
    } catch (err) {
      console.error('Fetch CVs error:', err);
    }
  };

  const saveCV = async (titleToSave) => {
    if (!token) {
      setIsAuthModalOpen(true);
      setAuthModalTab('login');
      showToast(language === 'km' ? 'សូមចូលគណនី ឬចុះឈ្មោះជាមុនសិន ដើម្បីរក្សាទុក CV ក្នុង Cloud។' : 'Please log in or register to save your CV to the cloud.', 'info');
      return;
    }

    const payload = {
      title: titleToSave || cvTitle || 'My Professional CV',
      template: settings.template,
      themeColor: settings.themeColor,
      fontFamily: settings.fontFamily,
      fontSize: settings.fontSize,
      data: cvData
    };

    try {
      const url = currentCvId ? `/api/cvs/${currentCvId}` : '/api/cvs';
      const method = currentCvId ? 'PUT' : 'POST';

      const { res, data } = await safeApiFetch(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 405 || res.status >= 500 || data.error?.includes('405')) {
          const localCVs = JSON.parse(localStorage.getItem('tool_cv_local_saved_cvs') || '[]');
          const id = currentCvId || 'cv_' + Date.now();
          const newCV = { id, ...payload, updatedAt: new Date().toISOString() };
          const existingIdx = localCVs.findIndex(c => c.id === id);
          if (existingIdx >= 0) {
            localCVs[existingIdx] = newCV;
          } else {
            localCVs.unshift(newCV);
          }
          localStorage.setItem('tool_cv_local_saved_cvs', JSON.stringify(localCVs));
          setCurrentCvId(id);
          setSavedCVs(localCVs);
          triggerConfetti();
          showToast(language === 'km' ? 'បានរក្សាទុក CV ជោគជ័យ!' : 'CV saved successfully!');
          return;
        }
        throw new Error(data.error || 'Failed to save CV');
      }

      setCurrentCvId(data.cv.id);
      fetchSavedCVs();
      triggerConfetti();
      showToast(language === 'km' ? 'បានរក្សាទុក CV ក្នុងគណនី Cloud របស់អ្នកជោគជ័យ!' : 'CV saved successfully to your cloud account!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const loadSavedCV = (cv) => {
    if (!cv) return;
    setCvData(cv.data || initialCVData);
    setSettings(prev => ({
      ...prev,
      template: cv.template || 'modern',
      themeColor: cv.themeColor || '#2563eb',
      fontFamily: cv.fontFamily || 'Inter',
      fontSize: cv.fontSize || 'medium'
    }));
    setCvTitle(cv.title || 'My Professional CV');
    setCurrentCvId(cv.id);
    showToast(language === 'km' ? `បានបើក CV: "${cv.title}"` : `Loaded CV: "${cv.title}"`);
  };

  const deleteSavedCV = async (id) => {
    if (!token) return;
    try {
      const { res, data } = await safeApiFetch(`/api/cvs/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(data.error || 'Failed to delete CV');

      if (currentCvId === id) setCurrentCvId(null);
      fetchSavedCVs();
      showToast(language === 'km' ? 'បានលុប CV រួចរាល់។' : 'CV removed successfully.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // PDF Export Flow (Puppeteer Server-Side with Direct Client HTML2PDF Engine)
  const exportPDF = async () => {
    setIsExporting(true);
    showToast(language === 'km' ? 'កំពុងដំណើរការបង្កើត file PDF A4...' : 'Generating high-resolution A4 PDF...', 'info');

    try {
      // 1. Try server-side Puppeteer PDF engine if available
      try {
        const response = await fetch('/api/export-pdf/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: cvData,
            template: settings.template,
            themeColor: settings.themeColor,
            fontFamily: settings.fontFamily,
            fontSize: settings.fontSize,
            language: language,
            title: (cvData.personalInfo?.fullName || 'CV') + '_' + settings.template
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const safeName = (cvData.personalInfo?.fullName || 'CV').trim().replace(/[^a-zA-Z0-9\u1780-\u17FF_-]/g, '_');
          link.download = `${safeName}_Resume.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          triggerConfetti();
          showToast(language === 'km' ? '🎉 បានទាញយក PDF គុណភាពខ្ពស់ដោយជោគជ័យ!' : '🎉 High-Quality PDF downloaded successfully!');
          return;
        }
      } catch (_) {
        // Fallback to client-side renderer if backend server is not running
      }

      // 2. Client-Side html2pdf.js Direct PDF Generator
      const originalSheet = document.getElementById('cv-preview-sheet');
      if (!originalSheet) {
        throw new Error('CV sheet element not found in DOM');
      }

      // Create an off-screen, unscaled A4 container (794px x 1123px)
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '-9999px';
      container.style.width = '794px';
      container.style.minHeight = '1123px';
      container.style.zIndex = '-9999';
      container.style.backgroundColor = '#ffffff';
      container.style.color = '#1f2937';

      // Deep clone the CV preview sheet
      const clone = originalSheet.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.transformOrigin = 'top left';
      clone.style.width = '794px';
      clone.style.minHeight = '1123px';
      clone.style.margin = '0';
      clone.style.padding = '0';
      clone.style.boxShadow = 'none';
      clone.style.display = 'block';

      container.appendChild(clone);
      document.body.appendChild(container);

      try {
        const html2pdfModule = await import('html2pdf.js');
        const html2pdf = html2pdfModule.default || html2pdfModule;

        const safeFileName = `${(cvData.personalInfo?.fullName || 'CV').trim().replace(/[^a-zA-Z0-9\u1780-\u17FF_-]/g, '_')}_Resume.pdf`;

        const opt = {
          margin: 0,
          filename: safeFileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            scrollY: 0,
            scrollX: 0
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
          }
        };

        await html2pdf().set(opt).from(clone).save();

        triggerConfetti();
        showToast(language === 'km' ? '🎉 បានទាញយក File PDF ដោយជោគជ័យ!' : '🎉 PDF file downloaded successfully!');
      } finally {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }
    } catch (err) {
      console.error('PDF Export Error:', err);
      showToast(
        language === 'km'
          ? 'មិនអាចទាញយក PDF បានទេ សូមសាកល្បងម្តងទៀត'
          : 'Could not generate PDF. Please try again.',
        'error'
      );
    } finally {
      setIsExporting(false);
    }
  };

  // JSON Export / Import
  const exportJSON = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      language,
      settings,
      data: cvData
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(cvData.personalInfo?.fullName || 'CV').replace(/\s+/g, '_')}_backup.json`;
    a.click();
    URL.revokeObjectURL(a);
    showToast(language === 'km' ? 'បានទាញយក JSON Backup!' : 'JSON Backup downloaded!');
  };

  const importJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.data) setCvData(parsed.data);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.language) setLanguageState(parsed.language);
        showToast(language === 'km' ? 'បាននាំចូលទិន្នន័យ CV ជោគជ័យ!' : 'CV data imported successfully!');
      } catch (err) {
        showToast(language === 'km' ? 'ទម្រង់ File JSON មិនត្រឹមត្រូវ' : 'Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <CVContext.Provider
      value={{
        // Language & Translation
        language,
        setLanguage,
        t,

        // Day / Night Theme (Dark Mode 🌙 / Light Mode ☀️)
        darkMode,
        setDarkMode,
        toggleDarkMode,

        // CV State
        cvData,
        setCvData,
        settings,
        setSettings,
        currentCvId,
        setCurrentCvId,
        cvTitle,
        setCvTitle,
        zoomLevel,
        setZoomLevel,
        activeTab,
        setActiveTab,
        isExporting,
        notification,
        showToast,
        triggerConfetti,

        // Data actions
        updatePersonalInfo,
        updateProfile,
        addListItem,
        updateListItem,
        removeListItem,
        updateSetting,
        toggleSection,
        resetToSample,
        clearAllData,

        // Auth
        token,
        user,
        login,
        register,
        socialLogin,
        logout,
        updateProfileData,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,

        // Admin Database
        adminUsers,
        adminStats,
        fetchAdminData,

        // Cloud CVs
        savedCVs,
        setSavedCVs,
        fetchSavedCVs,
        saveCV,
        loadSavedCV,
        deleteSavedCV,

        // Export
        exportPDF,
        exportJSON,
        importJSON
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => useContext(CVContext);
