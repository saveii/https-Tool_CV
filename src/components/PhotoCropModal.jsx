import React, { useState, useRef, useEffect } from 'react';
import { useCV } from '../context/CVContext';
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  Check,
  X,
  Maximize2,
  Sliders,
  Sparkles,
  Move,
  RefreshCw
} from 'lucide-react';

export const PhotoCropModal = ({ isOpen, onClose, imageSrc, onApply }) => {
  const { cvData, updatePersonalInfo, updateSetting, settings, language, showToast } = useCV();

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // CV Photo size & shape settings
  const [photoSize, setPhotoSize] = useState(cvData.personalInfo?.photoSize || 128);
  const [photoShape, setPhotoShape] = useState(cvData.personalInfo?.photoShape || 'circle'); // 'circle' | 'rounded' | 'square'
  const [aspectRatio, setAspectRatio] = useState('1:1'); // '1:1' | '3:4'

  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setOffset({ x: 0, y: 0 });
      setPhotoSize(cvData.personalInfo?.photoSize || 128);
      setPhotoShape(cvData.personalInfo?.photoShape || 'circle');
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleSaveAndApply = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const outputSize = 400; // High resolution exported avatar

    const isPortrait = aspectRatio === '3:4';
    canvas.width = outputSize;
    canvas.height = isPortrait ? outputSize * (4 / 3) : outputSize;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Translate to canvas center
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -zoom : zoom, zoom);

      // Draw image centered with offset
      const drawWidth = canvas.width;
      const drawHeight = (img.naturalHeight / img.naturalWidth) * drawWidth;

      ctx.drawImage(
        img,
        -drawWidth / 2 + (offset.x * (canvas.width / 260)),
        -drawHeight / 2 + (offset.y * (canvas.height / 260)),
        drawWidth,
        drawHeight
      );

      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

      if (onApply) {
        onApply(croppedDataUrl, { photoSize, photoShape });
      } else {
        updatePersonalInfo('photo', croppedDataUrl);
        updatePersonalInfo('photoSize', photoSize);
        updatePersonalInfo('photoShape', photoShape);
        updateSetting('photoSize', photoSize);
        updateSetting('photoShape', photoShape);
      }

      showToast(
        language === 'km'
          ? '🎉 បានកែតម្រូវទំហំ និងរូបថត CV ជោគជ័យ!'
          : '🎉 Profile photo cropped and resized successfully!'
      );
      onClose();
    };
    img.src = imageSrc;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-4 sm:p-5 shadow-2xl relative max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'km' ? 'កែតម្រូវទំហំ & កាត់រូបថត CV' : 'Crop & Resize CV Profile Photo'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'km' ? 'អូសដើម្បីរំកិល ពង្រីក និងកំណត់ទំហំរូបភាពលើ CV' : 'Drag to reposition, zoom and adjust photo dimensions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scroll py-3 space-y-4">
          {/* Cropper Viewport */}
          <div className="flex flex-col items-center justify-center">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="w-64 h-64 bg-slate-950 rounded-2xl border-2 border-slate-800 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-inner group"
            >
              {/* Mask overlay showing final shape */}
              <div
                className={`absolute inset-0 pointer-events-none transition-all ${
                  photoShape === 'circle'
                    ? 'rounded-full border-4 border-blue-500/80 shadow-[0_0_0_9999px_rgba(2,6,23,0.7)]'
                    : photoShape === 'rounded'
                    ? 'rounded-3xl border-4 border-blue-500/80 shadow-[0_0_0_9999px_rgba(2,6,23,0.7)]'
                    : 'rounded-lg border-4 border-blue-500/80 shadow-[0_0_0_9999px_rgba(2,6,23,0.7)]'
                }`}
              />

              {/* Move Indicator Overlay */}
              <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 rounded-md px-2 py-0.5 text-[10px] text-slate-300 pointer-events-none flex items-center gap-1">
                <Move className="w-2.5 h-2.5 text-blue-400" />
                <span>{language === 'km' ? 'អូសដើម្បីរំកិល' : 'Drag to pan'}</span>
              </div>

              {/* Controllable Image */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${flipH ? -zoom : zoom}, ${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
                className="max-w-full max-h-full object-contain pointer-events-none"
              />
            </div>
          </div>

          {/* Quick Controls: Zoom & Rotate */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-3">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="range"
                min="0.6"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-mono text-slate-300 w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Transform Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 transition"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? 'បង្វិល 90°' : 'Rotate'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH((prev) => !prev)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 transition"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? 'ត្រឡប់' : 'Flip'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{language === 'km' ? 'កំណត់ដើម' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* CV Dimension & Shape Controls */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-3">
            {/* Shape Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'km' ? 'រាងរូបថតលើ CV (Photo Shape)' : 'CV Photo Shape'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoShape('circle')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                    photoShape === 'circle'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-current" />
                  <span>{language === 'km' ? 'រាងមូល' : 'Circle'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoShape('rounded')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                    photoShape === 'rounded'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-3 h-3 rounded-md bg-current" />
                  <span>{language === 'km' ? 'ជ្រុងកោង' : 'Rounded'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoShape('square')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                    photoShape === 'square'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-3 h-3 rounded-none bg-current" />
                  <span>{language === 'km' ? 'រាងការ៉េ' : 'Square'}</span>
                </button>
              </div>
            </div>

            {/* Photo Size on CV Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  {language === 'km' ? 'ទំហំរូបភាពលើ CV (Photo Display Size)' : 'Photo Size on CV'}
                </label>
                <span className="text-xs font-mono font-bold text-blue-400">{photoSize}px</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500">តូច</span>
                <input
                  type="range"
                  min="70"
                  max="180"
                  step="5"
                  value={photoSize}
                  onChange={(e) => setPhotoSize(parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">ធំ</span>
              </div>

              {/* Quick Presets */}
              <div className="flex gap-2 mt-2">
                {[
                  { label: language === 'km' ? 'តូច (90px)' : 'Small (90px)', size: 90 },
                  { label: language === 'km' ? 'មធ្យម (125px)' : 'Standard (125px)', size: 125 },
                  { label: language === 'km' ? 'ធំ (155px)' : 'Large (155px)', size: 155 }
                ].map((preset) => (
                  <button
                    key={preset.size}
                    type="button"
                    onClick={() => setPhotoSize(preset.size)}
                    className={`flex-1 py-1 rounded-md text-[10.5px] font-medium border transition ${
                      photoSize === preset.size
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            {language === 'km' ? 'បោះបង់' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'km' ? 'រក្សាទុក & អនុវត្តលើ CV' : 'Save & Apply to CV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
