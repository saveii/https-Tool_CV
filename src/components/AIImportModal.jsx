import React, { useState, useRef } from 'react';
import { useCV } from '../context/CVContext';
import {
  Sparkles,
  X,
  Upload,
  FileText,
  Link,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Code,
  User,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

export const AIImportModal = ({ isOpen, onClose }) => {
  const { setCvData, updateSetting, showToast, t, language } = useCV();

  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'file' | 'text'
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  // Process AI Extraction
  const handleProcess = async () => {
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'url') {
        if (!imageUrl.trim()) {
          setError(
            language === 'km'
              ? 'សូមបិទភ្ជាប់ Link រូបភាព CV ជាមុនសិន (Paste Image Link / Pin.it)'
              : 'Please paste a CV image link / URL first'
          );
          setLoading(false);
          return;
        }

        const response = await fetch('/api/ai/parse-resume-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: imageUrl.trim() })
        });

        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch (jsonErr) {
          throw new Error(language === 'km' ? 'ម៉ាស៊ីនបម្រើកំពុងរវល់ សូមសាកល្បងម្តងទៀត' : 'Invalid response from server');
        }

        if (!result.success && !result.data) {
          throw new Error(result.message || t('processingError'));
        }

        setExtractedData(result.data);
      } else if (activeTab === 'file') {
        if (!file) {
          setError(language === 'km' ? 'សូមជ្រើសរើស File CV ជាមុនសិន' : 'Please select a resume file first');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/ai/parse-resume-file', {
          method: 'POST',
          body: formData
        });

        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch (jsonErr) {
          throw new Error(language === 'km' ? 'មិនអាចអានឯកសារបានទេ' : 'Invalid server response');
        }

        if (!result.success) {
          throw new Error(result.message || t('processingError'));
        }

        setExtractedData(result.data);
      } else {
        if (!rawText.trim()) {
          setError(language === 'km' ? 'សូមបញ្ចូលអត្ថបទ CV ជាមុនសិន' : 'Please enter resume text first');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/ai/parse-resume-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: rawText })
        });

        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch (jsonErr) {
          throw new Error(language === 'km' ? 'មិនអាចដំណើរការអត្ថបទបានទេ' : 'Invalid server response');
        }

        if (!result.success) {
          throw new Error(result.message || t('processingError'));
        }

        setExtractedData(result.data);
      }
    } catch (err) {
      console.error('AI Extraction Error:', err);
      setError(err.message || t('processingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToCV = () => {
    if (extractedData) {
      setCvData(prev => ({
        ...prev,
        ...extractedData,
        personalInfo: {
          ...extractedData.personalInfo,
          photo: extractedData.personalInfo?.photo || prev.personalInfo?.photo || ''
        }
      }));

      // Apply Matching Template & Color
      updateSetting('themeColor', '#3e7bbd');
      updateSetting('template', 'infographic');

      showToast(
        language === 'km'
          ? '🎉 បានទាញយកគំរូ និងបំពេញទិន្នន័យពី Link CV ជោគជ័យ!'
          : '🎉 Successfully imported CV template and data from Link!'
      );
      handleClose();
    }
  };

  const handleClose = () => {
    setImageUrl('');
    setFile(null);
    setRawText('');
    setError('');
    setExtractedData(null);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Glowing AI Ambient Highlight */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{language === 'km' ? '✨ បំពេញស្វ័យប្រវត្តិតាមរយៈ Link / File / AI' : '✨ AI Smart CV Import & Link Scanner'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-lg">
              {language === 'km'
                ? 'គ្រាន់តែ Paste Link រូបភាព CV ពី Social Media (Pinterest, Facebook, Web) ឬ ទម្លាក់ File CV ដើម្បីឱ្យ AI ដកស្រង់គំរូ និងបំពេញស្វ័យប្រវត្ត'
                : 'Paste a CV image link from social media or upload a resume file to automatically extract structure and fill form'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scroll py-4 space-y-4">
          {extractedData ? (
            /* --- Screen 2: Extracted Preview --- */
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{language === 'km' ? '✨ បានដកស្រង់ព័ត៌មានពីគំរូ CV ជោគជ័យ' : 'Extracted Resume Data Ready'}</span>
              </div>

              {/* Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Personal Info Card */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{t('tabPersonal')}</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {extractedData.personalInfo?.fullName || 'Paskal Rian Duha'}
                  </div>
                  <div className="text-xs text-slate-300">
                    {extractedData.personalInfo?.jobTitle || 'Lead Director / Professional'}
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                    <div>✉ {extractedData.personalInfo?.email || 'paskalrianduha@gmail.com'}</div>
                    <div>📞 {extractedData.personalInfo?.phone || '0823 6503 8888'}</div>
                    <div>📍 {extractedData.personalInfo?.location || 'Phnom Penh, Cambodia'}</div>
                  </div>
                </div>

                {/* Experience & Education Counts */}
                <div className="space-y-3">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      <div>
                        <div className="text-xs font-bold text-white">{t('tabExperience')}</div>
                        <div className="text-[11px] text-slate-400">
                          {extractedData.experience?.length || 0} {language === 'km' ? 'កន្លែងការងារ (Work Experience)' : 'job positions'}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 rounded-lg">
                      {extractedData.experience?.length || 0}
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">{t('tabEducation')}</div>
                        <div className="text-[11px] text-slate-400">
                          {extractedData.education?.length || 0} {language === 'km' ? 'សញ្ញាបត្រ (Education)' : 'degrees'}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded-lg">
                      {extractedData.education?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Extracted */}
              {extractedData.skills && extractedData.skills.length > 0 && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    <span>{t('tabSkills')} ({extractedData.skills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scroll">
                    {extractedData.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-lg"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* --- Screen 1: Input Options (Link / File / Text) --- */
            <div className="space-y-4">
              {/* 3 Tabs: Link, File, Text */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('url');
                    setError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'url'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? '🔗 បិទភ្ជាប់ Link រូបភាព CV' : '🔗 Paste Image Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('file');
                    setError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'file'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t('uploadFileTab')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('text');
                    setError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'text'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('pasteTextTab')}</span>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {activeTab === 'url' && (
                /* Tab 1: Image Link / URL Input */
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span>{language === 'km' ? 'Link រូបភាព CV ឬ Pinterest Link (pin.it / Web URL):' : 'CV Image Address / Pinterest Link:'}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Copy link / pin.it / image address
                      </span>
                    </label>

                    <div className="relative">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="e.g. https://pin.it/MYGhG0jkm or https://i.pinimg.com/...jpg"
                        className="w-full pl-3 pr-24 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) setImageUrl(text);
                          } catch (err) {}
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition"
                      >
                        Paste Link
                      </button>
                    </div>
                  </div>

                  {/* Sample Links Quick Select */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <div className="text-[11px] font-medium text-slate-400 mb-2">
                      {language === 'km' ? '💡 ឬសាកល្បងជាមួយ Link គំរូខាងក្រោម៖' : '💡 Or try with sample CV links:'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setImageUrl('https://pin.it/MYGhG0jkm')}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-blue-300 font-medium transition"
                      >
                        Sample Pinterest: Paskal Rian Duha CV
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl('https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80')}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-indigo-300 font-medium transition"
                      >
                        Sample Image: Professional Blue CV
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'file' && (
                /* Tab 2: File Dropzone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-600/10'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/80'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-1">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    {file ? file.name : t('dropCvFileHere')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Click to change file`
                      : t('supportedFormats')}
                  </p>
                </div>
              )}

              {activeTab === 'text' && (
                /* Tab 3: Raw Textarea */
                <div>
                  <textarea
                    rows={8}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder={t('pasteCvPlaceholder')}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none custom-scroll font-mono leading-relaxed"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            {t('cancel')}
          </button>

          {extractedData ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExtractedData(null)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'សាកល្បង Link ផ្សេង' : 'Try Another'}</span>
              </button>
              <button
                type="button"
                onClick={handleApplyToCV}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'km' ? 'អនុវត្ត & បំពេញចូល CV' : t('applyToCV')}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleProcess}
              disabled={
                loading ||
                (activeTab === 'url' ? !imageUrl.trim() : activeTab === 'file' ? !file : !rawText.trim())
              }
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'km' ? 'កំពុងស្កេនរូបភាពដោយ AI...' : 'Scanning Image with AI...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'km' ? '🚀 ទាញយកទិន្នន័យពី Link នេះ' : 'Extract Data from Link'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
