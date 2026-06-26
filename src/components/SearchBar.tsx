'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Camera, Film, Wand2, Search } from 'lucide-react';

type TabType = 'shoot' | 'reels' | 'edit';

export default function SearchBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('shoot');
  
  // Search inputs
  const [location, setLocation] = useState('');
  const [shootCategory, setShootCategory] = useState('All Categories');
  const [reelType, setReelType] = useState('All Reel Types');
  const [editType, setEditType] = useState('All Edit Types');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map tabs to category search params
    let categoryParam = 'photographer';
    let filterVal = '';
    
    if (activeTab === 'reels') {
      categoryParam = 'reel-creator';
      filterVal = reelType !== 'All Reel Types' ? reelType : '';
    } else if (activeTab === 'edit') {
      categoryParam = 'editor';
      filterVal = editType !== 'All Edit Types' ? editType : '';
    } else {
      filterVal = shootCategory !== 'All Categories' ? shootCategory : '';
    }

    const queryParams = new URLSearchParams();
    queryParams.set('category', categoryParam);
    if (location) queryParams.set('location', location);
    if (filterVal) queryParams.set('specialty', filterVal);

    router.push(`/photographers?${queryParams.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab('shoot')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'shoot'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800'
          }`}
        >
          📸 Shoot
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'reels'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800'
          }`}
        >
          🎬 Reels
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'edit'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800'
          }`}
        >
          ✂️ Edit
        </button>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSearch}
        className="glass rounded-3xl p-3 shadow-2xl flex flex-col md:flex-row items-stretch gap-3 border border-zinc-800/80 transition-shadow duration-300 focus-within:border-amber-600/50"
      >
        {/* Tab 1: Shoot (Photographers) */}
        {activeTab === 'shoot' && (
          <>
            {/* Location Input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
              <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by city (e.g., Jaipur, Mumbai)..."
                className="w-full text-sm text-white placeholder-zinc-500 outline-none bg-transparent"
              />
            </div>
            {/* Divider */}
            <div className="hidden md:block w-px bg-zinc-800 my-2"></div>
            {/* Speciality Selector */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
              <Camera className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <select
                value={shootCategory}
                onChange={(e) => setShootCategory(e.target.value)}
                className="w-full text-sm text-zinc-300 outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="All Categories" className="bg-zinc-950 text-white">All Categories</option>
                <option value="Wedding" className="bg-zinc-950 text-white">Wedding</option>
                <option value="Pre-Wedding" className="bg-zinc-950 text-white">Pre-Wedding</option>
                <option value="Portrait" className="bg-zinc-950 text-white">Portrait</option>
                <option value="Events" className="bg-zinc-950 text-white">Events</option>
                <option value="Travel" className="bg-zinc-950 text-white">Travel</option>
                <option value="Commercial" className="bg-zinc-950 text-white">Commercial</option>
                <option value="Fashion" className="bg-zinc-950 text-white">Fashion</option>
                <option value="Drone" className="bg-zinc-950 text-white">Drone</option>
              </select>
            </div>
          </>
        )}

        {/* Tab 2: Reels */}
        {activeTab === 'reels' && (
          <>
            {/* Location Input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
              <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by city..."
                className="w-full text-sm text-white placeholder-zinc-500 outline-none bg-transparent"
              />
            </div>
            {/* Divider */}
            <div className="hidden md:block w-px bg-zinc-800 my-2"></div>
            {/* Reel Type Selector */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
              <Film className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <select
                value={reelType}
                onChange={(e) => setReelType(e.target.value)}
                className="w-full text-sm text-zinc-300 outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="All Reel Types" className="bg-zinc-950 text-white">All Reel Types</option>
                <option value="Instagram Reels" className="bg-zinc-950 text-white">Instagram Reels</option>
                <option value="YouTube Shorts" className="bg-zinc-950 text-white">YouTube Shorts</option>
                <option value="TikTok" className="bg-zinc-950 text-white">TikTok</option>
                <option value="Product Showcase" className="bg-zinc-950 text-white">Product Showcase</option>
                <option value="Brand Story" className="bg-zinc-950 text-white">Brand Story</option>
              </select>
            </div>
          </>
        )}

        {/* Tab 3: Edit */}
        {activeTab === 'edit' && (
          <>
            {/* Remote/City Input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
              <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search location (or Remote)..."
                className="w-full text-sm text-white placeholder-zinc-500 outline-none bg-transparent"
              />
            </div>
            {/* Divider */}
            <div className="hidden md:block w-px bg-zinc-800 my-2"></div>
            {/* Edit Type Selector */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
              <Wand2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="w-full text-sm text-zinc-300 outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="All Edit Types" className="bg-zinc-950 text-white">All Edit Types</option>
                <option value="Photo Retouching" className="bg-zinc-950 text-white">Photo Retouching</option>
                <option value="Color Grading" className="bg-zinc-950 text-white">Color Grading</option>
                <option value="Video Editing" className="bg-zinc-950 text-white">Video Editing</option>
                <option value="Reel Editing" className="bg-zinc-950 text-white">Reel Editing</option>
                <option value="Background Removal" className="bg-zinc-950 text-white">Background Removal</option>
                <option value="AI Enhancement" className="bg-zinc-950 text-white">AI Enhancement</option>
              </select>
            </div>
          </>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-white px-7 py-3 rounded-2xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-amber-600/10"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
