'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Play, Pause, MapPin, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { Professional } from '../types/photographer';

interface ReelCardProps {
  creator: Professional;
}

export default function ReelCard({ creator }: ReelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Find first video reel in portfolio, else use mock URL
  const reelVideo = creator.portfolio?.find((item) => item.type === 'video');
  const videoUrl = reelVideo?.url || 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-futuristic-portrait-42357-large.mp4';
  
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Handle browser autoplay policy restriction
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        });
      }
    }
  };

  return (
    <div 
      className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden card-hover flex flex-col h-full cursor-pointer relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 9:16 Aspect Video Container */}
      <div className="relative aspect-[9/16] overflow-hidden bg-zinc-950 rounded-2xl m-2">
        <video
          ref={videoRef}
          src={videoUrl}
          loop
          muted
          playsInline
          poster={creator.avatar}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Video Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/40 opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>

        {/* Dynamic Play/Pause Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white text-white" />
            ) : (
              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
            )}
          </div>
        </div>

        {/* AI Pick Tag */}
        {creator.aiPick && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 bg-violet-600/95 backdrop-blur-sm text-white text-[9px] font-bold rounded-lg flex items-center gap-1 shadow-lg border border-violet-500/20">
              <Sparkles className="w-2.5 h-2.5 fill-white" />
              AI Match
            </span>
          </div>
        )}

        {/* Quick details at the bottom of the video */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2.5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-white">{creator.rating}</span>
              <span className="text-[10px] text-zinc-400">({creator.reviewCount})</span>
            </div>
            {creator.specialties && creator.specialties.length > 0 && (
              <span className="text-[10px] text-zinc-300 font-medium px-2 py-0.5 bg-white/10 rounded-md">
                {creator.specialties[0]}
              </span>
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-bold text-white truncate">{creator.name}</h4>
              {creator.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <MapPin className="w-3 h-3 text-zinc-500 flex-shrink-0" />
              <span className="truncate">{creator.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info section below card */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-zinc-800/40 mt-auto bg-zinc-900">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">
            Rate
          </span>
          <div className="text-xs font-bold text-amber-500">
            ₹{(creator.startingPrice ?? 0).toLocaleString('en-IN')}{' '}
            <span className="text-[9px] font-normal text-zinc-400">/ reel</span>
          </div>
        </div>
        <Link
          href={`/photographers/${creator.id}`}
          className="text-[10px] font-bold text-zinc-300 hover:text-white transition-colors"
        >
          View Profile &rarr;
        </Link>
      </div>
    </div>
  );
}
