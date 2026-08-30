import React, { useRef, useState, useEffect } from 'react';
import { useCV } from '../../context/CVContext';
import { InfographicTemplate } from '../Templates/InfographicTemplate';
import { ModernTemplate } from '../Templates/ModernTemplate';
import { ProfessionalTemplate } from '../Templates/ProfessionalTemplate';
import { MinimalTemplate } from '../Templates/MinimalTemplate';
import { CreativeTemplate } from '../Templates/CreativeTemplate';
import { SimpleTemplate } from '../Templates/SimpleTemplate';
import { ExecutiveTemplate } from '../Templates/ExecutiveTemplate';
import { TechTemplate } from '../Templates/TechTemplate';

import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Printer,
  Loader2,
  FileDown,
  Smartphone,
  Scan
} from 'lucide-react';

export const PreviewContainer = () => {
  const { cvData, settings, zoomLevel, setZoomLevel, isExporting, exportPDF, t, language } = useCV();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [fitScale, setFitScale] = useState(1);

  const containerRef = useRef(null);
  const canvasAreaRef = useRef(null);

  // Calculate dynamic auto-fit scale based on available container width
  const updateFitScale = () => {
    if (canvasAreaRef.current) {
      const areaWidth = canvasAreaRef.current.clientWidth;
      // Standard A4 width at 96 DPI is 794px (~210mm)
      const padding = window.innerWidth < 640 ? 16 : 32;
      const availableWidth = areaWidth - padding;
      const scaleRatio = Math.max(Math.min(availableWidth / 794, 1), 0.35);
      setFitScale(scaleRatio);
    }
  };

  useEffect(() => {
    updateFitScale();
    window.addEventListener('resize', updateFitScale);
    return () => window.removeEventListener('resize', updateFitScale);
  }, []);

  const renderTemplate = () => {
    const props = {
      data: cvData,
      themeColor: settings.themeColor || '#2563eb',
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
      case 'executive':
        return <ExecutiveTemplate {...props} />;
      case 'tech':
        return <TechTemplate {...props} />;
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

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setZoomLevel((prev) => Math.max(prev - 10, 40));
  };

  const handleResetZoom = () => {
    setIsAutoFit(true);
    updateFitScale();
    setZoomLevel(90);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Compute final effective scale
  const effectiveScale = isAutoFit ? fitScale : zoomLevel / 100;
  const effectivePercentage = Math.round(effectiveScale * 100);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-xl relative ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950' : ''
      }`}
    >
      {/* Top Floating Controls Bar */}
      <div className="flex flex-wrap items-center justify-between p-2.5 sm:p-3 bg-slate-900/95 border-b border-slate-800 z-10 shrink-0 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            {language === 'km' ? 'A4 ផ្ទាល់' : t('liveA4Preview')}
          </span>
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded-full uppercase">
            {settings.template}
          </span>
        </div>

        {/* Zoom & Action buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
          {/* Auto Fit / Full Width Quick Switcher */}
          <button
            type="button"
            onClick={() => {
              if (isAutoFit) {
                setIsAutoFit(false);
                setZoomLevel(100);
              } else {
                setIsAutoFit(true);
                updateFitScale();
              }
            }}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition ${
              isAutoFit
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Auto Fit Screen"
          >
            {isAutoFit ? (
              <>
                <Scan className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'សមស្រប' : 'Fit'}</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>100%</span>
              </>
            )}
          </button>

          {/* Zoom Slider / Controls */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:text-white transition"
              title={t('zoomOut')}
            >
              <ZoomOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[10.5px] sm:text-[11px] select-none">
              {effectivePercentage}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:text-white transition"
              title={t('zoomIn')}
            >
              <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:text-white text-slate-400 transition ml-0.5 border-l border-slate-800 hidden sm:block"
              title={t('resetZoom')}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition hidden sm:flex items-center"
            title={t('toggleFullscreen')}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Download PDF Main CTA Button */}
          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition disabled:opacity-50 whitespace-nowrap"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden xs:inline">{t('exporting')}</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 shrink-0" />
                <span>{language === 'km' ? 'ទាញយក PDF' : 'Download PDF'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Preview Canvas Area */}
      <div
        ref={canvasAreaRef}
        className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-4 lg:p-6 flex justify-center items-start bg-slate-900/40 custom-scroll"
      >
        <div
          style={{
            width: `${794 * effectiveScale}px`,
            height: `${1123 * effectiveScale}px`,
            position: 'relative'
          }}
          className="transition-all duration-200"
        >
          <div
            id="cv-preview-sheet"
            className="a4-sheet select-text shadow-2xl origin-top-left"
            style={{
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              width: '794px',
              minHeight: '1123px'
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
