import React, { useState } from 'react';
import { CVProvider, useCV } from './context/CVContext';
import { Navbar } from './components/Navbar';
import { EditorContainer } from './components/CVEditor/EditorContainer';
import { PreviewContainer } from './components/CVPreview/PreviewContainer';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { AIImportModal } from './components/AIImportModal';
import { AdminModal } from './components/AdminModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainApp = () => {
  const { notification, setIsAuthModalOpen } = useCV();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAIImportModalOpen, setIsAIImportModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState('form'); // 'form' | 'preview' | 'style'

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-blue-600 selection:text-white pb-14 xl:pb-0">
      {/* Top Navbar */}
      <Navbar
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAIImportModal={() => setIsAIImportModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Workspace: Split Screen on PC / Tab-Switched on Mobile Phone */}
      <main className="flex-1 p-2 sm:p-3 lg:p-5 flex flex-col lg:flex-row gap-4 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Left Side: Interactive CV Form Editor */}
        <section
          className={`w-full lg:w-[48%] xl:w-[45%] h-full flex flex-col ${
            mobileView === 'form' || mobileView === 'style' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <EditorContainer onOpenAIImportModal={() => setIsAIImportModalOpen(true)} />
        </section>

        {/* Right Side: Live Synchronized A4 Preview */}
        <section
          className={`w-full lg:w-[52%] xl:w-[55%] h-full flex flex-col ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <PreviewContainer />
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
