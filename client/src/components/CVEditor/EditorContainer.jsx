import React from 'react';
import { useCV } from '../../context/CVContext';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ProfileForm } from './ProfileForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { LanguagesForm } from './LanguagesForm';
import { CertificatesForm } from './CertificatesForm';
import { ProjectsForm } from './ProjectsForm';
import { ReferencesForm } from './ReferencesForm';
import { SectionManager } from './SectionManager';

import {
  User,
  FileText,
  Briefcase,
  BookOpen,
  Code,
  Languages,
  Award,
  FolderGit2,
  UserCheck,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const EditorContainer = ({ onOpenAIImportModal }) => {
  const { activeTab, setActiveTab, t } = useCV();

  const TABS = [
    { id: 'personalInfo', label: t('tabPersonal'), icon: User },
    { id: 'profile', label: t('tabSummary'), icon: FileText },
    { id: 'experience', label: t('tabExperience'), icon: Briefcase },
    { id: 'education', label: t('tabEducation'), icon: BookOpen },
    { id: 'skills', label: t('tabSkills'), icon: Code },
    { id: 'languages', label: t('tabLanguages'), icon: Languages },
    { id: 'certificates', label: t('tabCertificates'), icon: Award },
    { id: 'projects', label: t('tabProjects'), icon: FolderGit2 },
    { id: 'references', label: t('tabReferences'), icon: UserCheck },
    { id: 'customize', label: t('tabStyle'), icon: Sliders }
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'personalInfo':
        return <PersonalInfoForm />;
      case 'profile':
        return <ProfileForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'languages':
        return <LanguagesForm />;
      case 'certificates':
        return <CertificatesForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'references':
        return <ReferencesForm />;
      case 'customize':
        return <SectionManager />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Scrollable Tab Navigation */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-900/90 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI Smart Import Quick Action Banner */}
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={onOpenAIImportModal}
          className="w-full p-2.5 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 hover:from-blue-900/50 hover:via-indigo-900/50 hover:to-purple-900/50 border border-blue-500/30 hover:border-blue-400/50 rounded-xl flex items-center justify-between text-left transition group shadow-lg shadow-indigo-500/5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300 transition">
                {t('aiSmartFillBtn')}
              </div>
              <div className="text-[10.5px] text-slate-400">
                PDF, PNG, JPG, Text • Auto-extract name, jobs & skills
              </div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition pr-1">
            <span>Import</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* Form Content Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scroll">
        {renderActiveTabContent()}
      </div>
    </div>
  );
};
