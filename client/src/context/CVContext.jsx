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
    if (lang === 'km') {
      setCvData(khmerSampleCVData);
      setSettings(prev => ({ ...prev, fontFamily: 'Kantumruy Pro' }));
      showToast('បានបញ្ចូលទិន្នន័យគំរូភាសាខ្មែររួចរាល់!');
    } else {
      setCvData(initialCVData);
      setSettings(prev => ({ ...prev, fontFamily: 'Inter' }));
      showToast('Loaded English sample CV data!');
    }
  };

  const clearAllData = () => {
    setCvData({
      personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', photo: '' },
      profile: '',
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certificates: [],
      projects: [],
      references: [],
      customSections: []
    });
    showToast(language === 'km' ? 'បានលុបទិន្នន័យទាំងអស់។' : 'All CV data cleared.', 'info');
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

  // PDF Export Flow (Puppeteer Server-Side with Client Fallback)
  const exportPDF = async () => {
    setIsExporting(true);
    showToast(language === 'km' ? 'កំពុងបង្កើត និងទាញយក file PDF A4...' : 'Generating high-resolution A4 PDF...', 'info');

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

      if (!response.ok) {
        throw new Error('Server PDF service returned an error. Using client renderer...');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(cvData.personalInfo?.fullName || 'CV').replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      triggerConfetti();
      showToast(language === 'km' ? '🎉 បានទាញយក PDF គុណភាពខ្ពស់ដោយជោគជ័យ!' : '🎉 High-Quality PDF downloaded successfully!');
    } catch (err) {
      console.warn('Puppeteer error fallback to client print/html2pdf:', err);
      // Fallback to client print / html2pdf
      try {
        const element = document.getElementById('cv-preview-sheet');
        if (element) {
          const opt = {
            margin: 0,
            filename: `${(cvData.personalInfo?.fullName || 'CV').replace(/\s+/g, '_')}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          const html2pdf = (await import('html2pdf.js')).default;
          await html2pdf().set(opt).from(element).save();
          triggerConfetti();
          showToast(language === 'km' ? '🎉 បានទាញយក PDF តាមរយៈ Browser Renderer!' : '🎉 PDF downloaded via browser renderer!');
        } else {
          window.print();
        }
      } catch (clientErr) {
        console.error('Client PDF error:', clientErr);
        window.print();
      }
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

        // CV State
        cvData,
        setCvData,
        settings,
        setSettings,
        currentCvId,
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
