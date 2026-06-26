'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Sparkles, CheckCircle2, Sliders } from 'lucide-react';
import { Professional } from '../types/photographer';

interface EditorCardProps {
  editor: Professional;
}

export default function EditorCard({ editor }: EditorCardProps) {
  // Mock editing tool badges based on specialties
  const getSoftwareTags = (specialties: string[]) => {
    const tags = [];
    if (specialties.includes('Photo Retouching') || specialties.includes('Background Removal')) {
      tags.push('Photoshop', 'Lightroom');
    }
    if (specialties.includes('Video Editing') || specialties.includes('Reel Editing')) {
      tags.push('Premiere Pro', 'After Effects');
    }
    if (specialties.includes('Color Grading')) {
      tags.push('DaVinci Resolve');
    }
    if (specialties.includes('AI Enhancement')) {
      tags.push('AI Tools');
    }
    return tags.length > 0 ? tags : ['Adobe CC'];
  };

  const softwareTags = getSoftwareTags(editor.specialties || []);

  return (
    <div className="group bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 card-hover flex flex-col h-full relative transition-all duration-300">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        {/* User avatar and info */}
        <div className="flex gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
            <img
              src={editor.image}
              alt={editor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-white text-base group-hover:text-amber-500 transition-colors">
                {editor.name}
              </h3>
              {editor.verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/10 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{editor.location}</span>
            </div>
          </div>
        </div>

        {/* AI Pick badge */}
        {editor.aiPick && (
          <span className="px-2.5 py-1 bg-violet-600/20 text-violet-400 border border-violet-500/20 text-[9px] font-bold rounded-lg flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 fill-violet-400" />
            AI Match
          </span>
        )}
      </div>

      {/* Bio / Description */}
      <p className="text-zinc-400 text-xs mt-4 leading-relaxed line-clamp-2">
        {editor.bio}
      </p>

      {/* Specialties/Software Tags */}
      <div className="space-y-3 mt-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">
            Specialties
          </span>
          <div className="flex flex-wrap gap-1.5">
            {editor.specialties || [].map((spec, index) => (
              <span
                key={spec}
                className="px-2 py-0.5 bg-amber-600/10 text-amber-500 border border-amber-500/10 text-[9px] font-semibold rounded-md"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">
            Software Stack
          </span>
          <div className="flex flex-wrap gap-1.5">
            {softwareTags.map((tool) => (
              <span
                key={tool}
                className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[9px] rounded-md"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rating & Pricing Footer */}
      <div className="pt-5 border-t border-zinc-800/80 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-zinc-200">{editor.rating}</span>
            <span className="text-zinc-500">({editor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Sliders className="w-3.5 h-3.5" />
            <span>{editor.experienceYears}y exp</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">
            Rate from
          </span>
          <Link
            href={`/photographers/${editor.id}`}
            className="text-sm font-bold text-white hover:text-amber-500 transition-colors font-display"
          >
            ₹{((editor.startingPrice)??0).toLocaleString('en-IN')}{' '}
            <span className="text-[10px] font-normal text-zinc-500">/ project</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
