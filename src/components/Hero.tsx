import React from 'react';
import SearchBar from './SearchBar';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-24 pb-16">
      {/* Decorative Lights */}
      <div className="absolute top-20 right-1/4 w-[350px] h-[350px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-20 left-1/4 w-[450px] h-[450px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10000ms]"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 animate-fade-in-up">
        {/* Feature Badge */}
        <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 backdrop-blur-md rounded-full px-4.5 py-1.5 shadow-xl">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
          <span className="text-xs font-semibold text-zinc-300 tracking-wide">
            Now with Reels &amp; AI-Powered Matching
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Find Your Perfect <br />
            <span className="text-gradient">Creative Professional</span>
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            Photographers &bull; Videographers &bull; Reel Creators &bull; Editors
          </p>
        </div>

        <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
          Book top-tier visual creators for weddings, commercial campaigns, social media growth, or get your footage edited by seasoned colorists.
        </p>

        {/* Search Bar Integration */}
        <div className="pt-4">
          <SearchBar />
        </div>

        {/* AI Hint */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Shootly AI analyzes portfolios and style matching for the best results</span>
        </div>
      </div>
    </section>
  );
}
