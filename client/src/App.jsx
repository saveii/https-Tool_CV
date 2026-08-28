import React, { useState, useEffect, useRef } from 'react';
import { CVProvider, useCV } from './context/CVContext';
import { Navbar } from './components/Navbar';
import { EditorContainer } from './components/CVEditor/EditorContainer';
import { PreviewContainer } from './components/CVPreview/PreviewContainer';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { AIImportModal } from './components/AIImportModal';
import { AdminModal } from './components/AdminModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CheckCircle2, AlertCircle, Info, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const MainApp = () => {
  const { notification, setIsAuthModalOpen, language } = useCV();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAIImportModalOpen, setIsAIImportModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState('form'); // 'form' | 'preview' | 'style'

  // Draggable Split-Screen Resizer (ទាញពង្រីក-បង្រួម Split-Pane)
  const [splitRatio, setSplitRatio] = useState(() => {
    const saved = localStorage.getItem('tool_cv_split_ratio');
    return saved ? Number(saved) : 48; // default 48% Editor, 52% Preview
  });
  const [isDragging, setIsDragging] = useState(false);
  const mainContainerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMove = (clientX) => {
      if (!mainContainerRef.current) return;
      const rect = mainContainerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const totalWidth = rect.width;
      if (totalWidth <= 0) return;
      const newPercent = (relativeX / totalWidth) * 100;
      // Clamp between 25% and 75%
      const clamped = Math.min(75, Math.max(25, newPercent));
      setSplitRatio(clamped);
      localStorage.setItem('tool_cv_split_ratio', String(Math.round(clamped)));
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const onTouchMove = (e) => {
      if (!isDragging || !e.touches[0]) return;
      handleMove(e.touches[0].clientX);
    };

    const onMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-blue-600 selection:text-white pb-14 xl:pb-0">
      {/* Top Navbar */}
      <Navbar
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAIImportModal={() => setIsAIImportModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Workspace: Draggable Split Screen on PC / Tab-Switched on Mobile Phone */}
      <main
        ref={mainContainerRef}
        className="flex-1 p-2 sm:p-3 lg:p-4 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-4rem)] relative select-none lg:select-auto"
      >
        {/* Left Side: Interactive CV Form Editor (Dynamic Resizable Width) */}
        <section
          style={{ width: mobileView === 'preview' ? '100%' : `${splitRatio}%` }}
          className={`h-full flex flex-col ${
            mobileView === 'form' || mobileView === 'style' ? 'w-full flex' : 'hidden lg:flex'
          }`}
        >
          <div className="h-full pr-0 lg:pr-1.5 flex flex-col">
            <EditorContainer onOpenAIImportModal={() => setIsAIImportModalOpen(true)} />
          </div>
        </section>

        {/* Draggable Divider Bar with Grip Handle (Desktop Only) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={() => setSplitRatio(48)}
          className={`hidden lg:flex flex-col items-center justify-center relative z-20 cursor-col-resize group px-1 select-none transition-colors ${
            isDragging ? 'bg-blue-600/30' : 'hover:bg-blue-600/20'
          }`}
          style={{ width: '18px' }}
          title={language === 'km' ? 'ទាញរំកិលទៅឆ្វេង/ស្តាំ ដើម្បីពង្រីក-បង្រួម Editor / Preview (ចុច 2 ដងដើម្បី Reset 50/50)' : 'Drag left/right to resize Editor / Preview (Double-click to reset)'}
        >
          {/* Subtle Vertical Track Line */}
          <div
            className={`w-1 h-full rounded-full transition-all duration-200 ${
              isDragging ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-x-125' : 'bg-slate-800 group-hover:bg-blue-500/70'
            }`}
          />

          {/* Center Grip Handle with Arrow Hint */}
          <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center p-1 bg-slate-900 border border-slate-700/80 rounded-full shadow-2xl group-hover:border-blue-500/60 group-hover:scale-110 transition">
            <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400" />
          </div>
        </div>

        {/* Right Side: Live Synchronized A4 Preview (Dynamic Resizable Width) */}
        <section
          style={{ width: mobileView === 'preview' ? '100%' : `${100 - splitRatio}%` }}
          className={`h-full flex flex-col ${
            mobileView === 'preview' ? 'w-full flex' : 'hidden lg:flex'
          }`}
        >
          <div className="h-full pl-0 lg:pl-1.5 flex flex-col">
            <PreviewContainer />
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar (< 1280px) */}
      <MobileBottomNav
        mobileView={mobileView}
        setMobileView={setMobileView}
        onOpenAIImport={() => setIsAIImportModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Gate Auth Modal (Login / Register / Social) */}
      <AuthModal />

      {/* User Profile & Saved Cloud CVs Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* AI Smart CV Import Modal */}
      <AIImportModal
        isOpen={isAIImportModalOpen}
        onClose={() => setIsAIImportModalOpen(false)}
      />

      {/* Admin MySQL Database Management Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed bottom-16 xl:bottom-5 right-5 z-50 animate-bounce-short">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border backdrop-blur-lg text-xs font-semibold ${
              notification.type === 'error'
                ? 'bg-red-950/90 border-red-500/40 text-red-200'
                : notification.type === 'info'
                ? 'bg-blue-950/90 border-blue-500/40 text-blue-200'
                : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : notification.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CVProvider>
      <MainApp />
    </CVProvider>
  );
}
