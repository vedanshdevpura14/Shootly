"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";  // ← ADD
import { useRouter } from "next/navigation";    // ← ADD

interface Professional {
  id: number;
  name: string;
  slug: string;
  city: string;
  rating: number;
  reviews: number;
  tags: string;
  price: number;
  image: string;
  verified: boolean;
  type: string;
  portfolios?: { imageUrl: string }[];
}

export default function PhotographersListPage() {
  const { status } = useSession();  // ← ADD
  const router = useRouter();        // ← ADD
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter States
  const [searchCity, setSearchCity] = useState("");
  const [activeTypes, setActiveTypes] = useState<string[]>(["Photographer", "Videographer", "Reel Creator", "Editor"]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/professionals")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProfessionals(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch:", err);
        setLoading(false);
      });
  }, []);

  const dummyData: Professional[] = [
    { id: 101, name: "Aisha Khan", slug: "aisha-khan-dummy", city: "Mumbai", rating: 4.9, reviews: 120, tags: "Reel Creator,Fashion", price: 5000, image: "https://picsum.photos/seed/aisha/600/750", verified: true, type: "Reel Creator" },
    { id: 102, name: "Deepa Nair", slug: "deepa-nair-dummy", city: "Bangalore", rating: 5.0, reviews: 85, tags: "Photographer,Editorial", price: 25000, image: "https://picsum.photos/seed/deepa/600/750", verified: true, type: "Photographer" },
    { id: 103, name: "Neeta Joshi", slug: "neeta-joshi-dummy", city: "Mumbai", rating: 4.9, reviews: 64, tags: "Photographer,Fashion", price: 35000, image: "https://picsum.photos/seed/neeta/600/750", verified: true, type: "Photographer" },
  ];

  const allProfessionals = [...professionals, ...dummyData];

  // Handle Checkbox Toggles
  const toggleType = (type: string) => {
    setActiveTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleCategory = (cat: string) => {
    setActiveCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearAllFilters = () => {
    setActiveTypes(["Photographer", "Videographer", "Reel Creator", "Editor"]);
    setActiveCategories([]);
    setSearchCity("");
  };
  const handleViewProfile = (e: React.MouseEvent, slug: string) => {
  if (status === "unauthenticated") {
    e.preventDefault();
    router.push(`/login?callbackUrl=${encodeURIComponent(`/photographers/${slug}`)}`);
  }
  // if authenticated, let the Link navigate normally
};

  // Apply all filters
  const filtered = allProfessionals.filter(p => {
    const matchesCity = !searchCity || p.city.toLowerCase().includes(searchCity.toLowerCase());
    const matchesType = activeTypes.length === 0 || activeTypes.includes(p.type);
    
    const tagsArray = p.tags ? p.tags.split(",").map(t => t.trim()) : [];
    const matchesCategory = activeCategories.length === 0 || tagsArray.some(tag => activeCategories.includes(tag));
    
    return matchesCity && matchesType && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-serif text-3xl font-bold text-slate-900">Find Photographers & Creators</h1>
          <p className="text-sm text-slate-500 mt-2">Browse {allProfessionals.length}+ verified professionals across India</p>
          
          <div className="mt-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Filters</h3>
              <button onClick={clearAllFilters} className="text-xs text-amber-600 hover:text-amber-700 font-medium">Clear all</button>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">I'm looking for</h4>
            <div className="space-y-3 mb-8">
              {["Photographer", "Videographer", "Reel Creator", "Editor"].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={activeTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer" 
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{type}</span>
                </label>
              ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Category</h4>
            <div className="space-y-3">
              {["Wedding", "Portrait", "Events", "Travel", "Commercial", "Fashion"].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={activeCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer" 
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-600"><strong>{filtered.length}</strong> professionals found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((pro) => {
              const tags = pro.tags ? pro.tags.split(",") : ["Photographer"];
              const imgSrc = pro.image?.startsWith("http") || pro.image?.startsWith("/") 
                ? pro.image 
                : pro.portfolios?.[0]?.imageUrl || `https://picsum.photos/seed/${pro.slug}/600/750`;

              return (
                // FIX: Use pro.id as the key instead of pro.slug to prevent duplicate key errors
                <div key={pro.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={imgSrc} 
                      alt={pro.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {pro.verified && (
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-amber-600 rounded-md uppercase tracking-wider">Verified</span>
                      )}
                      <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white rounded-md uppercase tracking-wider">{pro.type}</span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-lg">{pro.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-slate-700">{pro.rating}</span>
                        <span className="text-xs text-slate-400">({pro.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      {pro.city || "India"}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {tags.map((tag, i) => (
                        <span key={i} className={`px-2.5 py-1 text-[10px] rounded-md font-medium ${i === 0 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting</span>
                        <span className="font-bold text-slate-900">₹{pro.price.toLocaleString()}</span>
                      </div>
                      <Link 
                        href={`/photographers/${pro.slug}`}
                        onClick={(e) => handleViewProfile(e, pro.slug)}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No matches found</h3>
              <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
              <button onClick={clearAllFilters} className="px-5 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700">
                Clear Filters
              </button>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}