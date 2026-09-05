import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, X, Heart, Sparkles, MapPin, Calendar, Maximize2, Plus, Trash2, Camera, Film } from 'lucide-react';
import albumData from '../../data/album.json';

interface PhotoItem {
  id: string;
  url: string;
  localPath: string;
  caption: string;
  date: string;
  location: string;
}

interface LeftPage {
  photo?: PhotoItem;
  note?: string;
  sticker?: string;
}

interface RightPage {
  photo?: PhotoItem;
  note?: string;
  sticker?: string;
  isFinalCallout?: boolean;
  calloutTitle?: string;
  calloutSubtitle?: string;
  quote?: string;
  actionButtonText?: string;
}

interface DefaultSpread {
  id: number;
  spreadTitle: string;
  tagline: string;
  date: string;
  leftPage: LeftPage;
  rightPage: RightPage;
  isExtraPage?: false;
}

export interface ExtraPageData {
  id: string;
  title: string;
  date: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  caption: string;
  note: string;
}

interface ExtraSpread {
  id: number;
  spreadTitle: string;
  tagline: string;
  date: string;
  isExtraPage: true;
  extraData: ExtraPageData;
}

type Spread = DefaultSpread | ExtraSpread;

export const ScrapbookAlbum: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [prevSpreadIndex, setPrevSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [showHeartfeltModal, setShowHeartfeltModal] = useState(false);

  // Dynamic extra pages uploaded by users
  const [extraPages, setExtraPages] = useState<ExtraPageData[]>([]);

  const prefersReducedMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  // Load custom extra pages from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('album_extra_pages');
      if (saved) {
        setExtraPages(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Could not load extra pages from storage:', err);
    }
  }, []);

  const saveExtraPages = (updated: ExtraPageData[]) => {
    setExtraPages(updated);
    try {
      localStorage.setItem('album_extra_pages', JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  };

  const handleAddExtraPage = () => {
    const newPage: ExtraPageData = {
      id: `extra_${Date.now()}`,
      title: `Our Extra Memory #${extraPages.length + 1}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      mediaType: 'image',
      mediaUrl: '',
      caption: 'A brand new chapter of us ❤️',
      note: 'Upload your photo or video here to preserve this moment!'
    };
    const updated = [...extraPages, newPage];
    saveExtraPages(updated);

    // Auto navigate to the newly created spread
    const targetIdx = (albumData.spreads.length as number) + updated.length - 1;
    setPrevSpreadIndex(currentSpreadIndex);
    setDirection('next');
    setIsFlipping(true);
    setCurrentSpreadIndex(targetIdx);
  };

  const handleExtraMediaUpload = (pageId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 50MB size limit for media
    if (file.size > 50 * 1024 * 1024) {
      alert('Media size is too large. Please select a file smaller than 50MB.');
      return;
    }

    const isVideo = file.type.startsWith('video');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const updated = extraPages.map((page) => {
          if (page.id === pageId) {
            return {
              ...page,
              mediaType: (isVideo ? 'video' : 'image') as 'video' | 'image',
              mediaUrl: result
            };
          }
          return page;
        });
        saveExtraPages(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateExtraText = (pageId: string, caption: string, note: string) => {
    const updated = extraPages.map((page) => {
      if (page.id === pageId) {
        return { ...page, caption, note };
      }
      return page;
    });
    saveExtraPages(updated);
  };

  const handleDeleteExtraPage = (pageId: string) => {
    if (window.confirm('Delete this extra memory page from your album?')) {
      const updated = extraPages.filter((page) => page.id !== pageId);
      saveExtraPages(updated);
      if (currentSpreadIndex >= albumData.spreads.length + updated.length) {
        setCurrentSpreadIndex(Math.max(0, albumData.spreads.length + updated.length - 1));
      }
    }
  };

  // Combine default spreads + dynamic extra spreads
  const defaultSpreads: DefaultSpread[] = albumData.spreads as DefaultSpread[];
  const extraSpreads: ExtraSpread[] = extraPages.map((page, index) => ({
    id: defaultSpreads.length + index + 1,
    spreadTitle: page.title,
    tagline: `Extra Spread 0${index + 1}`,
    date: page.date,
    isExtraPage: true,
    extraData: page
  }));

  const allSpreads: Spread[] = [...defaultSpreads, ...extraSpreads];
  const currentSpread = allSpreads[currentSpreadIndex] || allSpreads[0];
  const prevSpread = allSpreads[prevSpreadIndex] || allSpreads[0];
  const isFirstSpread = currentSpreadIndex === 0;
  const isLastSpread = currentSpreadIndex === allSpreads.length - 1;

  // Keyboard navigation & Escape hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhoto) {
        if (e.key === 'Escape') setActivePhoto(null);
        return;
      }
      if (showHeartfeltModal) {
        if (e.key === 'Escape') setShowHeartfeltModal(false);
        return;
      }
      if (!isOpen || isFlipping) return;

      if (e.key === 'ArrowRight' && !isLastSpread) {
        handleNextSpread();
      } else if (e.key === 'ArrowLeft' && !isFirstSpread) {
        handlePrevSpread();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSpreadIndex, activePhoto, showHeartfeltModal, isFirstSpread, isLastSpread, isFlipping]);

  const handleOpenAlbum = () => {
    setIsOpen(true);
  };

  const handleNextSpread = () => {
    if (currentSpreadIndex < allSpreads.length - 1 && !isFlipping) {
      setPrevSpreadIndex(currentSpreadIndex);
      setDirection('next');
      setIsFlipping(true);
      setCurrentSpreadIndex((prev) => prev + 1);
    }
  };

  const handlePrevSpread = () => {
    if (currentSpreadIndex > 0 && !isFlipping) {
      setPrevSpreadIndex(currentSpreadIndex);
      setDirection('prev');
      setIsFlipping(true);
      setCurrentSpreadIndex((prev) => prev - 1);
    }
  };

  // Touch / Swipe handling for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || isFlipping) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0 && !isLastSpread) {
        handleNextSpread();
      } else if (deltaX > 0 && !isFirstSpread) {
        handlePrevSpread();
      }
    }
  };

  /* Render Helper for Left Page */
  const renderLeftPage = (spread: Spread) => {
    if (spread.isExtraPage) {
      const data = spread.extraData;
      return (
        <div className="relative bg-[#fbf7ee] text-slate-800 p-4 sm:p-8 rounded-t-xl md:rounded-l-xl md:rounded-tr-none shadow-[inset_-10px_0_20px_rgba(0,0,0,0.06)] border-b md:border-b-0 md:border-r border-amber-900/10 h-full flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d6c7b2_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-amber-950/5 to-transparent pointer-events-none hidden md:block" />

          {/* Header */}
          <div className="relative z-10 flex justify-between items-center mb-3 border-b border-amber-900/10 pb-2">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-800/60 font-bold">
              {spread.tagline}
            </span>
            <span className="text-xs font-serif italic text-amber-900/70 font-medium">
              {spread.date}
            </span>
          </div>

          {/* Media Container (Image or Video) */}
          <div className="relative z-10 my-auto flex flex-col items-center w-full">
            <div className="group relative bg-white p-3 sm:p-4 rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.15)] rotate-[-1deg] max-w-[280px] sm:max-w-[320px] w-full">
              {/* Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-rose-200/80 backdrop-blur-xs border border-rose-300/60 shadow-xs rotate-[-1deg] z-20 flex items-center justify-center pointer-events-none">
                <span className="text-[9px] font-mono text-rose-800/70 uppercase">extra memory</span>
              </div>

              {!data.mediaUrl ? (
                /* Upload Placeholder Area */
                <label
                  htmlFor={`extra-media-upload-${data.id}`}
                  className="relative aspect-[4/3] bg-amber-50 border-2 border-dashed border-amber-300 rounded-xs flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-amber-100/60 transition-colors mb-3"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-200/60 flex items-center justify-center text-amber-800 mb-2">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-serif font-semibold text-amber-950 mb-1">
                    Upload Photo or Video
                  </span>
                  <span className="text-[10px] font-mono text-amber-800/60">
                    Supports JPG, PNG, MP4, WEBM
                  </span>
                  <input
                    id={`extra-media-upload-${data.id}`}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => handleExtraMediaUpload(data.id, e)}
                  />
                </label>
              ) : data.mediaType === 'video' ? (
                /* Video Player */
                <div className="relative aspect-[4/3] bg-black rounded-xs overflow-hidden mb-3">
                  <video
                    src={data.mediaUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <label
                    htmlFor={`extra-media-upload-change-${data.id}`}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors cursor-pointer z-30"
                    title="Change Video"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <input
                      id={`extra-media-upload-change-${data.id}`}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => handleExtraMediaUpload(data.id, e)}
                    />
                  </label>
                </div>
              ) : (
                /* Image Display */
                <div className="relative aspect-[4/3] bg-amber-100 rounded-xs overflow-hidden mb-3">
                  <img
                    src={data.mediaUrl}
                    alt={data.caption}
                    onClick={() =>
                      setActivePhoto({
                        id: data.id,
                        url: data.mediaUrl!,
                        localPath: data.mediaUrl!,
                        caption: data.caption,
                        date: data.date,
                        location: 'Added Memory'
                      })
                    }
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  />
                  <label
                    htmlFor={`extra-media-upload-change-${data.id}`}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer z-30"
                    title="Change Photo/Video"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      id={`extra-media-upload-change-${data.id}`}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => handleExtraMediaUpload(data.id, e)}
                    />
                  </label>
                </div>
              )}

              <p className="text-xs sm:text-sm font-serif text-slate-700 italic text-center leading-snug">
                “{data.caption || 'A new chapter of our journey'}”
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-3 flex justify-between items-center text-[10px] font-mono text-amber-800/60">
            <span>Dynamic Memory Page</span>
            <span className="text-rose-600 font-bold">❤️ Custom</span>
          </div>
        </div>
      );
    }

    return (
      <div className="relative bg-[#fbf7ee] text-slate-800 p-4 sm:p-8 rounded-t-xl md:rounded-l-xl md:rounded-tr-none shadow-[inset_-10px_0_20px_rgba(0,0,0,0.06)] border-b md:border-b-0 md:border-r border-amber-900/10 h-full flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d6c7b2_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-amber-950/5 to-transparent pointer-events-none hidden md:block" />

        {/* Page Header */}
        <div className="relative z-10 flex justify-between items-center mb-3 border-b border-amber-900/10 pb-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-800/60 font-bold">
            {spread.tagline}
          </span>
          <span className="text-xs font-serif italic text-amber-900/70 font-medium">
            {spread.date}
          </span>
        </div>

        {/* Left Photo Scrapbook Frame */}
        {spread.leftPage.photo && (
          <div className="relative z-10 my-auto flex flex-col items-center">
            <div
              onClick={() => setActivePhoto(spread.leftPage.photo!)}
              className="group relative cursor-pointer bg-white p-3 sm:p-4 rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.15)] rotate-[-2deg] hover:rotate-0 transition-transform duration-300 max-w-[260px] sm:max-w-[310px] w-full"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-200/80 backdrop-blur-xs border border-amber-300/60 shadow-xs rotate-[-1deg] z-20 flex items-center justify-center pointer-events-none">
                <span className="text-[9px] font-mono text-amber-800/70 uppercase">memory</span>
              </div>

              <div className="relative aspect-[4/3] bg-amber-100 rounded-xs overflow-hidden mb-2.5">
                <img
                  src={spread.leftPage.photo.localPath}
                  alt={spread.leftPage.photo.caption}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = spread.leftPage.photo!.url;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <p className="text-xs sm:text-sm font-serif text-slate-700 italic text-center leading-snug">
                “{spread.leftPage.photo.caption}”
              </p>

              <div className="mt-2 flex justify-between items-center text-[10px] font-mono text-amber-800/60 border-t border-slate-100 pt-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-700" />
                  {spread.leftPage.photo.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-600" />
                  {spread.leftPage.photo.location}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Left Note & Sticker */}
        <div className="relative z-10 mt-3 flex items-end justify-between gap-2">
          {spread.leftPage.note && (
            <div className="bg-amber-100/70 border border-amber-300/40 p-2 sm:p-2.5 rounded-md text-xs font-serif italic text-amber-950/80 shadow-xs max-w-[80%]">
              ✍️ {spread.leftPage.note}
            </div>
          )}
          {spread.leftPage.sticker && (
            <span className="inline-block px-2.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-[10px] font-semibold text-rose-800 shadow-xs rotate-3 shrink-0">
              {spread.leftPage.sticker}
            </span>
          )}
        </div>
      </div>
    );
  };

  /* Render Helper for Right Page */
  const renderRightPage = (spread: Spread) => {
    if (spread.isExtraPage) {
      const data = spread.extraData;
      return (
        <div className="relative bg-[#fbf7ee] text-slate-800 p-4 sm:p-8 rounded-b-xl md:rounded-r-xl md:rounded-bl-none shadow-[inset_10px_0_20px_rgba(0,0,0,0.06)] border-t md:border-t-0 md:border-l border-amber-900/10 h-full flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d6c7b2_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
          <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-amber-950/5 to-transparent pointer-events-none hidden md:block" />

          {/* Header */}
          <div className="relative z-10 flex justify-between items-center mb-3 border-b border-amber-900/10 pb-2">
            <span className="text-xs font-serif italic text-amber-900/70 font-medium">
              {data.title}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-800/60 font-bold">
              Page {spread.id * 2}
            </span>
          </div>

          {/* Editable Caption & Note Form */}
          <div className="relative z-10 my-auto flex flex-col gap-4 max-w-sm mx-auto w-full">
            <div className="bg-amber-100/80 border border-amber-300/60 p-4 rounded-xl shadow-xs">
              <label className="text-[11px] font-mono uppercase text-amber-900/70 font-bold block mb-1">
                ✍️ Memory Caption:
              </label>
              <input
                type="text"
                value={data.caption}
                onChange={(e) => handleUpdateExtraText(data.id, e.target.value, data.note)}
                placeholder="Type your memory title/caption..."
                className="w-full p-2 bg-white/80 border border-amber-300 rounded-md text-xs font-serif italic text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 mb-3"
              />

              <label className="text-[11px] font-mono uppercase text-amber-900/70 font-bold block mb-1">
                📝 Handwritten Note:
              </label>
              <textarea
                value={data.note}
                onChange={(e) => handleUpdateExtraText(data.id, data.caption, e.target.value)}
                placeholder="Type a personal note about this memory..."
                rows={3}
                className="w-full p-2 bg-white/80 border border-amber-300 rounded-md text-xs font-serif italic text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Remove Page Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleDeleteExtraPage(data.id)}
                className="px-3 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold hover:bg-rose-600 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Page</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-3 flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-800/60">
              Personal Memory Sheet
            </span>
            <span className="inline-block px-2 py-0.5 rounded-full bg-amber-200 border border-amber-300 text-[10px] font-semibold text-amber-900 shadow-xs">
              ✨ Dynamic
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="relative bg-[#fbf7ee] text-slate-800 p-4 sm:p-8 rounded-b-xl md:rounded-r-xl md:rounded-bl-none shadow-[inset_10px_0_20px_rgba(0,0,0,0.06)] border-t md:border-t-0 md:border-l border-amber-900/10 h-full flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d6c7b2_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-amber-950/5 to-transparent pointer-events-none hidden md:block" />

        {/* Page Header */}
        <div className="relative z-10 flex justify-between items-center mb-3 border-b border-amber-900/10 pb-2">
          <span className="text-xs font-serif italic text-amber-900/70 font-medium">
            {spread.spreadTitle}
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-800/60 font-bold">
            Page {spread.id * 2}
          </span>
        </div>

        {/* Right Photo or Final Callout */}
        {spread.rightPage.isFinalCallout ? (
          <div className="relative z-10 my-auto flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mb-3 shadow-sm">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-rose-400" />
            </div>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-950 mb-2">
              {spread.rightPage.calloutTitle}
            </h4>
            <p className="text-sm sm:text-lg font-serif italic text-rose-900/80 mb-4">
              {spread.rightPage.calloutSubtitle}
            </p>

            <div className="p-3.5 rounded-xl bg-amber-100/60 border border-amber-300/40 text-xs sm:text-sm font-serif italic text-amber-900/90 mb-4 max-w-xs shadow-xs">
              “{spread.rightPage.quote}”
            </div>

            <div className="flex flex-col gap-2.5 items-center w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHeartfeltModal(true)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-900/20 flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{spread.rightPage.actionButtonText || 'Read one last thing ❤️'}</span>
              </motion.button>

              {/* PLUS BUTTON TO ADD EXTRA MEMORY PAGE */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddExtraPage}
                className="px-5 py-2 rounded-full bg-amber-200/90 border border-amber-400/80 text-amber-950 font-bold text-xs shadow-sm flex items-center gap-1.5 hover:bg-amber-300 transition-all"
              >
                <Plus className="w-4 h-4 text-amber-900" />
                <span>Add Extra Memory Page 📷</span>
              </motion.button>
            </div>
          </div>
        ) : (
          spread.rightPage.photo && (
            <div className="relative z-10 my-auto flex flex-col items-center">
              <div
                onClick={() => setActivePhoto(spread.rightPage.photo!)}
                className="group relative cursor-pointer bg-white p-3 sm:p-4 rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.15)] rotate-[2deg] hover:rotate-0 transition-transform duration-300 max-w-[260px] sm:max-w-[310px] w-full"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-rose-200/80 backdrop-blur-xs border border-rose-300/60 shadow-xs rotate-[1deg] z-20 flex items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-mono text-rose-800/70 uppercase">forever</span>
                </div>

                <div className="relative aspect-[4/3] bg-amber-100 rounded-xs overflow-hidden mb-2.5">
                  <img
                    src={spread.rightPage.photo.localPath}
                    alt={spread.rightPage.photo.caption}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = spread.rightPage.photo!.url;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-serif text-slate-700 italic text-center leading-snug">
                  “{spread.rightPage.photo.caption}”
                </p>

                <div className="mt-2 flex justify-between items-center text-[10px] font-mono text-amber-800/60 border-t border-slate-100 pt-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-700" />
                    {spread.rightPage.photo.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-600" />
                    {spread.rightPage.photo.location}
                  </span>
                </div>
              </div>
            </div>
          )
        )}

        {/* Right Note & Sticker */}
        <div className="relative z-10 mt-3 flex items-end justify-between gap-2">
          {spread.rightPage.note && (
            <div className="bg-amber-100/70 border border-amber-300/40 p-2 sm:p-2.5 rounded-md text-xs font-serif italic text-amber-950/80 shadow-xs max-w-[80%]">
              ✍️ {spread.rightPage.note}
            </div>
          )}
          {spread.rightPage.sticker && (
            <span className="inline-block px-2.5 py-1 rounded-full bg-amber-200 border border-amber-300 text-[10px] font-semibold text-amber-900 shadow-xs rotate-[-3deg] shrink-0">
              {spread.rightPage.sticker}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full py-20 px-4 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a060d] via-[#140b17] to-[#080808] text-amber-50 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="text-center max-w-2xl mb-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Keepsake Scrapbook</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-200 to-amber-300 mb-3"
        >
          {albumData.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg text-amber-200/70 italic font-serif"
        >
          “{albumData.subtitle}”
        </motion.p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center">
        {!isOpen ? (
          /* CLOSED ALBUM COVER */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
            onClick={handleOpenAlbum}
            className="cursor-pointer group relative w-full max-w-md aspect-[4/5] sm:aspect-[3/4] bg-gradient-to-br from-[#2a1b14] via-[#1a0e08] to-[#0f0704] rounded-2xl p-8 border border-amber-900/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between text-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400/50 rounded-br-lg" />

            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-r border-amber-500/30 flex flex-col justify-around items-center py-6 opacity-80">
              <div className="w-2 h-2 rounded-full bg-amber-400/60" />
              <div className="w-2 h-2 rounded-full bg-amber-400/60" />
              <div className="w-2 h-2 rounded-full bg-amber-400/60" />
            </div>

            <div className="mt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8" />
              </div>
              <span className="text-xs uppercase tracking-widest text-amber-400/70 font-semibold">Keepsake Edition</span>
            </div>

            <div className="my-auto px-4">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-2">Our Little Book of Memories</h3>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto my-4" />
              <p className="text-sm text-amber-300/60 italic font-serif">Handcrafted with love</p>
            </div>

            <div className="mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-amber-950 font-bold text-sm shadow-lg shadow-rose-900/30 flex items-center gap-2 group-hover:shadow-rose-500/40 transition-all"
              >
                <span>Open our memories ❤️</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* REALISTIC PHYSICAL BOOK SPREAD */
          <div className="w-full flex flex-col items-center">
            {/* Book Spine Container */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-4xl min-h-[460px] sm:min-h-[580px] bg-[#1a1318] rounded-2xl p-2 sm:p-4 shadow-[0_30px_70px_rgba(0,0,0,0.9)] border border-amber-900/30 flex justify-center items-center overflow-hidden"
              style={{ perspective: prefersReducedMotion ? 'none' : '1800px' }}
            >
              {/* Outer Book Leather Cover Shadow & Edge */}
              <div className="absolute inset-0 bg-[#281b16] rounded-2xl shadow-inner border border-amber-500/10 pointer-events-none" />

              {/* Central Spine line & Binder Crease */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/50 via-amber-950/70 to-black/50 z-30 pointer-events-none hidden md:block border-x border-amber-900/30 shadow-2xl" />

              {/* BASE STATIONARY SPREAD */}
              <div className="relative w-full h-full min-h-[420px] sm:min-h-[520px] grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 z-10">
                <div className="w-full h-full">
                  {isFlipping && direction === 'next'
                    ? renderLeftPage(prevSpread)
                    : renderLeftPage(currentSpread)}
                </div>

                <div className="w-full h-full">
                  {isFlipping && direction === 'prev'
                    ? renderRightPage(prevSpread)
                    : renderRightPage(currentSpread)}
                </div>
              </div>

              {/* DYNAMIC 3D FLIPPING PAGE LEAF */}
              {!prefersReducedMotion && (
                <AnimatePresence
                  onExitComplete={() => setIsFlipping(false)}
                >
                  {isFlipping && (
                    <motion.div
                      key={`flip-leaf-${currentSpreadIndex}-${direction}`}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: direction === 'next' ? -180 : 180 }}
                      transition={{ duration: 0.75, ease: [0.3, 1, 0.4, 1] }}
                      onAnimationComplete={() => setIsFlipping(false)}
                      className={`absolute top-2 bottom-2 sm:top-4 sm:bottom-4 w-1/2 hidden md:block z-40`}
                      style={{
                        left: direction === 'next' ? '50%' : '0%',
                        transformOrigin: direction === 'next' ? 'left center' : 'right center',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* FRONT FACE */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-r-xl bg-[#fbf7ee] shadow-2xl overflow-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {direction === 'next' ? renderRightPage(prevSpread) : renderLeftPage(prevSpread)}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-amber-950/10 to-transparent pointer-events-none" />
                      </div>

                      {/* BACK FACE */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-l-xl bg-[#fbf7ee] shadow-2xl overflow-hidden"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        {direction === 'next' ? renderLeftPage(currentSpread) : renderRightPage(currentSpread)}
                        <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-amber-950/10 to-transparent pointer-events-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* ALBUM CONTROLS & PROGRESS INDICATOR */}
            <div className="w-full max-w-xl mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center justify-between w-full px-4">
                {/* Previous Button */}
                <button
                  onClick={handlePrevSpread}
                  disabled={isFirstSpread || isFlipping}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                    isFirstSpread || isFlipping
                      ? 'opacity-30 cursor-not-allowed border-amber-900/20 text-amber-400/40'
                      : 'border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400/60 active:scale-95'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Progress Text & Add Page Button */}
                <div className="text-center flex flex-col items-center gap-1">
                  <span className="text-xs font-mono tracking-widest text-amber-300/80 uppercase">
                    Spread {currentSpreadIndex + 1} of {allSpreads.length}
                  </span>

                  <button
                    onClick={handleAddExtraPage}
                    disabled={isFlipping}
                    className="text-[11px] font-mono text-amber-400/80 hover:text-amber-300 flex items-center gap-1 transition-colors underline underline-offset-4"
                  >
                    <Plus className="w-3 h-3 text-amber-400" />
                    <span>Add Extra Page</span>
                  </button>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextSpread}
                  disabled={isLastSpread || isFlipping}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                    isLastSpread || isFlipping
                      ? 'opacity-30 cursor-not-allowed border-amber-900/20 text-amber-400/40'
                      : 'border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400/60 active:scale-95'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dot Indicators */}
              <div className="flex items-center gap-2">
                {allSpreads.map((spread, idx) => (
                  <button
                    key={spread.id}
                    disabled={isFlipping}
                    onClick={() => {
                      if (idx === currentSpreadIndex || isFlipping) return;
                      setPrevSpreadIndex(currentSpreadIndex);
                      setDirection(idx > currentSpreadIndex ? 'next' : 'prev');
                      setIsFlipping(true);
                      setCurrentSpreadIndex(idx);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentSpreadIndex
                        ? 'w-6 h-2 bg-gradient-to-r from-amber-400 to-rose-400 shadow-sm'
                        : 'w-2 h-2 bg-amber-900/50 hover:bg-amber-700/60'
                    }`}
                    aria-label={`Go to spread ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL (For default images) */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#1c1215] border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col items-center cursor-default"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-amber-200 hover:bg-rose-600 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full max-h-[70vh] rounded-lg overflow-hidden bg-black flex items-center justify-center mb-4">
                <img
                  src={activePhoto.localPath}
                  alt={activePhoto.caption}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = activePhoto.url;
                  }}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="text-center max-w-xl w-full">
                <p className="text-base sm:text-xl font-serif text-amber-100 italic mb-2">
                  “{activePhoto.caption}”
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-amber-300/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {activePhoto.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {activePhoto.location}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL HEARTFELT MESSAGE MODAL */}
      <AnimatePresence>
        {showHeartfeltModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHeartfeltModal(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-gradient-to-b from-[#2a1720] via-[#1c0f16] to-[#12080d] border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(225,29,72,0.25)] text-center cursor-default"
            >
              <button
                onClick={() => setShowHeartfeltModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-amber-500/10 text-amber-300 hover:bg-rose-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                <Heart className="w-6 h-6 fill-rose-400" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-200 to-amber-200 mb-4">
                {albumData.finalHeartfeltMessage.title}
              </h3>

              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mb-6" />

              <div className="space-y-4 text-sm sm:text-base font-serif italic text-amber-100/90 leading-relaxed">
                {albumData.finalHeartfeltMessage.paragraphs.map((p, index) => (
                  <p key={index}>“{p}”</p>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-rose-900/30">
                <button
                  onClick={() => setShowHeartfeltModal(false)}
                  className="px-6 py-2.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-semibold hover:bg-rose-500 hover:text-white transition-all"
                >
                  Close & Cherish ❤️
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ScrapbookAlbum;
