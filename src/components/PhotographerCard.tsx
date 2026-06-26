'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Star, Heart, CheckCircle2, Sparkles } from 'lucide-react';
import { Professional } from "@/types/photographer";

interface PhotographerCardProps {
  photographer: Professional;
}

export default function PhotographerCard({ photographer }: PhotographerCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden card-hover flex flex-col h-full relative">
      {/* Image Wrap */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
        <img
          src={photographer.image}
          alt={photographer.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-950/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-zinc-900 transition-colors shadow-lg active:scale-90"
        >
          <Heart
            className={`w-4.5 h-4.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>

        {/* Badges Overlay */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {photographer.rating >= 4.8 && (
            <span className="px-2.5 py-1 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
              Top Rated
            </span>
          )}
          {photographer.aiPick && (
            <span className="px-2.5 py-1 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-white" />
              AI Pick
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-bold text-white text-lg group-hover:text-amber-500 transition-colors">
              {photographer.name}
            </h3>
            {photographer.verified && (
              <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 fill-blue-500/10" />
            )}
          </div>

          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>{photographer.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-zinc-200">{photographer.rating}</span>
              <span className="text-zinc-500">({photographer.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
          {photographer.bio}
        </p>

        {/* Specialties Tags */}
        <div className="flex flex-wrap gap-1.5">
          {(photographer.specialties ?? []).slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] rounded-md border border-zinc-800"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
              Starting at
            </span>
            <div className="text-base font-bold text-white font-display">
              ₹{(photographer.startingPrice ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <Link
            href={`/photographers/${photographer.id}`}
            className="px-4 py-2 bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl hover:bg-zinc-700 hover:text-white transition-colors active:scale-95 border border-zinc-700/30"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
