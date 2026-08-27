import React, { useState, useMemo } from 'react';
import { useCV } from '../../context/CVContext';
import { SKILL_CATEGORIES, PRESET_SKILLS } from '../../data/skillsDatabase';
import {
  Code,
  Plus,
  Trash2,
  Search,
  Check,
  Sparkles,
  Layers,
  Star,
  X
} from 'lucide-react';

export const SkillsForm = () => {
  const { cvData, addListItem, updateListItem, removeListItem, t, language, showToast } = useCV();
  const { skills = [] } = cvData;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');

  // Add a skill (from preset or custom)
  const handleAddSkill = (name, level = 'Advanced', rating = 4) => {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();

    // Check if already in user's list
    const isDuplicate = skills.some(
      s => s.name.toLowerCase().trim() === cleanName.toLowerCase()
    );

    if (isDuplicate) {
      showToast(
        language === 'km' ? `ជំនាញ "${cleanName}" មានក្នុងបញ្ជីរួចហើយ!` : `Skill "${cleanName}" already added!`,
        'info'
      );
      return;
    }

    addListItem('skills', {
      name: cleanName,
      level,
      rating
    });

    showToast(
      language === 'km' ? `បានបន្ថែម "${cleanName}" ទៅក្នុង CV!` : `Added "${cleanName}" to your CV!`
    );
  };

  // Quick submit from search / input
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleAddSkill(searchQuery.trim());
      setSearchQuery('');
    }
  };

  // Filter skills based on Category and Search text
  const filteredPresets = useMemo(() => {
    return PRESET_SKILLS.filter(skill => {
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();

      if (!query) return matchesCategory;

      const nameEnMatch = skill.nameEn.toLowerCase().includes(query);
      const nameKmMatch = skill.nameKm.toLowerCase().includes(query);
      return matchesCategory && (nameEnMatch || nameKmMatch);
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            {t('skillsTitle')}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{t('skillsDesc')}</p>
        </div>
      </div>

      {/* Search & Custom Add Bar */}
      <div className="space-y-2">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchSkillsPlaceholder')}
              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('add')}</span>
          </button>
        </form>
      </div>

      {/* Category Filter Tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          {SKILL_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600/30 border border-blue-500 text-blue-300 shadow-sm'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span>{language === 'km' ? cat.labelKm : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Industry Preset Skills Grid */}
      <div className="bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t('quickAddPopular')}
          </span>
          <span className="text-[11px] text-slate-500">
            {filteredPresets.length} {language === 'km' ? 'ជំនាញ' : 'skills'}
          </span>
        </div>

        {filteredPresets.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-xs text-slate-400">{t('noSkillsFound')}</p>
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => {
                  handleAddSkill(searchQuery.trim());
                  setSearchQuery('');
                }}
                className="mt-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold transition"
              >
                {t('addCustomSkillBtn')} "{searchQuery.trim()}"
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto custom-scroll pr-1">
            {filteredPresets.map((skill, idx) => {
              const skillName = language === 'km' ? skill.nameKm : skill.nameEn;
              const isAdded = skills.some(
                s => s.name.toLowerCase().trim() === skillName.toLowerCase().trim()
              );

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSkill(skillName, 'Advanced', skill.defaultRating || 4)}
                  className={`text-[11.5px] px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                    isAdded
                      ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 shadow-sm'
                      : 'bg-slate-900/80 hover:bg-blue-900/30 border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-300'
                  }`}
                >
                  {isAdded ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <Plus className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                  <span>{skillName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Skills List on User's CV */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            {t('yourSkillsList')} ({skills.length})
          </span>
          {skills.length > 0 && (
            <button
              type="button"
              onClick={() => {
                skills.forEach(s => removeListItem('skills', s.id));
              }}
              className="text-[11px] text-slate-500 hover:text-red-400 transition"
            >
              {language === 'km' ? 'លុបទាំងអស់' : 'Clear all'}
            </button>
          )}
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-6 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
            <Code className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
            <p className="text-xs text-slate-400">
              {language === 'km' ? 'មិនទាន់បានជ្រើសរើសជំនាញណាមួយនៅឡើយទេ។' : 'No skills selected yet.'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'km' ? 'ចុចលើបញ្ជីជំនាញខាងលើ ឬវាយបញ្ចូលជំនាញផ្ទាល់ខ្លួន។' : 'Click on skill tags above or search to add.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {skills.map((skill, idx) => (
              <div
                key={skill.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition"
              >
                {/* Skill Name Input (Editable) */}
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 w-5">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={skill.name || ''}
                    onChange={(e) => updateListItem('skills', skill.id, 'name', e.target.value)}
                    placeholder={t('skillPlaceholder')}
                    className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Level Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={skill.level || 'Advanced'}
                    onChange={(e) => updateListItem('skills', skill.id, 'level', e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Beginner">{t('beginner')}</option>
                    <option value="Intermediate">{t('intermediate')}</option>
                    <option value="Advanced">{t('advanced')}</option>
                    <option value="Expert">{t('expert')}</option>
                  </select>

                  {/* 5-Star Rating Buttons */}
                  <div className="flex items-center gap-0.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800" title={`Rating: ${skill.rating || 4}/5`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateListItem('skills', skill.id, 'rating', star)}
                        className={`p-0.5 transition ${
                          (skill.rating || 4) >= star
                            ? 'text-amber-400 hover:scale-110'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    ))}
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => removeListItem('skills', skill.id)}
                    className="text-slate-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-500/10"
                    title="Delete skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
