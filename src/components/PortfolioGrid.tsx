'use client';

import React, { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioItem } from '../types/photographer';

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 bg-zinc-900/20 border border-zinc-800 rounded-3xl">
        <p className="text-zinc-500 text-sm">No portfolio items uploaded yet.</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
    }
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="space-y-8">
      {/* Masonry Columns Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="break-inside-avoid relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer group shadow-lg"
          >
            {item.type === 'video' ? (
              <div className="relative aspect-[9/16] w-full">
                <video
                  src={item.url}
                  poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=710&fit=crop"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden w-full">
                <img
                  src={item.url}
                  alt={item.title || 'Portfolio Work'}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  {item.title && (
                    <span className="text-white text-xs font-semibold uppercase tracking-wider">
                      {item.title}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={showPrev}
            className="absolute left-6 w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Content Wrapper */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center relative"
          >
            {items[lightboxIndex].type === 'video' ? (
              <video
                src={items[lightboxIndex].url}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={items[lightboxIndex].url}
                alt={items[lightboxIndex].title || 'Portfolio lightbox'}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
            )}
            
            {items[lightboxIndex].title && (
              <h4 className="text-zinc-200 text-sm font-semibold mt-4 uppercase tracking-widest font-display">
                {items[lightboxIndex].title}
              </h4>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={showNext}
            className="absolute right-6 w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
