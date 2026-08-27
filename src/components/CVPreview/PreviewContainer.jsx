import React, { useRef, useState } from 'react';
import { useCV } from '../../context/CVContext';
import { InfographicTemplate } from '../Templates/InfographicTemplate';
import { ModernTemplate } from '../Templates/ModernTemplate';
import { ProfessionalTemplate } from '../Templates/ProfessionalTemplate';
import { MinimalTemplate } from '../Templates/MinimalTemplate';
import { CreativeTemplate } from '../Templates/CreativeTemplate';
import { SimpleTemplate } from '../Templates/SimpleTemplate';

import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Printer,
  Loader2,
  FileDown
} from 'lucide-react';

export const PreviewContainer = () => {
  const { cvData, settings, zoomLevel, setZoomLevel, isExporting, exportPDF, t } = useCV();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const renderTemplate = () => {
    const props = {
      data: cvData,
      themeColor: settings.themeColor || '#3e7bbd',
      fontFamily: settings.fontFamily,
      fontSize: settings.fontSize,
      visibleSections: settings.visibleSections || {},
      t
    };

    switch (settings.template) {
      case 'infographic':
        return <InfographicTemplate {...props} />;
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'professional':
        return <ProfessionalTemplate {...props} />;
      case 'minimal':
        return <MinimalTemplate {...props} />;
      case 'creative':
        return <CreativeTemplate {...props} />;
      case 'simple':
        return <SimpleTemplate {...props} />;
      default:
        return <InfographicTemplate {...props} />;
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 40));
  const handleResetZoom = () => setZoomLevel(90);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-xl relative ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950' : ''
      }`}
    >
      {/* Top Floating Controls Bar */}
      <div className="flex items-center justify-between p-3 bg-slate-900/90 border-b border-slate-800 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t('liveA4Preview')}
          </span>
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded-full uppercase">
            {settings.template}
          </span>
        </div>

        {/* Zoom & Action buttons */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:text-white transition"
              title={t('zoomOut')}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] select-none">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:text-white transition"
              title={t('zoomIn')}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:text-white text-slate-400 transition ml-0.5 border-l border-slate-800"
              title={t('resetZoom')}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
            title={t('browserPrint')}
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
            title={t('toggleFullscreen')}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t('exporting')}</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>{t('downloadPDF')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Preview Canvas Area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-slate-900/40">
        <div
          id="cv-preview-sheet"
          className="a4-sheet transition-all duration-200 select-text"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            marginBottom: `${(zoomLevel / 100) * 40}px`
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};
